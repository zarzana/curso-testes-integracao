import prisma from "database";
import { UserInput } from "repository";

export async function createUser(userData: UserInput) {
  return await prisma.user.create({ data: { ...userData } });
};

export async function createManyUsers(userData: UserInput, userEmail: string) {
  return await prisma.user.createMany({ data: [{ ...userData }, { ...userData, email: userEmail }] });
};