import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = express.Router();


router.post("/signup", authController.registerUser)
// http://localhost:5000/api/v1/auth/signin
router.post("/signin", authController.loginUser)

export const authRoutes = router;