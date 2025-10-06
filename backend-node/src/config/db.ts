import mongoose, { ClientSession } from "mongoose";
import logger from "../utils/logger";
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      autoIndex: true,
      dbName: process.env.DB_NAME, // optional, from .env
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    logger.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

// ---- Transaction Helpers (optional use) ---- //

export const startSession = async (): Promise<ClientSession> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
};

export const commitTransaction = async (session: ClientSession) => {
  try {
    await session.commitTransaction();
  } finally {
    session.endSession();
  }
};

export const abortTransaction = async (session: ClientSession) => {
  try {
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
};

export default connectDB;



/* 
import User from "../models/User";
import Order from "../models/Order";
import { startSession, commitTransaction, abortTransaction } from "../config/db";

export const createUserAndOrder = async (userData: any, orderData: any) => {
  const session = await startSession();
  try {
    const user = await User.create([userData], { session });
    const order = await Order.create([{ ...orderData, userId: user[0]._id }], { session });

    await commitTransaction(session);
    return { user: user[0], order: order[0] };
  } catch (error) {
    await abortTransaction(session);
    throw error;
  }
};

*/