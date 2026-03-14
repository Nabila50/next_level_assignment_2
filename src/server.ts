import express, { NextFunction, Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";



const app = express();
const port = config.port;
// parser
app.use(express.json());

// Initializing DB
initDB();

// logger middleware

const logger = (req: Request, res: Response, next: NextFunction) =>{
  next();

}



app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// ! Users CURD
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, password, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, password, phone, role],
    );
    res.status(201).json({
      success: false,
      message: "Data inserted Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully...",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(5000).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user fetched successfully",
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

app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name= $1, email=$2, password=$3, phone=$4 WHERE id=$5 RETURNING *`,
      [name, email, password, phone, req.params.id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user updated successfully",
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

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user deleted successfully",
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

// ! Vehicles CURD
app.post("/vehicles", async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ],
    );
    res.status(201).json({
      success: true,
      message: "Vehicles created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/vehicles", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles`);

    res.status(200).json({
      success: true,
      message: "vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/vehicles/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicles not found!!!!!",
      });
    }else {
      res.status(200).json({
        success: true,
        message: "Vehicles fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

app.put("/vehicles/:id", async(req: Request, res: Response)=>{
  const {vehicle_name, type, registration_number, daily_rent_price} = req.body;
  
  try{
    const result = await pool.query( `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4 WHERE id=$5 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, req.params.id]);

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "Vehicles not found !!!!"
      });
    } else {

      res.status(200).json({
        success: true,
        message: "Vehicles are updated successfully !",
        data: result.rows[0]
      })
    }

  } catch(err: any){
    res.status(500).json({
      success: false,
      message: err.message

    })
  }
});

app.delete("/vehicles/:id", async(req: Request, res: Response)=>{
   try {
    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found!!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

})
 

// Route not found...
 
app.use((req, res)=>{
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
