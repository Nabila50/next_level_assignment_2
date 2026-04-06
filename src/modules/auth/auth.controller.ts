import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { pool } from "../../config/db";


const registerUser = async(req: Request, res: Response)=>{
    const {name, email, password, phone, role} = req.body;

    try{
        const result = await authServices.registerUser(
            name, email, password, phone, role
        );

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: result
        })

    } catch(err:any){

        res.status(500).json({

            success:false,
            message: err.message
        })

    }
}

const loginUser = async (req: Request, res: Response) => {
  console.log("Request body:", req.body);
  const { email, password } = req.body || {};

  try {
    const result = await authServices.loginUser(email, password);

     if (result === null) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    if (result === false) {
        return res.status(401).json({
            success: false,
            message: "Invalid password"
        });
    }
    res.status(200).json({
      success: true,
      message: "login successfully",
      data: result,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
    registerUser,
    loginUser,
};
