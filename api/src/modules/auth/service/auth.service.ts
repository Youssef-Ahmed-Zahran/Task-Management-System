import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma.js";
import { ApiError } from "../../../utils/ApiError.js";
import { env } from "../../../config/env.js";
import type { RegisterInput, LoginInput } from "../schema/auth.schema.js";

const SALT_ROUNDS = 12;

export const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};
