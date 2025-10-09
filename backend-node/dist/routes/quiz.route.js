"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_1 = require("../controllers/quiz.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/generate', quiz_controller_1.generateQuiz);
router.post('/submit', auth_middleware_1.authMiddleware, quiz_controller_1.submitTestController);
exports.default = router;
