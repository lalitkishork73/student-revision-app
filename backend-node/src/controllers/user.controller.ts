import { Request, Response } from "express";
import * as AuthService from "../services/userAuth.service";
import userModel from "../models/user.model";

export async function signupController(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const user = await AuthService.signup(email, password, name);
    res
      .status(201)
      .json({
        message: "User created successfully",
        userId: user._id,
        status: 201,
      });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: 400 });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    const userName = await userModel.findOne({ email });
    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: email,
        status: 200,
        name: userName?.name,
      });
  } catch (err: any) {
    res.status(401).json({ error: err.message, status: 401 });
  }
}
