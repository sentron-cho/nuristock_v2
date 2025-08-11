import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { InvestCreateType, InvestRefreshParams } from "../types/invest.type.js";
import { getYearlyFacts } from "../crawler/yearlyFactsService.js";
import dayjs from "dayjs";
import { makeUpdateSet } from "../lib/db.util.js";
import { FieldValues } from "../types/common.type.js";

const investRoute = (fastify: FastifyInstance) => {
  const updateInvestData = async (data?: InvestRefreshParams) => {
    if (!data) return;

    const { code, targetYear } = data;
    const params =
      !targetYear || targetYear === "all"
        ? {
            code6: code?.replace("A", ""),
            from: 2020,
            to: Number(dayjs().format("YYYY")),
          }
        : {
            code6: code?.replace("A", ""),
            from: Number(targetYear),
          };

    const facts = await getYearlyFacts(params);
    console.log("[Yearly Facts]", JSON.stringify(facts, null, 2));
    console.log("[Yearly Facts]", { facts });

    const list = facts?.value;
    if (list && list?.length > 0) {
      for (const f of list) {
        let params = {
          count: f.shares,
        } as Record<string, string | number>;

        f?.roe && (params["roe"] = f.roe?.toFixed(2));
        f?.equity && (params["roe"] = f.equity);

        makeUpdateSet();
        const sql = `UPDATE investment set ${makeUpdateSet(params)} WHERE code = '${code}' and sdate = '${f.year}'`;
        await fastify.db.query(sql);
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

      const start = 2020;
      const end = Number(dayjs().format("YYYY"));
      for (let year = start; year <= end; year++) {
        await fastify.db.query(`INSERT INTO investment (code, sdate) VALUES ('${code}', '${year}');`);
      }

      await updateInvestData({ code } as InvestRefreshParams);

      // await fastify.db.query(`INSERT INTO invest ${makeInsertSet(req.body as FieldValues)}`);
      // reply.status(200).send({ value: code });
      // const latest = await fetchLatestIssuedSharesByStock("005380");
      // console.log("[Latest Issued Shares]", latest);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 데이터 갱신
  fastify.put(URL.INVEST.REFRESH, async (req, reply) => {
    try {
      const { code } = req.body as InvestRefreshParams;

      await updateInvestData(req?.body as InvestRefreshParams);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 삭제(데이터 초기화)
  fastify.delete(URL.INVEST.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.query as InvestCreateType;

      // 데이터 초기화
      const params = { roe: "", bs: "", profit: "", brate: "", rate1: "", rate2: "", rate3: "", rate4: "" };
      await fastify.db.query(`UPDATE investment SET ${makeUpdateSet(params as FieldValues)} WHERE rowid ='${rowid}';`);

      // await fastify.db.query(`DELETE FROM investment WHERE rowid=${rowid};`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 데이터 초기화
  fastify.put(URL.INVEST.CLEAR, async (req, reply) => {
    try {
      const { rowid } = req.body as InvestCreateType;

      // 데이터 초기화
      const params = { roe: "", bs: "", profit: "", brate: "", rate1: "", rate2: "", rate3: "", rate4: "" };
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
};

export default investRoute;
