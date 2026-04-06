import { Result } from "pg";
import { pool } from "../../config/db";

const createBookings = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: number,
  rent_end_date: number,
  total_price: string,
  status: string,
) => {
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

  return result;
};

const getBookings = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);

  return result;
};

const getSingleBooking = async (id: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);

  return result;
};

const updateBooking = async (
  rent_start_date: string,
  rent_end_date: string,
  total_price: string,
  status: string,
  id: string,
) => {
 const result= await pool.query(
    `UPDATE bookings SET rent_start_date=$1, rent_end_date=$2, total_price=$3, status=$4 WHERE id=$5 RETURNING *`,
    [rent_start_date, rent_end_date, total_price, status, id],
  );

  return result
};

const deleteBooking = async(id: string)=>{
    const result =  await pool.query(`DELETE FROM bookings WHERE id = $1`, [id]);

    return result;
}

export const bookingServices = {
  createBookings,
  getBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking
};
