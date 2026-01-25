  import jwt from "jsonwebtoken";
  import type { Request, Response, NextFunction } from "express";

  interface AuthPayload {
    userid: number;
  }

  export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
      const decoded = jwt.verify(token as string, secret);

      if (typeof decoded !== "object" || !("userid" in decoded)) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }

      (req as any).userId = (decoded as AuthPayload).userid;
      (req as any).role = (decoded as any).role;

      next();
    } catch (error) {
      console.log("JWT ERROR:", error);
      return res.status(401).json({
        success: false,
        message: "Token expired or invalid",
      });
    }
  };


  // middleware for the admins only 
  export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).role;

  if (role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admins only",
    });
  }

  next();
};