import autoLoad from "fastify-autoload";
import cors from "fastify-cors";
import jwt from "fastify-jwt";
import postgres from "fastify-postgres";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = async (fastify, opts) => {
  fastify.register(jwt, { secret: process.env.JWT_SECRET });
  fastify.register(cors, { origin: process.env.CORS_ORIGIN });
  fastify.register(postgres, {
    connectionString: process.env.DB_CONNECTION_STRING,
  });

  fastify.register(autoLoad, {
    dir: join(__dirname, "plugins"),
    options: { ...opts },
  });

  fastify.register(autoLoad, {
    dir: join(__dirname, "services"),
    options: { ...opts },
  });
};

export default app;
