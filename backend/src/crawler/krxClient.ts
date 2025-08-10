import axios from 'axios';

// TODO: 실제 발급받은 KRX(공공데이터포털) 엔드포인트로 교체
const KRX_BASE = 'https://api.data.go.kr/openapi/XXXXXXXX';

export const fetchListedSharesAtDate = async (code6: string, yyyymmdd: string): Promise<number | undefined> => {
  const params: Record<string, string | number> = {
    serviceKey: process.env.KRX_API_KEY!,
    pageNo: 1,
    numOfRows: 100,
    basDt: yyyymmdd,
    likeSrtnCd: code6,
  };

  const { data } = await axios.get(KRX_BASE, { params, timeout: 15_000 });

  const items = data?.response?.body?.items ?? data?.items ?? [];
  const first = Array.isArray(items) ? items[0] : items;
  const raw = first?.lstgStCnt ?? first?.listedShares ?? first?.stckIssuCnt;

  const val = Number(String(raw ?? '').replace(/,/g, ''));
  return Number.isFinite(val) ? val : undefined;
};
