import express, { NextFunction, Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { vehiclesRoute } from "./modules/vehicle/vehicle.routes";

const app = express();
const port = config.port;
// parser
app.use(express.json());

// Initializing DB
initDB();

// logger middleware

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// ! Users CURD

app.use("/users", userRoutes);


// ! Vehicles CURD

app.use("/vehicles", vehiclesRoute);
 

// ! Booking CURD
app.post("/bookings", async (req: Request, res: Response) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
      ],
    );
    res.status(201).json({
      success: true,
      message: "Bookings created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/bookings", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM bookings`);

    res.status(200).json({
      success: true,
      message: "bookings retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/bookings/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Bookings not found!!!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Bookings fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.put("/bookings/:id", async (req: Request, res: Response) => {
  const { rent_start_date, rent_end_date, total_price, status, id} = req.body;

  try {
    const result = await pool.query(
      `UPDATE bookings SET rent_start_date=$1, rent_end_date=$2, total_price=$3, status=$4 WHERE id=$5 RETURNING *`,
      [
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        id
      ],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Bookings not found !!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Bookings are updated successfully !",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.delete("/bookings/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM bookings WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "booking not found!!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "booking deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
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
