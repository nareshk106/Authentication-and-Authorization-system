import express from 'express';
import { prisma } from "../db/prisma.js";
import { authMiddleware } from '../middleware/authMiddleware.js';
const routerss = express.Router();
routerss.get("/cats", async (req, res) => {
    // 👇 THIS IS THE IMPORTANT LINE
    const userId = req.userId;
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    // Check for a successful response status (fetch only rejects on network errors, not HTTP errors like 404)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parse the response body as JSON
    const data = await response.json();
    console.log(data);
    res.status(200).json({
        sucess: true,
        requestedByUserId: userId, // 👈 PROOF OF IDENTITY
        datas: data
    });
});
//Get new router to access only the specific users post 
routerss.get('/catss', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const cats = await prisma.cat.findMany({
        where: { userId },
    });
    res.json({
        success: true,
        cats,
    });
});
// POST crweating the post specific to the user like which user creates what posts
routerss.post("/catpost", async (req, res) => {
    const userId = req.userId;
    const { name } = req.body;
    //below the is the satement that will create the posts
    const cat = await prisma.cat.create({
        data: {
            name,
            userId, // 👈 OWNER IS CURRENT USER
        },
    });
    res.json({
        success: true,
        cat,
    });
});
// DELETE route for the users to delete their posts 
routerss.delete("/cats/:id", async (req, res) => {
    const catId = Number(req.params.id);
    const userId = req.userId;
    // 1. Find the cat
    const cat = await prisma.cat.findUnique({
        where: { id: catId },
    });
    if (!cat) {
        return res.status(404).json({
            success: false,
            message: "Cat not found",
        });
    }
    // 2. Ownership check
    if (cat.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: "You are not allowed to delete this cat",
        });
    }
    // 3. Delete
    await prisma.cat.delete({
        where: { id: catId },
    });
    res.json({
        success: true,
        message: "Cat deleted successfully",
    });
});
// UPDATE route for the users to delete their posts 
routerss.put("/cats/:id", async (req, res) => {
    const catId = Number(req.params.id);
    const userId = req.userId;
    const { name } = req.body; // what you want to update
    // 1. Find the cat
    const cat = await prisma.cat.findUnique({
        where: { id: catId },
    });
    if (!cat) {
        return res.status(404).json({
            success: false,
            message: "Cat not found",
        });
    }
    // 2. Ownership check
    if (cat.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: "You are not allowed to update this cat",
        });
    }
    // 3. Update
    const updatedCat = await prisma.cat.update({
        where: { id: catId },
        data: { name },
    });
    res.json({
        success: true,
        cat: updatedCat,
    });
});
export default routerss;
//# sourceMappingURL=catroutes.js.map