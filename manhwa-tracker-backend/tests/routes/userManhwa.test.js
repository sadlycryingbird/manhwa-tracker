import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import UserManhwa from "../../src/models/UserManhwa.js";
import { loginTestUser } from "../helpers/auth.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import { MongoMemoryServer } from "mongodb-memory-server";
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("UserManhwa", () => {
  describe("POST /user-manhwa", () => {
    it("allows a user to add a manhwa to their list", async () => {
      const token = await loginTestUser();

      const payload = {
        manhwaId: "solo-leveling-123",
        status: "reading",
        currentChapter: 20,
      };

      const res = await request(app)
        .post("/user-manhwa")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        manhwaId: payload.manhwaId,
        status: payload.status,
        currentChapter: payload.currentChapter,
      });
      expect(res.body).toHaveProperty("userId");
    });
  });

  

});