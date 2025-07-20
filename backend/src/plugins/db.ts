import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { db } from '../lib/db.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('db', db);
};

export default fp(dbPlugin);