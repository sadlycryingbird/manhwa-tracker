import request from "supertest";
import app from "../../src/app.ts";

export async function loginTestUser(uniqueId = "") {
  const email = `test${uniqueId}@test.com`;
  const password = "password123";

  try {
    await request(app).post("/auth/register").send({ email, password });
  } catch (err) {

  }

  const res = await request(app).post("/auth/login").send({ email, password });

  if (!res.body.token) {
    throw new Error("Failed to login test user and retrieve token");
  }

  return res.body.token;
}