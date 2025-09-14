"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// POST /api/v1/auth/signin
router.post('/signin', authController_1.signin);
// POST /api/v1/auth/signup
router.post('/signup', authController_1.signup);
// POST /api/v1/auth/forgot-password
router.post('/forgot-password', authController_1.forgotPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map