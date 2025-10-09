"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = signupController;
exports.loginController = loginController;
const AuthService = __importStar(require("../services/userAuth.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
async function signupController(req, res) {
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
    }
    catch (err) {
        res.status(400).json({ error: err.message, status: 400 });
    }
}
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const token = await AuthService.login(email, password);
        const userName = await user_model_1.default.findOne({ email });
        res
            .status(200)
            .json({
            message: "Login successful",
            token,
            user: email,
            status: 200,
            name: userName?.name,
        });
    }
    catch (err) {
        res.status(401).json({ error: err.message, status: 401 });
    }
}
