"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LlmaIndexController_1 = require("../controllers/LlmaIndexController");
const router = (0, express_1.Router)();
router.get("/ping", LlmaIndexController_1.getPythonVersionPing);
exports.default = router;
