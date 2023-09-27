import supertest from "supertest";
import app, { fibonacciSequence } from "./../src/app";

const api = supertest(app);

describe("API testing", () => {
  it("/health should return status 200", async () => {
    const { status, text } = await api.get("/health");
    expect(status).toBe(200);
    expect(text).toBe("OK!");
  });
  it("/fibonacci should return status 400 when NaN", async () => {
    const { status } = await api.get('/fibonacci').query({ elements: NaN });
    expect(status).toBe(400);
  });
  it("/fibonacci should return status 400 when value < 1", async () => {
    const { status } = await api.get('/fibonacci').query({ elements: '0' });
    expect(status).toBe(400);
  });
  it("/fibonacci should return status 200 for valid body", async () => {
    const elements = 5;
    const { body, status } = await api.get('/fibonacci').query({ elements });
    expect(status).toBe(200);
    expect(body).toEqual(fibonacciSequence(elements));
  });
})