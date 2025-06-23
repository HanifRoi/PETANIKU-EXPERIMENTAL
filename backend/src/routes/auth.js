import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
const router = express.Router();
// Register
router.post("/register", async (req, res) => {
  const { fullName, origin, latitude, longitude, email, password, role } =
    req.body;
  if (!fullName || !email || !password || !role)
    return res.status(400).json({ message: "Missing fields" });
  // validasi role hanya BUYER atau FARMER (ADMIN dibuat manual)
  if (!["BUYER", "FARMER"].includes(role))
    return res.status(400).json({ message: "Invalid role" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return res.status(400).json({ message: "Email already registered" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      origin,
      latitude: latitude || null,
      longitude: longitude || null,
      email,
      password: hash,
      role,
    },
  });
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.json({
    token,
    user: { id: user.id, fullName: user.fullName, role: user.role },
  });
});
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.json({
    token,
    user: { id: user.id, fullName: user.fullName, role: user.role },
  });
});
export default router;
