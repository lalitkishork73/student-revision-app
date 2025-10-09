"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ask_controller_1 = require("../controllers/ask.controller");
const router = (0, express_1.Router)();
router.post('/', ask_controller_1.handleAsk);
exports.default = router;
