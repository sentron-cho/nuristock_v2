import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { mock as mockData } from "../mock/dashboard/dashboard.list.js";
import { mock as mockSise } from "../mock/dashboard/dashboard.sise.js";

const dashboardRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.DASHBOARD.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.DASHBOARD.ROOT}` });

    return mockData;
  });

  fastify.get(URL.DASHBOARD.SISE, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.DASHBOARD.SISE}` });

    return mockSise;
  });
};

export default dashboardRoute;
