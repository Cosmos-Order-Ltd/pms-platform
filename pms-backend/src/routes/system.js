"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'System health check',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Protected system routes
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)(['SUPER_ADMIN', 'MANAGER']));
router.get('/logs', (req, res) => {
    res.json({ success: true, message: 'System logs endpoint - to be implemented' });
});
exports.default = router;
//# sourceMappingURL=system.js.map