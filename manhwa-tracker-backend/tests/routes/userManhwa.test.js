import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import UserManhwa from "../../src/models/UserManhwa.js";
import { loginTestUser } from "../helpers/auth.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export async function createManhwa(token, manhwaData = {}) {
  const defaultData = {
    manhwaId: `test-manhwa-${Date.now()}`,
    status: "reading",
    currentChapter: 1,
  };

  const payload = { ...defaultData, ...manhwaData };

  const res = await request(app)
    .post("/user-manhwa")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  if (res.statusCode !== 201) {
    throw new Error(`Failed to create test manhwa: ${res.statusCode}`);
  }

  return res.body.data._id; // Return the created manhwa ID
}

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
      expect(res.body.data).toMatchObject({
        manhwaId: payload.manhwaId,
        status: payload.status,
        currentChapter: payload.currentChapter,
    });
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Manhwa added to your list");
      expect(res.body).toHaveProperty("data");
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

        // Check response structure
        expect(displayManhwaRes.body).toHaveProperty("success", true);
        expect(displayManhwaRes.body).toHaveProperty("data");
        expect(displayManhwaRes.body).toHaveProperty("total");
        expect(displayManhwaRes.body).toHaveProperty("page");
        expect(displayManhwaRes.body).toHaveProperty("limit");
        expect(displayManhwaRes.body.page).toBe(1);
        expect(displayManhwaRes.body.limit).toBe(10);
        expect(displayManhwaRes.body.total).toBe(1); // total manhwas for the user

        const manhwas = displayManhwaRes.body.data;

        // Check that data array has the expected manhwa
        expect(manhwas.length).toBe(1);
        expect(manhwas[0]).toHaveProperty("manhwaId", "tower-of-god-456");
        expect(manhwas[0]).toHaveProperty("status", "reading");
        expect(manhwas[0]).toHaveProperty("currentChapter", 5);

    });
  });
  
  describe("PATCH /user-manhwa/:id", () => {

    let happyToken, errorToken, manhwaId;

    beforeAll(async () => {
        happyToken = await loginTestUser("happypathtest");
        errorToken = await loginTestUser("errorpathtest");
        manhwaId = await createManhwa(happyToken);
        
    });
    it("updates successfully when user has that manhwa in their list", async () => {
        
        const statusUpdateTest = await request(app)
            .patch(`/user-manhwa/${manhwaId}`)
            .set("Authorization", `Bearer ${happyToken}`)
            .send({status: "completed"});

        expect(statusUpdateTest.statusCode).toBe(200);    
        expect(statusUpdateTest.body.data).toHaveProperty("status", "completed");
        expect(statusUpdateTest.body).toHaveProperty("success", true);
        expect(statusUpdateTest.body).toHaveProperty("data");
        
    });
    
    it("returns 401 if no token is provided", async () => {

        const noUserResponse = await request(app)
            .patch(`/user-manhwa/${manhwaId}`)
            .send({ status: "completed" });

        expect(noUserResponse.statusCode).toBe(401);
    });

    it("returns 403 if user does not own the manhwa", async () => {

        const wrongUserResponse = await request(app)
            .patch(`/user-manhwa/${manhwaId}`)
            .set("Authorization", `Bearer ${errorToken}`)
            .send({ status: "completed" });
        
        expect(wrongUserResponse.statusCode).toBe(403);
        expect(wrongUserResponse.body.message).toBe("Forbidden");
    });
    
    it("returns 404 for non-existent manhwa", async () => {
        const fakeId = "64f6a1b0f0d3c123456789ab";
    
        const nonExistentManhwaRes = await request(app)
            .patch(`/user-manhwa/${fakeId}`)
            .set("Authorization", `Bearer ${happyToken}`)
            .send({ status: "completed" });

        expect(nonExistentManhwaRes.statusCode).toBe(404);
        expect(nonExistentManhwaRes.body.message).toBe("Manhwa not found");
    });

  });

  describe("DELETE /user-manhwa/:id", () => {

    let happyToken, errorToken, manhwaId;

    beforeEach(async () => {
        happyToken = await loginTestUser("happypathtest");
        errorToken = await loginTestUser("errorpathtest");
        manhwaId = await createManhwa(happyToken);        
    });

  it("deletes successfully when user has that manhwa in their list", async () => {

        const deleteTest = await request(app)
            .delete(`/user-manhwa/${manhwaId}`)
            .set("Authorization", `Bearer ${happyToken}`);

        expect(deleteTest.statusCode).toBe(200);    
        expect(deleteTest.body).toHaveProperty("message", "Manhwa deleted");
        expect(deleteTest.body).toHaveProperty("success", true);
    });

    it("returns 401 if no token is provided", async () => {
        const noUserResponse = await request(app)
            .delete(`/user-manhwa/${manhwaId}`);

        expect(noUserResponse.statusCode).toBe(401);
    });

    it("returns 403 if user does not own the manhwa", async () => {
        const wrongUserResponse = await request(app)
            .delete(`/user-manhwa/${manhwaId}`)
            .set("Authorization", `Bearer ${errorToken}`);
        
        expect(wrongUserResponse.statusCode).toBe(403);
        expect(wrongUserResponse.body.message).toBe("Forbidden");
    });
    
    it("returns 404 for non-existent manhwa", async () => {
        const fakeId = "64f6a1b0f0d3c123456789ab";
    
        const nonExistentManhwaRes = await request(app)
            .delete(`/user-manhwa/${fakeId}`)
            .set("Authorization", `Bearer ${happyToken}`);

        expect(nonExistentManhwaRes.statusCode).toBe(404);
        expect(nonExistentManhwaRes.body.message).toBe("Manhwa not found");
    });
  });

});