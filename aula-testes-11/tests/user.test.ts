import supertest from "supertest";

import app from "../src/app";
import prisma from "../src/database";
import { UserInput } from "../src/repository";
import { createManyUsers, createUser } from "./factories/user-factory";

const api = supertest(app);

beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe("POST /users", () => {
  it("should return status 201 and create a user", async () => {
    const user: UserInput = { email: "test@gmail.com", password: "9qw37gfbq9wun9fw" };
    const { status } = await api.post("/users").send(user);
    expect(status).toBe(201);
  });

  it("should return status 409 when attempting to create user with already used e-mail", async () => {
    const userData: UserInput = { email: "test@gmail.com", password: "9qw37gfbq9wun9fw" };
    await createUser(userData);
    const { status } = await api.post("/users").send(userData);
    expect(status).toBe(409);
  });

});

describe("GET /users", () => {
  it("should return status 200 alongside the requested user", async () => {
    const userData: UserInput = { email: "test@gmail.com", password: "9qw37gfbq9wun9fw" };
    const createdUser = await createUser(userData);
    const { status, body } = await api.get(`/users/${createdUser.id}`);
    expect(status).toBe(200);
    expect(body).toEqual({ ...userData, id: createdUser.id });
  });

  it("should return status 404 when non-existent id is requested", async () => {
    const { status } = await api.get("/users/999999");
    expect(status).toBe(404);
  });

  it("should return status 200 alonside a list of all users", async () => {
    const userData1: UserInput = { email: "test@gmail.com", password: "9qw37gfbq9wun9fw" };
    const userData2: UserInput = { email: "test2@gmail.com", password: "984hg98wh49h9w4b" };
    await createUser(userData1);
    await createUser(userData2);
    const { status, body } = await api.get("/users");
    expect(status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body).toEqual(expect.arrayContaining([expect.objectContaining({ email: expect.any(String) })]));
  });

})