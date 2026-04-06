import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBookings)

router.get("/",auth("admin", "customer"), bookingControllers.getBookings)

router.get("/:id", bookingControllers.getSingleBooking)

router.put("/:id", auth("admin", "customer"), bookingControllers.updateBooking)

router.delete("/:id", bookingControllers.deleteBooking)

export const bookingRoutes = router;