import supertest from "supertest";
import app from "./../src/app";
import prisma from "../src/database";

const api = supertest(app);

beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe("POST /users", () => {

  it("should create a user and return status 201", async () => {
    const { status } = await api.post('/users').send({ email: 'user1@gmail.com', password: '9w48h9woif93i4uhwe4' });
    expect(status).toBe(201);
  });

  it("when attempting to create a user with a registered e-mail should return status 409", async () => {
    await prisma.user.create({ data: { email: 'user1@gmail.com', password: '9w48h9woif93i4uhwe4' } });
    const { status } = await api.post('/users').send({ email: 'user1@gmail.com', password: '9w48h9woif93i4uhwe4' });
    expect(status).toBe(409);
  });

});

describe("GET /users", () => {

  it("should return status 200 alonside a single user", async () => {
    const { id, email, password } = await prisma.user.create({ data: { email: 'user1@gmail.com', password: '9w48h9woif93i4uhwe4' } });
    const { status, body } = await api.get(`/users/${id}`);
    expect(status).toBe(200);
    expect(body).toEqual({ id, email, password });
  });

  it("should return status 404 when non-existent user id is requested", async () => {
    const { id } = await prisma.user.create({ data: { email: 'user1@gmail.com', password: '9w48h9woif93i4uhwe4' } });
    await prisma.user.delete({ where: { id } });
    const { status } = await api.get(`/users/${id}`);
    expect(status).toBe(404);
  });

  it("should return status 200 alongside all users", async () => {
    await prisma.user.create({ data: { email: 'user1@gmail.com', password: '9w48h9woif93i4uhwe4' } });
    await prisma.user.create({ data: { email: 'user2@gmail.com', password: 'jfwiu34h9w4fgb38795' } });
    const { body } = await api.get('/users');
    expect(body).toHaveLength(2);
    expect(body).toEqual(expect.arrayContaining([expect.objectContaining({ email: expect.any(String) })]));
  });

})