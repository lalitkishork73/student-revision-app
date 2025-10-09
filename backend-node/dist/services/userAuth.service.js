"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = "1d"; // 1 day
async function signup(email, password, name) {
    const existing = await user_model_1.default.findOne({ email });
    if (existing)
        throw new Error("Email already exists");
    const user = new user_model_1.default({ email, password, name });
    await user.save();
    return user;
}
async function login(email, password) {
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new Error("Invalid email or password");
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
        throw new Error("Invalid email or password");
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    return token;
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        throw new Error("Invalid or expired token");
    }
}
