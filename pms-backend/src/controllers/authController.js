"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.signup = exports.signin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorHandler_1 = require("../middleware/errorHandler");
const signin = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body;
        // Validate required fields
        if (!email || !password) {
            throw (0, errorHandler_1.createError)('Email and password are required', 400);
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw (0, errorHandler_1.createError)('Please enter a valid email address', 400);
        }
        // Password validation
        if (password.length < 6) {
            throw (0, errorHandler_1.createError)('Invalid credentials', 401);
        }
        // In a real application, query database for user
        // For demo purposes, simulate successful login
        const user = {
            id: Date.now().toString(),
            email,
            firstName: 'Demo',
            lastName: 'User',
            propertyName: 'Cyprus Hotel Demo',
            propertyType: 'hotel',
            role: 'MANAGER',
            lastLogin: new Date().toISOString()
        };
        // Create JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw (0, errorHandler_1.createError)('JWT secret not configured', 500);
        }
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        const tokenExpiry = rememberMe ? '30d' : '1d';
        const token = jsonwebtoken_1.default.sign(tokenPayload, jwtSecret, { expiresIn: tokenExpiry });
        res.json({
            success: true,
            message: 'Sign in successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                propertyName: user.propertyName,
                propertyType: user.propertyType,
                role: user.role
            },
            token,
            redirectTo: '/dashboard'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signin = signin;
const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, propertyName, propertyType } = req.body;
        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            throw (0, errorHandler_1.createError)('All fields are required', 400);
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw (0, errorHandler_1.createError)('Please enter a valid email address', 400);
        }
        // Password validation
        if (password.length < 8) {
            throw (0, errorHandler_1.createError)('Password must be at least 8 characters long', 400);
        }
        if (password !== confirmPassword) {
            throw (0, errorHandler_1.createError)('Passwords do not match', 400);
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        // For demo purposes, simulate user creation
        const user = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            propertyName: propertyName || 'My Property',
            propertyType: propertyType || 'hotel',
            role: 'OWNER',
            createdAt: new Date().toISOString()
        };
        // Create JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw (0, errorHandler_1.createError)('JWT secret not configured', 500);
        }
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, jwtSecret, { expiresIn: '1d' });
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                propertyName: user.propertyName,
                propertyType: user.propertyType,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw (0, errorHandler_1.createError)('Email is required', 400);
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw (0, errorHandler_1.createError)('Please enter a valid email address', 400);
        }
        // For demo purposes, simulate password reset email
        // In production, generate reset token and send email
        res.json({
            success: true,
            message: 'If an account with this email exists, you will receive a password reset link shortly.'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=authController.js.map