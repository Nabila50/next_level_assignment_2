import { Request, Response } from "express";
import { pool } from "../../config/db";
import { bookingServices } from "./booking.service";


const createBookings = async (req: Request, res: Response) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;

  try {
    const result = await bookingServices.createBookings(customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            status);
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
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getBookings();

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
} 

const getSingleBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getSingleBooking(req.params.id as string);

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
}

const updateBooking = async (req: Request, res: Response) => {
  const { rent_start_date, rent_end_date, total_price, status, id} = req.body;

  try {
    const result = await bookingServices.updateBooking(rent_start_date, rent_end_date,total_price,status,req.params.id as string);

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
}

const deleteBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.deleteBooking(req.params.id as string)

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
}

export const bookingControllers = {
    createBookings,
    getBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking
}