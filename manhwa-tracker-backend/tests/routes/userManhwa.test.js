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
      const token = await loginTestUser("testfour");

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

  describe("GET /user-manhwa", () => {

    it("allows a user to display their personal full manhwa list", async () => {

        // Creating two users to check for user isolation, 
        // and that only one users manhwa list is displayed
        const token = await loginTestUser("testone");
        const tokenTwo = await loginTestUser("testtwo");

        await request(app)
            .post("/user-manhwa")
            .set("Authorization", `Bearer ${tokenTwo}`)
            .send({
                    manhwaId: "solo-leveling-123",
                    status: "reading",
                    currentChapter: 10
            });
        await request(app)
            .post("/user-manhwa")
            .set("Authorization", `Bearer ${token}`)
            .send({
                manhwaId: "tower-of-god-456",
                status: "reading",
                currentChapter: 5
            });

        const displayManhwaRes = await request(app)
            .get("/user-manhwa")
            .set("Authorization", `Bearer ${token}`);

        expect(displayManhwaRes.statusCode).toBe(200);
        expect(displayManhwaRes.headers["content-type"]).toMatch(/json/);
        expect(displayManhwaRes.body).toEqual(expect.any(Array));
        expect(displayManhwaRes.body[0]).toHaveProperty("manhwaId");
        expect(displayManhwaRes.body[0]).toHaveProperty("status");
        expect(displayManhwaRes.body[0]).toHaveProperty("currentChapter");
        expect(displayManhwaRes.body.length).toBe(1);

        expect(displayManhwaRes.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                manhwaId: "tower-of-god-456",
                status: "reading",
                currentChapter: 5
                })
            ])
        );

    });
  });

});