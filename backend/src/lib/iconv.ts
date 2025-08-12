import axios from 'axios';
import iconv from 'iconv-lite';

const sniffCharset = (html: string, contentType?: string) => {
  // 1) Content-Type 우선
  const ctMatch = /charset=([^;]+)/i.exec(contentType || '');
  if (ctMatch) return ctMatch[1].toLowerCase();

  // 2) <meta charset="..."> 스니핑
  const metaMatch =
    /<meta[^>]+charset=["']?\s*([\w-]+)\s*["']?/i.exec(html) ||
    /<meta[^>]+content=["'][^"']*charset=([\w-]+)/i.exec(html);
  if (metaMatch) return metaMatch[1].toLowerCase();

  return undefined;
};

export const fetchHtmlDecoded = async (url: string): Promise<string> => {
  const res = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
    timeout: 15000,
    // 네이버 호환 헤더
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9',
    },
    // transformResponse 비활성화 (원본 바이트 유지)
    transformResponse: [(d) => d],
  });

  const buf = Buffer.from(res.data as any);
  // 임시로 UTF-8 가정 후 meta 스니핑
  let tmp = buf.toString('utf8');
  const charset = sniffCharset(tmp, res.headers['content-type']);

  if (!charset || charset.includes('utf-8')) {
    return tmp; // UTF-8
  }

  // EUC-KR/CP949 처리
  const enc = charset.replace('euc_kr', 'euc-kr').replace('ks_c_5601-1987', 'cp949');
  try {
    return iconv.decode(buf, enc as any); // 'euc-kr' 또는 'cp949'
  } catch {
    // 실패 시 CP949로 다시 시도
    return iconv.decode(buf, 'cp949');
  }
};