import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }
        const bearer = parts[0];
        const token = parts[1];
        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET not defined");
        }
        console.log("AUTH HEADER:", authHeader);
        console.log("TOKEN:", token);
        // 🔥 THIS IS THE IMPORTANT FIX
        const decoded = jwt.verify(token, secret);
        if (typeof decoded !== "object" || !("userid" in decoded)) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }
        req.userId = decoded.userid;
        req.role = decoded.role;
        next();
    }
    catch (error) {
        console.log("JWT ERROR:", error);
        return res.status(401).json({
            success: false,
            message: "Token expired or invalid",
        });
    }
};
// middleware for the admins only 
export const adminMiddleware = (req, res, next) => {
    const role = req.role;
    if (role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Admins only",
        });
    }
    next();
};
//# sourceMappingURL=authMiddleware.js.map