"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminToken = exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-for-invitation-system';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-admin-dashboard-password';
const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const adminPassword = req.headers['x-admin-password'];
        if (adminPassword === ADMIN_PASSWORD) {
            req.user = {
                id: 'admin',
                role: 'admin',
                permissions: ['*']
            };
            next();
            return;
        }
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errorHandler_1.UnauthorizedError('Authentication token required');
        }
        const token = authHeader.substring(7);
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (payload.role !== 'admin') {
            throw new errorHandler_1.ForbiddenError('Admin access required');
        }
        req.user = {
            id: payload.id,
            role: payload.role,
            permissions: payload.permissions
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errorHandler_1.UnauthorizedError('Invalid authentication token'));
        }
        else {
            next(error);
        }
    }
};
exports.adminAuth = adminAuth;
const generateAdminToken = (adminId = 'admin') => {
    return jsonwebtoken_1.default.sign({
        id: adminId,
        role: 'admin',
        permissions: ['*']
    }, JWT_SECRET, { expiresIn: '24h' });
};
exports.generateAdminToken = generateAdminToken;
exports.default = { adminAuth: exports.adminAuth, generateAdminToken: exports.generateAdminToken };
//# sourceMappingURL=auth.js.map