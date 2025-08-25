import axios from "axios";
import { REST_API } from "../types/url.js";
import { TIME_OUT } from "../types/constants.js";
import { StockDartBasicType } from "../types/data.type.js";
import { saveText } from "../lib/writefile.js";

const URL_FS = REST_API.DART_FS;
const URL_COMPANY = REST_API.DART_COMPANY;
const URL_SHARES = REST_API.DART_SHARES;

/** 숫자 파싱 유틸(콤마/공백 제거) */
const toNum = (v: unknown): number | undefined => {
  const s = String(v ?? "")
    .replace(/,/g, "")
    .trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

/** 문자열 포함 검사 유틸 */
const inc = (s: unknown, kw: string) => (typeof s === "string" ? s.toLowerCase().includes(kw.toLowerCase()) : false);

/** 재무제표에서 원하는 계정 항목을 찾는 헬퍼 */
const pickAccount = (
  list: any[] | undefined,
  {
    sjDivPrefer = ["IS", "BS"], // 손익계산서, 재무상태표
    fsPrefer = ["CFS", "OFS"], // 연결 우선, 없으면 개별
    // 계정명 후보 (한국어/IFRS tag)
    accountNames = ['ifrs-full_Equity'] as Array<string | RegExp>,
  }: {
    sjDivPrefer?: string[];
    fsPrefer?: string[];
    accountNames: Array<string | RegExp>;
  }
): any | undefined => {
  if (!Array.isArray(list)) return;

  // 우선순위: (연결/CFS 우선) + (IS/BS 우선) + 계정명 매칭
  const score = (row: any) => {
    let s = 0;
    // 서브젝트(IS/BS)
    if (sjDivPrefer.some((sj) => row.sj_div === sj || inc(row.sj_nm, sj))) s += 10;
    // 연결/개별
    if (fsPrefer.some((fs) => row.fs_div === fs || inc(row.fs_nm, fs === "CFS" ? "연결" : "개별"))) s += 10;
    // if (row.account_id === 'ifrs-full_Equity') s += 10;
    // 계정명
    if (
      accountNames.some((a) =>
        a instanceof RegExp
          ? (typeof row.account_nm === "string" && a.test(row.account_nm)) ||
            (typeof row.account_id === "string" && a.test(row.account_id))
          : inc(row.account_nm, a) || inc(row.account_id, a)
      )
    ) {
      s += 100;
    }
    return s;
  };

  return [...list].sort((a, b) => score(b) - score(a))[0];
};

/**
 * DART에서 가져올 수 있는 핵심 정보(순이익, 자본/부채, 액면가, 발행주식수)를 모아
 * EPS/ROE/부채비율까지 계산해서 반환
 *
 * @param corpCode8 DART 8자리 고유번호 (예: '00126380')
 * @param year 사업연도 (예: 2024)
 * @param reprtCode 보고서 코드 (기본: '11011' = 사업보고서)
 */

export const fetchDartBasicSnapshot = async (
  corpCode8: string,
  year: number,
  reprtCode: "11011" | "11012" | "11013" | "11014" = "11011"
): Promise<StockDartBasicType> => {
  const crtfc_key = process.env.DART_API_KEY;
  if (!crtfc_key) {
    throw new Error("DART_API_KEY 가 환경변수에 설정되어 있지 않습니다.");
  }

  // 1) 재무제표 조회 (fnlttSinglAcntAll)
  const fsParams = {
    crtfc_key,
    corp_code: corpCode8,
    bsns_year: year,
    reprt_code: reprtCode, // 11011: 사업보고서(정기), 11012/3/4: 분/반기
    fs_div: "CFS", // ✅ 연결 재무제표 (필수) CFS(연결), OFS(개별)
  };

  const res = await axios.get(URL_FS, { params: fsParams, timeout: TIME_OUT });
  console.log({URL_FS, fsParams});
  console.log(res);

  const { data: fsData } = res;
  const fsList = fsData?.list as any[] | undefined;

  // 디버깅/검증용 저장 (선택)
  // saveText?.("dart_fs.json", JSON.stringify(fsData));

  // 당기순이익
  const netIncomeRow =
    pickAccount(fsList, {
      sjDivPrefer: ["IS"],
      fsPrefer: ["CFS", "OFS"],
      accountNames: [
        "당기순이익",
        "지배기업 소유주지분 순이익",
        /profit\s*loss/i, // ifrs-full_ProfitLoss
        /profitloss/i,
      ],
    }) ?? undefined;
  const netIncome = toNum(netIncomeRow?.thstrm_amount);

  // 자본총계
  const equityRow = pickAccount(fsList, {
    sjDivPrefer: ["BS"],
    fsPrefer: ["CFS", "OFS"],
    accountNames: [
      'ifrs-full_Equity', // ifrs-full_Equity
      "자본총계",
      "지배기업의 소유주에게 귀속되는 자본",
    ],
  });

  // console.log({ equityRow });

  const equityTotal = toNum(equityRow?.thstrm_amount);

  // 부채총계
  const liabilitiesRow = pickAccount(fsList, {
    sjDivPrefer: ["BS"],
    fsPrefer: ["CFS", "OFS"],
    accountNames: ["부채총계", /liabilities/i], // ifrs-full_Liabilities
  });
  const liabilitiesTotal = toNum(liabilitiesRow?.thstrm_amount);

  // 2) 회사개요 조회 (par value, total shares)
  //    - 일부 종목은 값이 없을 수 있음(그 경우 undefined)
  const { data: companyData } = await axios.get(URL_COMPANY, {
    params: { crtfc_key, corp_code: corpCode8 },
    timeout: TIME_OUT,
  });

  // saveText?.('dart_company.json', JSON.stringify(companyData));

  const params = {
    crtfc_key: process.env.DART_API_KEY,
    corp_code: corpCode8,
    bsns_year: year,
    reprt_code: reprtCode,
  };

  const { data } = await axios.get(URL_SHARES, { params, timeout: TIME_OUT });
  const row = Array.isArray(data?.list) ? data.list[0] : undefined;
  const raw = row.istc_totqy ?? row.issuetotqy ?? row?.totqy;
  const shares = Number(String(raw ?? "").replace(/,/g, ""));

  // DART company 응답 스키마는 공시 시기에 따라 키가 조금 다를 수 있음:
  // - par_value, parval, parvalue 등으로 볼 수 있으니 유연하게 파싱
  const parValue =
    toNum(companyData?.par_value) ??
    toNum(companyData?.parvalue) ??
    toNum(companyData?.parval) ??
    toNum(companyData?.par);

  // - 총발행주식수 역시 stock_total, tot_shrs, total_shares 등 다양하게 등장할 수 있어 유연 매핑
  const totalShares =
    toNum(companyData?.stock_total) ??
    toNum(companyData?.tot_shrs) ??
    toNum(companyData?.total_shares) ??
    toNum(companyData?.stocks) ??
    toNum(companyData?.total) ??
    shares;

  // 3) 파생값 계산
  const EPS = netIncome && totalShares ? netIncome / totalShares : undefined;
  const ROE = netIncome && equityTotal ? netIncome / equityTotal * 100 : undefined;
  const debtRatio = liabilitiesTotal && equityTotal && equityTotal !== 0 ? liabilitiesTotal / equityTotal : undefined;

  return {
    corpCode: corpCode8,
    year,
    reprtCode,
    netIncome,
    equity: equityTotal,
    debt: liabilitiesTotal,
    parValue,
    shares: totalShares,
    eps: Number(EPS?.toFixed(2)),
    roe: Number(ROE?.toFixed(2)),
    debtRatio: Number(debtRatio?.toFixed(2)),
  };
};
