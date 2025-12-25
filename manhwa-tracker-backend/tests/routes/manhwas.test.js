import request from "supertest";
import app from "../../src/server.js";
import mongoose from "mongoose";
import Manhwa from "../../src/models/Manhwa.js";

beforeAll(async () => {
    //Connect to a test DB
    await mongoose.connect(process.env.MONGO_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
  await Manhwa.deleteMany({});
});

afterAll(async () => {
  // Clean up test DB & disconnect
  await mongoose.connection.db.dropDatabase();
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

})