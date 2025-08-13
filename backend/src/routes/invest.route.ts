import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { InvestCreateType, InvestRefreshParams } from "../types/invest.type.js";
import { getYearlyFacts } from "../crawler/yearlyFactsService.js";
import dayjs from "dayjs";
import { makeUpdateSet } from "../lib/db.util.js";
import { FieldValues } from "../types/common.type.js";
import { INVEST_CRALER_TYPE } from "../types/enum.js";
import { getDartReportByStock } from "../crawler/dartFinancial.js";
import { getFnGuideConsensus } from "../crawler/service/fnguideScraper.service.js";
import { getNaverConsensus } from "../crawler/service/naverScraper.service.js";
import { ConsensusResult } from "../types/crowler.type.js";

const investRoute = (fastify: FastifyInstance) => {
  const updateInvestData = async (data?: InvestRefreshParams) => {
    if (!data) return;

    const { code, targetYear } = data;

    const updateData = async (list: Record<string, ConsensusResult>, year: string) => {
      const value = list?.[year?.toString()];
      console.log({ year, value });

      let params = {
        count: shares,
        ctype: INVEST_CRALER_TYPE.FNGUIDE,
      } as Record<string, string | number>;

      value?.roe && (params["roe"] = value.roe?.toFixed(2));
      value?.netProfit && (params["profit"] = value.netProfit);

      const sql = `UPDATE investment set ${makeUpdateSet(params)} WHERE code = '${code}' and sdate = '${year}'`;
      await fastify.db.query(sql);
    };

    const facts = await getYearlyFacts({ code6: code?.replace("A", ""), from: Number(dayjs().format("YYYY")) });
    const shares = facts?.value?.[0]?.shares;
    const consensus = await getFnGuideConsensus(code?.replace("A", "")); // 현재 년도부터 3년전까지만 가져온다.

    if (shares && consensus) {
      if (targetYear) {
        // 해당 년도만 업데이트
        await updateData(consensus, targetYear?.toString());
      } else {
        // 올해부터 -3년전까지 업데이트
        const years = Object.keys(consensus)?.map((a) => Number(a));
        for (let year = years?.[0]; year <= years?.[years?.length-1]; year++) {
          await updateData(consensus, year?.toString());
        }
      }
    }
  };

  // 가치투자 종목 목록 조회
  fastify.get(URL.INVEST.ROOT, async (_req, reply) => {
    try {
      const value = await fastify.db.query(
        `SELECT k.*, m.name as name FROM investment k JOIN market m ON k.code = m.code;`
      );

      return {
        value: value,
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 추가
  fastify.post(URL.INVEST.ROOT, async (req, reply) => {
    try {
      const { code } = req.body as InvestCreateType;

      const start = Number(dayjs().add(-3, "year").format("YYYY"));
      const end = Number(dayjs().format("YYYY"));
      const type = INVEST_CRALER_TYPE.NONE;
      for (let year = start; year <= end; year++) {
        await fastify.db.query(`INSERT INTO investment (code, sdate, ctype) VALUES ('${code}', '${year}', '${type}');`);
      }

      await updateInvestData({ code } as InvestRefreshParams);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 데이터 갱신(DART 사업보고서 기준 연간실적)
  fastify.put(URL.INVEST.REFRESH, async (req, reply) => {
    try {
      const { code } = req.body as InvestRefreshParams;

      await updateInvestData(req?.body as InvestRefreshParams);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 데이터 갱신(FNGUIDE or 네이버 추정치)
  fastify.put(URL.INVEST.UPDATE_BY_NAVER, async (req, reply) => {
    try {
      const { code, targetYear } = req.body as InvestRefreshParams;

      // fnguid를 통해 가져오고..
      let type = INVEST_CRALER_TYPE.FNGUIDE;
      const list = await getFnGuideConsensus(code?.replace("A", ""));
      const now = dayjs().format("YYYY");
      let values: ConsensusResult | undefined = {};
      if (list && list?.[now]) {
        values = list[now];
      }

      // 안되면 차선으로 네이버로...
      if (!values || !values?.netProfit || !values?.roe) {
        values = await getNaverConsensus(code?.replace("A", ""));
        type = INVEST_CRALER_TYPE.NAVER;
      }

      if (!values || !values?.netProfit || !values?.roe)
        reply
          .status(500)
          .send(
            withError({ code: "ER_NOT_UNKNOW", sqlMessage: "is not rowid!" } as SqlError, { tag: URL.INVEST.ROOT })
          );

      console.log("[SCRAPE_CONSENSUS]", { values });

      // 네이버는 당기순이익만 가져오므로 직전년도 자기자본에서 당기순이익을 더하자
      const prevYear = dayjs().add(-1, "year").format("YYYY");
      const data = await fastify.db.query(
        `SELECT profit FROM investment WHERE code = '${code}' AND sdate = '${prevYear}' `
      );

      const EUK = 100000000; // 억원
      const { netProfit, roe } = values as FieldValues;
      const profit = Number(netProfit) * EUK + (type === INVEST_CRALER_TYPE.NAVER ? Number(data?.[0]?.profit) : 0);

      const params = { roe: roe, profit: profit, ctype: type };
      await fastify.db.query(
        `UPDATE investment SET ${makeUpdateSet(
          params as FieldValues
        )} WHERE code ='${code}' and sdate = '${targetYear}';`
      );

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 삭제(데이터 초기화)
  fastify.delete(URL.INVEST.ROOT, async (req, reply) => {
    try {
      // const { rowid } = req.query as InvestCreateType;

      // // 데이터 초기화
      // const params = { roe: "", bs: "", profit: "", brate: "", rate1: "", rate2: "", rate3: "", rate4: "" };
      // await fastify.db.query(`UPDATE investment SET ${makeUpdateSet(params as FieldValues)} WHERE rowid ='${rowid}';`);

      // await fastify.db.query(`DELETE FROM investment WHERE rowid=${rowid};`);
      reply.status(200).send({ value: "" });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 데이터 초기화
  fastify.put(URL.INVEST.CLEAR, async (req, reply) => {
    try {
      const { rowid } = req.body as InvestCreateType;

      // 데이터 초기화
      const params = { roe: "", bs: "", profit: "", brate: "", rate1: "", rate2: "", rate3: "", rate4: "", ctype: "" };
      await fastify.db.query(`UPDATE investment SET ${makeUpdateSet(params as FieldValues)} WHERE rowid ='${rowid}';`);

      console.log({ query: `UPDATE investment SET ${makeUpdateSet(params as FieldValues)} WHERE rowid ='${rowid}';` });

      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 수정
  fastify.put(URL.INVEST.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as InvestCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(withError({ code: "ER_NOT_ROWID", sqlMessage: "is not rowid!" } as SqlError, { tag: URL.INVEST.ROOT }));

      await fastify.db.query(
        `UPDATE investment SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`
      );
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 사업 보고서 조회
  fastify.get(URL.INVEST.REPORT, async (req, reply) => {
    try {
      const { code, targetYear } = req.query as InvestRefreshParams;

      console.log("[getDartReportByStock]", { code, targetYear });

      const value = await getDartReportByStock(code?.replace("A", ""), Number(targetYear));

      reply.status(200).send({ value: value });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });
};

export default investRoute;
