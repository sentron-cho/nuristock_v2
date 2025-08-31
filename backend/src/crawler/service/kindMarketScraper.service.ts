import { REST_API } from './../../types/url';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

// KIND 페이지들 (HTML 테이블을 파싱)
const URL_NEW = REST_API.KIND_MARKET_NEW;
const URL_DELIST = REST_API.KIND_MARKET_DEL;

// 시장 표기 정규화
const normalizeMarket = (s?: string) => {
  if (!s) return '';
  if (s.includes('유가')) return 'KOSPI';
  if (s.includes('코스닥')) return 'KOSDAQ';
  return s.trim();
};

type ListingItem = {
  market: 'KOSPI' | 'KOSDAQ' | string;
  name: string;
  date: string;      // YYYY-MM-DD
  type: '신규상장' | '상장폐지' | string;
  extra?: string;    // 필요시 비고
};

const isTodayKST = (iso: string) => {
  const now = dayjs().tz('Asia/Seoul');
  const d = dayjs(iso);
  return d.tz('Asia/Seoul').format('YYYY-MM-DD') === now.format('YYYY-MM-DD');
};

export const fetchNewListings = async (): Promise<ListingItem[]> => {
  const { data: html } = await axios.get(URL_NEW, { timeout: 15_000 });
  const $ = cheerio.load(html);

  // 페이지 구조: 표의 행에 "시장 / 종목명 / 공지일 / 구분(신규상장)" 유사 컬럼 존재
  // 실제 컬럼명은 시점에 따라 조금 달라질 수 있으니, 텍스트를 기반으로 일반화
  const items: ListingItem[] = [];
  $('table tbody tr').each((_, el) => {
    const tds = $(el).find('td').map((__, td) => $(td).text().trim()).get();

    // 경험상: [시장, 종목명, 날짜, 구분] 형태가 많음
    const [marketRaw, name, date, kind] = tds;
    if (!name || !date) return;

    const market = normalizeMarket(marketRaw);
    if (market !== 'KOSPI' && market !== 'KOSDAQ') return;

    items.push({
      market,
      name,
      date: dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : date,
      type: kind?.includes('신규') ? '신규상장' : (kind || '신규상장'),
    });
  });

  return items;
};

export const fetchDelistings = async (): Promise<ListingItem[]> => {
  const { data: html } = await axios.get(URL_DELIST, { timeout: 15_000 });
  const $ = cheerio.load(html);

  const items: ListingItem[] = [];
  $('table tbody tr').each((_, el) => {
    const tds = $(el).find('td').map((__, td) => $(td).text().trim()).get();

    // 경험상: [번호?, 시장, 종목명, 구분(상장폐지 …), 날짜] 또는 유사 순서
    // 아래는 안전하게 '시장/종목명/날짜/구분'을 찾는 방식
    const market = normalizeMarket(tds.find((t) => t.includes('유가') || t.includes('코스닥')));
    const name = tds[2] || tds[1] || '';  // 표 구조 변동 대비
    const date = (tds.find((t) => /\d{4}-\d{2}-\d{2}/.test(t)) || '').slice(0, 10);
    const kind = (tds.find((t) => t.includes('상장폐지')) || '상장폐지');

    if (!name || !date) return;
    if (market !== 'KOSPI' && market !== 'KOSDAQ') return;

    items.push({
      market,
      name,
      date,
      type: '상장폐지',
    });
  });

  return items;
};
