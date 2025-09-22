"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/conversions', async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Analytics conversion endpoint ready'
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/dashboard', async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Analytics dashboard ready'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map