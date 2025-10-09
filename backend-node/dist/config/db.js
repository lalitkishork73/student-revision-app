"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortTransaction = exports.commitTransaction = exports.startSession = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI, {
            autoIndex: true,
            dbName: process.env.DB_NAME, // optional, from .env
        });
        logger_1.default.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    catch (error) {
        logger_1.default.error(`DB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};
// ---- Transaction Helpers (optional use) ---- //
const startSession = async () => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    return session;
};
exports.startSession = startSession;
const commitTransaction = async (session) => {
    try {
        await session.commitTransaction();
    }
    finally {
        session.endSession();
    }
};
exports.commitTransaction = commitTransaction;
const abortTransaction = async (session) => {
    try {
        await session.abortTransaction();
    }
    finally {
        session.endSession();
    }
};
exports.abortTransaction = abortTransaction;
exports.default = connectDB;
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
