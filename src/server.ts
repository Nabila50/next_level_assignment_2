import express, { NextFunction, Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { vehiclesRoute } from "./modules/vehicle/vehicle.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();
const port = config.port;
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initializing DB
initDB();

// logger middleware

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// ! Users CURD
app.use("/api/v1/users", userRoutes);

// ! Vehicles CURD
app.use("/api/v1/vehicles", vehiclesRoute);

 
// ! Booking CURD
app.use("/api/v1/bookings", bookingRoutes)

// ! Auth
app.use("/api/v1/auth", authRoutes);

// Route not found...

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
