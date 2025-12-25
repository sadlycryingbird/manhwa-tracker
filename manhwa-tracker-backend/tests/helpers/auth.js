import request from "supertest";
import app from "../../src/app.js";

export async function loginTestUser() {
  const email = "test@test.com";
  const password = "password123";

  await request(app).post("/auth/register").send({ email, password });

  const res = await request(app).post("/auth/login").send({ email, password });

  console.log("Login token:", res.body.token); // <- check what you get
  return res.body.token;
}
