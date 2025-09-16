import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'pms-core',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;