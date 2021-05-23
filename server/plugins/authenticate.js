import plugin from "fastify-plugin";

export default plugin(async (fastify, opts) => {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
