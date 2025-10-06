import axios from "axios";
import { Router } from "express";
import {getPythonVersion } from "../controllers/LlmaIndexController";
const router = Router();

router.get("/ping", getPythonVersion);

export default router;
