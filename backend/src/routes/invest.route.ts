import { SqlError } from "mariadb/*";
import { FastifyInstance } from "fastify";
import dayjs from "dayjs";
import URL from "../types/url.js";
import { withError } from "../lib/error.js";
import {
  InvestCreateType,
  InvestRefreshParams,
  ConsensusResult,
  FieldValues,
  InvestBookmarkParams,
} from "../types/data.type.js";
import { getYearlyStockInfoFromDart } from "../crawler/service/yearlyFacts.service.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { ERROR, INVEST_CRALER_TYPE } from "../types/enum.js";
import { getDartReportByStock } from "../crawler/dartFinancial.js";
import { getFnGuideConsensus } from "../crawler/service/fnguideScraper.service.js";
import { getNaverConsensus } from "../crawler/service/naverScraper.service.js";
import { getNaverStockSise, updateStockSise } from "./../crawler/service/stockCrawler.service.js";

const investRoute = (fastify: FastifyInstance) => {
  const updateInvestData = async (code: string, list: Record<string, ConsensusResult>, year: string) => {
    const value = list?.[year?.toString()];

    let params = {
      count: value?.shares,
      ctype: INVEST_CRALER_TYPE.FNGUIDE,
    } as Record<string, string | number>;

    value?.roe && (params["roe"] = value.roe?.toFixed(2));
    value?.equity && (params["equity"] = value.equity?.toFixed(0));

    if (params?.roe && params?.equity) {
      const sql = `UPDATE investment SET ${makeUpdateSet(params)} WHERE code = '${code}' and sdate = '${year}'`;
      await fastify.db.query(sql);
      return true;
    } else return false;
  };

  const updateInvestDataByDart = async (data?: InvestRefreshParams) => {
    if (!data) return;

    const { code, targetYear } = data;

    const facts = await getYearlyStockInfoFromDart({
      code6: code?.replace("A", ""),
      from: Number(dayjs().format("YYYY")),
    });
    const shares = facts?.value?.[0]?.shares;

    const consensus = await getFnGuideConsensus(code?.replace("A", ""), shares); // 현재 년도부터 3년전까지만 가져온다.
    // console.log({ consensus });

    if (consensus) {
      if (targetYear) {
        // 해당 년도만 업데이트
        await updateInvestData(code, consensus, targetYear?.toString());
        return true;
      } else {
        // 올해부터 -3년전까지 업데이트
        const years = Object.keys(consensus)?.map((a) => Number(a));
        for (let year = years?.[0]; year <= years?.[years?.length - 1]; year++) {
          await updateInvestData(code, consensus, year?.toString());
        }

        return true;
      }
    } else {
      return false;
    }
  };

  // 가치투자 종목 목록 조회
  fastify.get(URL.INVEST.ROOT, async (_req, reply) => {
    try {
      const value = await fastify.db.query(
        `SELECT k.*, m.name as name FROM investment k JOIN market m ON k.code = m.code;`
      );

      const codes = value.map((a) => `'${a.code}'`).join(","); // ✅ 문자열로 변환
      const sise =
        codes?.length > 0 ? await fastify.db.query(`SELECT * FROM market WHERE code in (${codes})`) : undefined;
      const dashboard = await fastify.db.query("SELECT * FROM dashboard;");

      return { value, sise, dashboard };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 추가
  fastify.post(URL.INVEST.ROOT, async (req, reply) => {
    try {
      const { code, name } = req.body as InvestCreateType;

      if (!code)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not code!" } as SqlError, { tag: URL.INVEST.ROOT })
          );

      const isDup = await fastify.db.query(`SELECT count(1) as count FROM investment WHERE code = '${code}';`);

      if (isDup?.[0]?.count > 0) {
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_DUP_ENTRY, sqlMessage: "duplicate code!" } as SqlError, { tag: URL.INVEST.ROOT })
          );
      }

      const start = Number(dayjs().add(-3, "year").format("YYYY"));
      const end = Number(dayjs().format("YYYY"));
      const type = INVEST_CRALER_TYPE.NONE;
      for (let year = start; year <= end; year++) {
        await fastify.db.query(`INSERT INTO investment (code, sdate, ctype) VALUES ('${code}', '${year}', '${type}');`);
      }

      const marketinfo = await fastify.db.query(
        `SELECT roe, scount, debt, equity, cdate FROM marketinfo WHERE code = '${code}' and cdate >= '${start}' `
      );

      // 이름이 있고 이름이 market에 저장된 이름과 다르면 업데이트
      if (name) {
        const market = await fastify.db.query(`SELECT name, code FROM marketinfo WHERE code = '${code}'`);
        if (market && market?.[0]?.name !== name) {
          await fastify.db.query(`UPDATE market SET name = '${name}' WHERE code = '${code}';`);
        }
      }

      if (marketinfo && marketinfo?.length > 1) {
        for (const data of marketinfo ?? []) {
          const params = {
            code: code,
            sdate: data?.cdate,
            roe: data?.roe,
            count: data?.scount,
            equity: data?.equity,
            ctype: INVEST_CRALER_TYPE.FNGUIDE,
          };

          await fastify.db.query(
            `UPDATE investment SET ${makeUpdateSet(params)} WHERE code = '${code}' and sdate = '${data?.cdate}';`
          );
        }
      } else {
        // dart api를 통해 데이터 수신 및 저장
        await updateInvestDataByDart({ code } as InvestRefreshParams);
      }

      // 시세 데이터 업데이트
      const sise = await getNaverStockSise(code?.replace("A", ""));
      await updateStockSise(fastify, sise as FieldValues);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 수정
  fastify.put(URL.INVEST.ROOT, async (req, reply) => {
    try {
      const { rowid, ctype } = req.body as InvestCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.INVEST.ROOT })
          );

      await fastify.db.query(
        `UPDATE investment SET ${makeUpdateSet({
          ...(req.body || {}),
          ctype: ctype || INVEST_CRALER_TYPE.MANUAL,
        } as FieldValues)} WHERE rowid ='${rowid}';`
      );
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 신규 년도 추가
  fastify.post(URL.INVEST.YEAR, async (req, reply) => {
    try {
      const { sdate } = req.body as InvestCreateType;

      await fastify.db.query(
        `INSERT INTO investment ${makeInsertSet({
          ...(req.body || {}),
          ctype: INVEST_CRALER_TYPE.MANUAL,
        } as FieldValues)};`
      );

      // const sql = `INSERT INTO investment ${makeInsertSet({
      //   ...(req.body || {}),
      //   ctype: INVEST_CRALER_TYPE.MANUAL,
      // } as FieldValues)};`;

      reply.status(200).send({ value: sdate });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 데이터 갱신
  fastify.put(URL.INVEST.REFRESH, async (req, reply) => {
    try {
      const { code } = req.body as InvestRefreshParams;
      const res = await updateInvestDataByDart(req?.body as InvestRefreshParams);

      if (!res)
        return reply.status(500).send(
          withError({ code: ERROR.ER_NOT_UPDATED, sqlMessage: "is not updated!" } as SqlError, {
            tag: URL.INVEST.ROOT,
          })
        );

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
      if (!values || !values?.equity || !values?.roe) {
        values = await getNaverConsensus(code?.replace("A", ""));
        type = INVEST_CRALER_TYPE.NAVER;
      }

      if (!values || !values?.equity || !values?.roe)
        reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_UNKNOW, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.INVEST.ROOT })
          );

      // 네이버는 당기순이익만 가져오므로 직전년도 자기자본에서 당기순이익을 더하자
      const prevYear = dayjs().add(-1, "year").format("YYYY");
      const data = await fastify.db.query(
        `SELECT equity FROM investment WHERE code = '${code}' AND sdate = '${prevYear}' `
      );

      const EUK = 100000000; // 억원
      const { roe } = values as ConsensusResult;
      const equity = Number(values?.equity) * EUK + (type === INVEST_CRALER_TYPE.NAVER ? Number(data?.[0]?.equity) : 0);

      const params = { roe: roe, equity: equity, ctype: type };
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

  // 가치투자 종목 항목 삭제
  fastify.delete(URL.INVEST.ROOT, async (req, reply) => {
    try {
      const { rowid, code } = req.query as InvestCreateType;

      if (code) {
        await fastify.db.query(`DELETE FROM investment WHERE code='${code}';`);
      } else if (rowid) {
        await fastify.db.query(`DELETE FROM investment WHERE rowid=${rowid};`);
      }

      reply.status(200).send({ value: code || rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 데이터 초기화
  fastify.put(URL.INVEST.CLEAR, async (req, reply) => {
    try {
      const { rowid } = req.body as InvestCreateType;

      // 데이터 초기화
      const params = {
        roe: "",
        equity: "",
        profit: "",
        brate: "",
        rate1: "",
        rate2: "",
        rate3: "",
        rate4: "",
        ctype: "",
      };
      await fastify.db.query(`UPDATE investment SET ${makeUpdateSet(params as FieldValues)} WHERE rowid ='${rowid}';`);
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

  // 가치투자 항목 북마크
  fastify.put(URL.INVEST.BOOKMARK, async (req, reply) => {
    try {
      const { rowid, bookmark } = req.body as InvestBookmarkParams;

      console.log({ bookmark });

      const res = fastify.db.query(`UPDATE investment SET bookmark = ${Boolean(bookmark)} WHERE rowid = '${rowid}';`);

      if (!res)
        return reply.status(500).send(
          withError({ code: ERROR.ER_NOT_UPDATED, sqlMessage: "is not updated!" } as SqlError, {
            tag: URL.INVEST.ROOT,
          })
        );

      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.BOOKMARK }));
    }
  });
};

export default investRoute;
