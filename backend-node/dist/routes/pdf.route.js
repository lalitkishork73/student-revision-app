"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdf_controller_1 = require("../controllers/pdf.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/list", auth_middleware_1.authMiddleware, pdf_controller_1.getPDFListController);
// router.get("/pdfs", getPdfService);
exports.default = router;
