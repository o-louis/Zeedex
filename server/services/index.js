export default async (app) => {
  app.get("/", async (request, reply) => {
    return {
      app: "Zeedex",
      version: "1.0.0",
      description: "Project in progress...",
    };
  });
};
