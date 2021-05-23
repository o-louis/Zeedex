import bcrypt from "bcrypt";
import { AUTH } from "../routes.js";

export default async (app) => {
  // REGISTER
  app.post(AUTH.REGISTER, async (request, reply) => {
    const { email, username, password } = request.body;
    if (!email || !username || !password) {
      reply
        .status(400)
        .send({ error: true, msg: "Mandatory fields are missing" });
    }

    try {
      // Check email already exists in the database
      const user = await app.pg.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length > 0) {
        reply.status(401).send({ error: true, msg: "User already exist" });
      }

      // Insert credential into the database
      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = await app.pg.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );

      // Get a token session
      const token = app.jwt.sign(
        { id: newUser.rows[0].id },
        { expiresIn: 86400 }
      );

      reply.send({ token });
    } catch (err) {
      reply.send(err);
    }
  });

  // LOGIN
  app.post(AUTH.LOGIN, async (request, reply) => {
    const { email, password } = request.body;
    if (!email || !password) {
      reply
        .status(400)
        .send({ error: true, msg: "Mandatory fields are missing" });
    }

    try {
      // Check email already exists in the database
      const user = await app.pg.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length === 0) {
        reply.status(401).send({ error: true, msg: "Invalid credential" });
      }

      // Check password matches the one saved in the database
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if (!validPassword) {
        reply.status(401).send({ error: true, msg: "Invalid credential" });
      }

      // Get a token session
      const token = app.jwt.sign({ id: user.rows[0].id }, { expiresIn: 86400 });

      reply.send({ token });
    } catch (err) {
      reply.send(err);
    }
  });
};
