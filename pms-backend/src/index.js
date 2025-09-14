"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const reservations_1 = __importDefault(require("./routes/reservations"));
const guests_1 = __importDefault(require("./routes/guests"));
const properties_1 = __importDefault(require("./routes/properties"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const staff_1 = __importDefault(require("./routes/staff"));
const system_1 = __importDefault(require("./routes/system"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://admin.pms.com', 'https://guest.pms.com', 'https://staff.pms.com']
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.requestLogger);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API Routes
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/admin', admin_1.default);
app.use('/api/v1/reservations', reservations_1.default);
app.use('/api/v1/guests', guests_1.default);
app.use('/api/v1/properties', properties_1.default);
app.use('/api/v1/rooms', rooms_1.default);
app.use('/api/v1/staff', staff_1.default);
app.use('/api/v1/system', system_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 PMS Backend API running on port ${PORT}`);
    console.log(`📋 Health check available at: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=index.js.map