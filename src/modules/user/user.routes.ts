import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";
 


const router = express.Router();

router.post("/", userController.createUser);

router.get("/", logger, auth("admin"), userController.getUser);

router.get("/:id", userController.getSingleUser);

router.put("/:id", auth("admin", "customer"), userController.updateUser);

router.delete("/:id", auth("admin"), userController.deleteUser)

// router.get("/:id")

export const userRoutes = router;