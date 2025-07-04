import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userSigninSchema, userSignupSchema } from "../zodSchemas";
import { prisma } from "../db";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const parsedBody = userSignupSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      error: "Invalid input",
      issues: parsedBody.error.errors,
    });
    return;
  }
  const { name, email, password } = parsedBody.data;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(400).json({
        error: "User already exists",
      });
      return;
    }
    const hanshedPassword = await bcrypt.hash(password, 5);
    const user = await prisma.user.create({
      data: {
        email,
        password: hanshedPassword,
        name,
      },
      select: {
        id: true,
      },
    });
    res
      .status(201)
      .json({ message: "User created", data: { userId: user.id } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  const parsedBody = userSigninSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  try {
    const { email, password } = parsedBody.data;
    const userFound = await prisma.user.findUnique({
      where: { email },
    });
    if (!userFound) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, userFound.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const payload = {
      userId: userFound.id,
      email: userFound.email,
      name: userFound.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "SUPER_SECRET");
    res.json({ token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

export { router as authRouter };
