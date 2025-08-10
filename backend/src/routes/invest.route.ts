import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { InvestCreateType, InvestRefreshParams } from "../types/invest.type.js";
import { getYearlyFacts } from "../crawler/yearlyFactsService.js";
import dayjs from "dayjs";

const investRoute = (fastify: FastifyInstance) => {
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
      for (let year = start; year < end; year++) {
        await fastify.db.query(`INSERT INTO investment (code, sdate) VALUES ('${code}', '${year}');`);
      }

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
      const { code, targetYear } = req.body as InvestRefreshParams;
      const params =
        targetYear === "all"
          ? {
            code6: code?.replace("A", ""),
            from: 2020,
            to: Number(dayjs().add(-1, "year").format("YYYY")),
          }
          : {
            code6: code?.replace("A", ""),
            from: Number(targetYear),
          };

      const facts = await getYearlyFacts(params);
      console.log("[Yearly Facts]", JSON.stringify(facts, null, 2));
      console.log("[Yearly Facts]", {facts});

      // const sql = `INSERT INTO yearly_facts (code6, year, shares, equity, roe) VALUES (?, ?, ?, ?, ?)`;
      // const sql = `UPDATE investment set count=${} VALUES (?, ?, ?, ?, ?)`;

      const list = facts?.value;
      if (list && list?.length > 0) {
        for (const f of list) {
          const sql = `UPDATE investment set count='${f.shares}', roe='${f.roe?.toFixed(2)}', brate='${f.equity}' WHERE code = '${code}' and sdate = '${f.year}'`
          await fastify.db.query(sql);
        }
      }

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 항목 삭제
  fastify.delete(URL.INVEST.ROOT, async (req, reply) => {
    try {
      const { rowid, code } = req.query as InvestCreateType;

      await fastify.db.query(`DELETE FROM divid WHERE rowid=${rowid};`);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });
};

export default investRoute;
