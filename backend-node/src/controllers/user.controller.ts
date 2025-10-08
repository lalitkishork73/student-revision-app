import { Request, Response } from "express";
import * as AuthService from "../services/userAuth.service";

export async function signupController(req: Request, res: Response) {
  try {
    const { email, password,name } = req.body;
    const user = await AuthService.signup(email, password,name);
    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}
