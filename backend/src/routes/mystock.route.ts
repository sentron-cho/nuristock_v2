import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { mock as mockData } from "../mock/mystock/mystock.list.js";
import { mock as mockSise } from "../mock/mystock/mystock.sise.js";

const mystockRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.query });
    const { code } = req.query as { code?: string };

    return mockData;
  });

  fastify.get(URL.MYSTOCK.SISE, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.SISE}`, query: req.query });
    const { code } = req.query as { code?: string };

    return mockSise;
  });
};

export default mystockRoute;
