import supertest from "supertest";

import app from "../src/app";
import prisma from "../src/database";
import { UserInput } from "../src/repository";
import { createRandomUser, createUser } from "./factories/user-factory";

const api = supertest(app);

beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe("POST /users", () => {
  it("should return status 201 and create a user", async () => {
    const user: UserInput = { email: "test@gmail.com", password: "nfsiu40238g28bh" };
    const { status } = await api.post("/users").send(user);
    expect(status).toBe(201);
  });

  it("should return status 409 when attempting to create user with an already used e-mail", async () => {
    const user = await createUser("test@gmail.com");
    const { status } = await api.post("/users").send({ email: user.email, password: "nfsiu40238g28bh" });
    expect(status).toBe(409);
  });

});

describe("GET /users tests", () => {
  it("should return status 200 alongside the requested user", async () => {
    const user = await createRandomUser();
    const { status, body } = await api.get(`/users/${user.id}`);
    expect(status).toBe(200);
    expect(body).toEqual({ ...user, id: user.id });
  });

  it("should return status 404 when non-existent id is requested", async () => {
    const { status } = await api.get("/users/999999");
    expect(status).toBe(404);
  });

  it("should return status 200 alonside a list of all users", async () => {
    await createRandomUser();
    await createRandomUser();
    await createRandomUser();
    const { status, body } = await api.get("/users");
    expect(status).toBe(200);
    expect(body).toHaveLength(3);
    expect(body).toEqual(expect.arrayContaining([expect.objectContaining({ email: expect.any(String) })]));
  });

});