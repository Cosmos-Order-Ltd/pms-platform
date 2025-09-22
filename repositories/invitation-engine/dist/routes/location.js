"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.use(rateLimiter_1.locationVerificationRateLimit);
router.post('/validate', async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Location validation endpoint ready',
            note: 'Geofencing implementation pending'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=location.js.map