import express from "express";
import "dotenv/config";
import { prisma } from "../db/prisma.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
// HOME
router.get("/", (req, res) => {
    res.send("Users home page");
});
// SIGNUP
router.post("/signup", async (req, res) => {
    const { email, name, password } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return res.json({
            success: false,
            message: "Email already exists, please login",
        });
    }
    const userHash = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: userHash,
        },
    });
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ userid: user.id, role: user.role }, //Adding roles
    secret, {
        expiresIn: "1h",
    });
    res.json({
        success: true,
        token,
    });
});
// LOGIN
router.post("/login", async (req, res) => {
    const { email, name, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.json({
            success: false,
            message: "Email is incorrect",
        });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.json({
            success: false,
            message: "Password is incorrect",
        });
    }
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ userid: user.id, role: user.role, }, secret, {
        expiresIn: "1h",
    });
    res.json({
        success: true,
        token,
        name
    });
});
// addin a small feature of accessing the users detauils 
router.get("/me", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    res.json({
        success: true,
        user,
    });
});
// simple admin routes to checks 
router.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });
    res.json({
        success: true,
        users,
    });
});
export default router;
//# sourceMappingURL=getuser.js.map