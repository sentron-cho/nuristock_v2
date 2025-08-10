import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import dayjs from 'dayjs';
import unzipper from 'unzipper';
import { parseStringPromise } from 'xml2js';

const DART_BASE = 'https://opendart.fss.or.kr/api';
const CACHE_DIR = process.env.DATA_CACHE_DIR || '.cache';

const CORP_MAP_JSON = path.join(CACHE_DIR, 'dart_corp_map.json');
const CORP_MAP_ZIP  = path.join(CACHE_DIR, 'corpCode.zip');

const ensureCacheDir = () => {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// 리프레시 캐시
const isCacheFresh = (filePath: string): boolean => {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  const modified = dayjs(stat.mtime).format('YYYY-MM-DD');
  const today    = dayjs().format('YYYY-MM-DD');
  return modified === today; // 오늘자 캐시면 신선
}

// 캐시 데이터 읽어오기
const readCachedMap = async (): Promise<Record<string, string> | null> =>  {
  try {
    const raw = fs.readFileSync(CORP_MAP_JSON, 'utf-8');
    const json = JSON.parse(raw) as Record<string, string>;
    if (json && Object.keys(json).length > 0) return json;
  } catch { /* ignore */ }
  return null;
}

// 다운로드 맵 데이터
const downloadCorpCodeZip = async (): Promise<void> => {
  const url = `${DART_BASE}/corpCode.xml?crtfc_key=${process.env.DART_API_KEY}`;
  const res = await axios.get(url, { responseType: 'stream', timeout: 30 * 1000 });
  await pipeline(res.data, fs.createWriteStream(CORP_MAP_ZIP));
}

// 압축 해제
const unzipToXmlBuffer = async (zipPath: string): Promise<Buffer> => {
  const directory = await unzipper.Open.file(zipPath);
  const entry = directory.files.find(f =>
    /corpcode\.xml/i.test(f.path) || /corpCode\.xml/.test(f.path)
  );
  if (!entry) throw new Error('corpCode.xml not found in zip');
  return await entry.buffer();
}

// 메모리 맵 데이터로 생성
const buildMapFromXml = async (xml: string): Promise<Record<string, string>> => {
  const json = await parseStringPromise(xml);
  const list: any[] = json?.result?.list ?? [];
  const map: Record<string, string> = {};
  for (const item of list) {
    const corp_code  = item?.corp_code?.[0]?.trim?.();
    const stock_code = item?.stock_code?.[0]?.trim?.();
    if (corp_code && stock_code && stock_code.length === 6) {
      map[stock_code] = corp_code; // 6자리 → 8자리
    }
  }
  return map;
}

/** 하루 1회 자동 갱신 캐시 */
export const ensureCorpCodeMap = async (): Promise<Record<string, string>> => {
  ensureCacheDir();

  if (isCacheFresh(CORP_MAP_JSON)) {
    const cached = await readCachedMap();
    if (cached) return cached;
  }

  try {
    await downloadCorpCodeZip();
    const xmlBuf = await unzipToXmlBuffer(CORP_MAP_ZIP);
    const map = await buildMapFromXml(xmlBuf.toString('utf-8'));
    fs.writeFileSync(CORP_MAP_JSON, JSON.stringify(map), 'utf-8');
    return map;
  } catch (err) {
    const cached = await readCachedMap();
    if (cached) return cached;
    throw err;
  }
}

// 개별 코드 가져오기
export const getCorpCodeByStock =  async (code6: string): Promise<string | undefined> => {
  const map = await ensureCorpCodeMap();
  return map[code6];
}
