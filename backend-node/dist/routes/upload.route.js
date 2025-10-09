"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authMiddleware, upload_controller_1.handleUpload);
// router.get("/pdfs", getPdfService);
exports.default = router;
