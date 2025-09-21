import axios from "axios";
import { getCorpCodeByStock } from "./dartCorpmap.js";
import { REST_API } from "../types/url.js";
import { TIME_OUT } from "../types/constants.js";

const URL_EQUITY = REST_API.DART_EQUITY;
const URL_ROE = REST_API.DART_ROE;
const URL_SHARES = REST_API.DART_SHARES;

// 지배주주지분
export const fetchEquity = async (corpCode8: string, year: number): Promise<number | undefined> => {
  const params = {
    crtfc_key: process.env.DART_API_KEY,
    corp_code: corpCode8,
    bsns_year: year,
    reprt_code: "11011", // 사업보고서
  };

  const { data } = await axios.get(URL_EQUITY, {
    params,
    timeout: TIME_OUT,
  });

  const list = data?.list as any[] | undefined;
  if (!Array.isArray(list)) return;

  const isBalanceSheet = (x: any) => x.sj_div === "BS" || x.sj_nm?.includes?.("재무상태표");

  const isConsolidated = (x: any) => x.fs_div === "CFS" || x.fs_nm?.includes?.("연결");

  const getNumber = (str: string | undefined) => Number(String(str ?? "").replace(/,/g, ""));

  // ✅ 우선 지배기업소유지분 → 자본총계(지배) → 자본총계 순으로 검색
  const target =
    list.find((x) => isBalanceSheet(x) && isConsolidated(x) && /지배.*(지분|주주)/.test(x.account_nm)) ??
    list.find(
      (x) =>
        isBalanceSheet(x) && (x.account_nm === "자본총계(지배)" || x.account_nm === "자본총계") && isConsolidated(x)
    ) ??
    list.find((x) => isBalanceSheet(x) && x.account_nm === "자본총계");

  if (!target) return;
  const val = getNumber(target.thstrm_amount);
  return Number.isFinite(val) ? val : undefined;
};

/** ROE (지표 API: 2023년 이후 제공 권장) */
export const fetchROEIndicator = async (corpCode8: string, year: number): Promise<number | undefined> => {
  const params = {
    crtfc_key: process.env.DART_API_KEY,
    corp_code: corpCode8,
    bsns_year: year,
    reprt_code: "11011",
    idx_cl_code: "M210000", // 수익성지표
  };

  const { data } = await axios.get(URL_ROE, { params, timeout: TIME_OUT });

  const list = data?.list as any[] | undefined;
  if (!Array.isArray(list)) return;

  const roe = list.find((x) => x.idx_nm === "ROE");
  if (!roe) return;

  const val = Number(String(roe.idx_val ?? "").replace(/,/g, ""));
  return Number.isFinite(val) ? val : undefined; // %
};

/** 당기순이익 (ROE 직접 계산용) */
export const fetchNetIncome = async (corpCode8: string, year: number): Promise<number | undefined> => {
  const params = {
    crtfc_key: process.env.DART_API_KEY,
    corp_code: corpCode8,
    bsns_year: year,
    reprt_code: "11011",
  };
  const { data } = await axios.get(URL_EQUITY, { params, timeout: TIME_OUT });

  const list = data?.list as any[] | undefined;
  if (!Array.isArray(list)) return;

  const target =
    list.find(
      (x) =>
        (x.sj_div === "IS" || x.sj_nm?.includes?.("손익계산서")) &&
        (x.account_nm === "당기순이익" || x.account_nm === "지배기업 소유주지분 순이익") &&
        (x.fs_div === "CFS" || x.fs_nm?.includes?.("연결"))
    ) ?? list.find((x) => (x.sj_div === "IS" || x.sj_nm?.includes?.("손익계산서")) && x.account_nm === "당기순이익");

  if (!target) return;
  const val = Number(String(target.thstrm_amount ?? "").replace(/,/g, ""));
  return Number.isFinite(val) ? val : undefined;
};

/* ── 최신 기준(가장 최근 정기보고서) 발행주식총수 ───────────────── */
const REPORTS = [
  // { code: "11014", name: "3분기보고서" },
  // { code: "11013", name: "1분기보고서" },
  // { code: "11012", name: "반기보고서" },
  { code: "11011", name: "사업보고서" },
] as const;

export type LatestIssuedShares = {
  year: number;
  reprtCode: (typeof REPORTS)[number]["code"];
  reprtName: string;
  shares: number;
};

/** 종목코드(6자리) 기준 */
export const fetchLatestIssuedSharesByStock = async (
  code6: string,
  year = new Date().getFullYear()
): Promise<LatestIssuedShares | undefined> => {
  const corpCode = await getCorpCodeByStock(code6);
  if (!corpCode) throw new Error(`corp_code not found for stock ${code6}`);

  const params = {
    crtfc_key: process.env.DART_API_KEY,
    corp_code: corpCode,
    bsns_year: year,
    reprt_code: "11011", // 사업보고서
  };

  const { data } = await axios.get(URL_SHARES, { params, timeout: TIME_OUT });
  // console.log({ params, data });

  if (data?.status === "020") {
    // console.log("[사용한도 초과]", { data: { year, ...res?.data } });
    return { year, reprtCode: data?.status, reprtName: data?.message, shares: 0 };
  }

  const row = Array.isArray(data?.list) ? data.list[0] : undefined;
  if (!row) return { year: 0, reprtCode: "11011", reprtName: "사업보고서", shares: 0 };

  const raw = row.istc_totqy ?? row.issuetotqy ?? row?.totqy;
  const shares = Number(String(raw ?? "").replace(/,/g, ""));
  if (Number.isFinite(shares)) {
    return { year, reprtCode: "11011", reprtName: "사업보고서", shares };
  }

  return { year: 0, reprtCode: "11011", reprtName: "사업보고서", shares: 0 };
};

/** 종목코드(6자리) 기준 사업보고서 가져오기 */
export const getDartReportByStock = async (code6: string, year: number): Promise<unknown> => {
  const corpCode = await getCorpCodeByStock(code6);
  if (!corpCode) throw new Error(`corp_code not found for stock ${code6}`);

  const params = {
    crtfc_key: process.env.DART_API_KEY,
    corp_code: corpCode,
    bsns_year: year,
    reprt_code: "11011",
  };

  const { data } = await axios.get(URL_SHARES, { params, timeout: TIME_OUT });
  return data?.list;
};
