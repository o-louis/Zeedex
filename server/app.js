import cors from "fastify-cors";
import jwt from "fastify-jwt";
import postgres from "fastify-postgres";

const app = async (fastify, opts) => {
  fastify.register(jwt, { secret: process.env.JWT_SECRET });
  fastify.register(cors, { origin: process.env.CORS_ORIGIN });
  fastify.register(postgres, {
    connectionString: process.env.DB_CONNECTION_STRING,
  });
};

export default app;
