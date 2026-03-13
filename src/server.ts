import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";


dotenv.config({path: path.join(process.cwd(), ".env")});
const app = express();
const port = 5000;
// parser
app.use(express.json());

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});


const initDB = async()=>{
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL CHECK (email = LOWER(email)),
    password TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'customer'))
    )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(10) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(10) CHECK (availability_status IN ('available', 'booked'))
      )`);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS booking(
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        vehicle_id INTEGER REFERENCES vehicles(id),
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned'))

        );
        
        `)
}
initDB();
 

app.get('/', (req : Request, res: Response) => {
  res.send('Hello Next Level Developers!')
});

app.post("/", (req:Request, res: Response)=>{
    console.log(req.body);

    res.status(201).json({
        success:true,
        message: "API is working Properly..."
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
