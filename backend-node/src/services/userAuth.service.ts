import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = "1d"; // 1 day

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<IUser> {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const user = new User({ email, password, name });
  await user.save();
  return user;
}

export async function login(email: string, password: string): Promise<string> {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return token;
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err: any) {
    throw new Error("Invalid or expired token");
  }
}
