import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
) => {
  const existingUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING name, email, password, phone, role`,
    [name, email, password, phone, role]);

    console.log(result)
    const user = result.rows[0];

    return user;
};

const loginUser = async (email: string, password: string) => {
  console.log("email is: ", { email });

  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email
  ]);

  console.log("result is here", result);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    },
  );
  console.log({ token });

  return { token, user };
};

export const authServices = {
  registerUser,
  loginUser,
};
