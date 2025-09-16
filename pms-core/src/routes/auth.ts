import { Router } from 'express';
import { AuthService } from '../services/auth';
import { authenticateService } from '../middleware/serviceAuth';

const router = Router();

// Service registration endpoint
router.post('/register', (req, res) => {
  try {
    const { name, url, permissions = [] } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: 'Service name and URL are required'
      });
    }

    const service = AuthService.registerService(name, url, permissions);

    res.json({
      success: true,
      service: {
        id: service.id,
        name: service.name,
        url: service.url,
        permissions: service.permissions,
        token: service.token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to register service'
    });
  }
});

// Token verification endpoint
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const serviceToken = AuthService.verifyServiceToken(token);

    if (!serviceToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    res.json({
      success: true,
      serviceToken: {
        serviceId: serviceToken.serviceId,
        serviceName: serviceToken.serviceName,
        permissions: serviceToken.permissions,
        exp: serviceToken.exp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// Token refresh endpoint
router.post('/refresh', authenticateService(), (req: any, res) => {
  try {
    const serviceId = req.serviceId;
    const newToken = AuthService.refreshServiceToken(serviceId);

    if (!newToken) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// Service status endpoint
router.get('/status', (_req, res) => {
  res.json({
    message: 'Auth service is running',
    registeredServices: AuthService.getRegisteredServices().length
  });
});

export default router;