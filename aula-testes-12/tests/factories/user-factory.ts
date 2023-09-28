import prisma from "../../src/database";
import { UserInput } from "../../src/repository";
import { faker } from "@faker-js/faker";

export async function createUser(email: string, password?: string) {
  const userData: UserInput = { email, password: password || new Date().getTime().toString() };
  const user = await prisma.user.create({ data: userData });
  return user;
};

export function createRandomUser() {
  return createUser(faker.internet.email(), faker.internet.password());
};