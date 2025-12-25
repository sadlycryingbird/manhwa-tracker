import request from "supertest";
import app from "../../src/app.js";
import mongoose from "mongoose";
import Manhwa from "../../src/models/Manhwa.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

beforeEach(async () => {
  await Manhwa.deleteMany({});
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("GET /manhwas endpoint unit tests", () => {

    it("should return all manhwas from the database", async () => {
        const testData = [
      { title: "Test Solo Leveling", status: "reading", rating: "9.5" },
      { title: "Test The Heavenly Demon Wants to Live a Normal Life", status: "completed", rating: "9.0" }
        ];

        await Manhwa.insertMany(testData);

        const res = await request(app).get("/manhwas");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(testData.length);
        expect(res.body.data[0].title).toBe("Test Solo Leveling");
        expect(res.body.data[1].status).toBe("completed");

    });

    it("should return an empty array when no manhwas exist", async () => {

        const res = await request(app).get("/manhwas");

        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(0);
        expect(res.body.data).toEqual([]);

    });

});

describe("POST /manhwas", () => {

    it("should add a manhwa to the database when all required fields are in payload", async () => {
        
        const testData = {title: "Test Solo Leveling", status: "reading", rating: "9.5"};

        const res = await request(app)
            .post("/manhwas")
            .send(testData);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.manhwa.title).toBe("Test Solo Leveling");
        expect(res.body.manhwa.status).toBe("reading");
        expect(res.body.message).toBe("Manhwa added");

        // Query the DB directly to verify it was saved
        const savedManhwa = await Manhwa.findOne({title: testData.title});
        expect(savedManhwa).not.toBeNull();
        expect(savedManhwa.status).toBe(testData.status);

    });

    it("should return an error when not all required fields are in the payload", async () => {

        const failTestData = {title: "No Status Title", rating: "9.5"};

        const res = await request(app)
            .post("/manhwas")
            .send(failTestData)
        
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Title and status are required");

    });

});

describe("PATCH manhwas/:id endpoint", () => {
    
    it("should edit status accordingly when valid input is given", async () => {

        const testUpdate = {status: "Completed"};
        const existingManhwa = await Manhwa.create({ title: "Test Solo Leveling", status: "reading", rating: "9.5" });

        const res = await request(app)
            .patch(`/manhwas/${existingManhwa._id}`)
            .send(testUpdate);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.manhwa.status).toBe("Completed");
        expect(res.body.message).toBe("Manhwa updated");

        // Query the DB directly to verify it was saved
        const updatedManhwa = await Manhwa.findOne({title: existingManhwa.title});
        expect(updatedManhwa).not.toBeNull();
        expect(updatedManhwa.status).toBe(testUpdate.status);

    });

    it("should return 400 error when status missing in PATCH request", async () => {

        const existingManhwa = await Manhwa.create({
            title: "Test Solo Leveling",
            status: "reading",
            rating: "9.5"
        });
        
          const res = await request(app)
            .patch(`/manhwas/${existingManhwa._id}`)
            .send({}); 

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("status is required as input");
    });

});

describe("DELETE /manhwas/:id endpoint unit tests", () => {
    it("should delete manhwa from database with valid ID", async () => {
        const existingManhwa = await Manhwa.create({
            title: "Test Solo Leveling",
            status: "reading",
            rating: "9.5"
        });

        const res = await request(app)
            .delete(`/manhwas/${existingManhwa._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const nullManhwa = await Manhwa.findOne({title: existingManhwa.title});
        expect(nullManhwa).toBeNull();
    });

    it("should return 404 error with an error message when nonexistent id is passed in request", async () => {

        const fakeId = "64b7f9d3f1e7c8a1b2c3d4e5"; 

        const res = await request(app)
            .delete(`/manhwas/${fakeId}`);
        
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Manhwa not found");

    });

});
