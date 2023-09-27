import supertest from "supertest";
import app from "./../src/app";
import { ReservationInput } from "../src/repository";
import prisma from "database";

const api = supertest(app);

beforeAll(async () => {
  await prisma.reservation.deleteMany();
})

describe("API testing", () => {
  it("POST /reservations should created a new reservation and return status 201", async () => {
    const reservation: ReservationInput = { startDate: new Date(), endDate: new Date() };
    const { status } = await api.post("/reservations").send(reservation);
    expect(status).toBe(201);
  });

  it("GET /reservations should return status 200 and a list of all reservations", async () => {
    const { status, body } = await api.get("/reservations");
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });
});