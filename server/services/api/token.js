import { TOKEN } from "../routes.js";

export default async (app) => {
  app.get(
    TOKEN.VALIDATE,
    {
      preValidation: [app.authenticate],
    },
    async function (request, reply) {
      reply.status(200).send({ msg: "Success" });
    }
  );
};
