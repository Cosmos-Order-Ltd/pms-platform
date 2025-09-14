"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication and admin role
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)(['SUPER_ADMIN', 'OWNER', 'MANAGER']));
router.get('/users', (req, res) => {
    res.json({ success: true, message: 'Admin users endpoint - to be implemented' });
});
router.get('/properties', (req, res) => {
    res.json({ success: true, message: 'Admin properties endpoint - to be implemented' });
});
router.get('/audit', (req, res) => {
    res.json({ success: true, message: 'Admin audit endpoint - to be implemented' });
});
exports.default = router;
//# sourceMappingURL=admin.js.map