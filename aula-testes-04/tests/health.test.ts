import app from "../src/index";
import supertest from "supertest";

const server = supertest(app);

describe("API /health route testing", () => {
  it("GET /health", async () => {
    const { status } = await server.get('/health');
    expect(status).toBe(200);
  });
});