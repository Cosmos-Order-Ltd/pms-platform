import { Router } from 'express';
import { AuthService } from '../services/auth';
import { authenticateService } from '../middleware/serviceAuth';

const router = Router();

// Get all registered services
router.get('/', authenticateService(['admin:read']), (_req, res) => {
  try {
    const services = AuthService.getRegisteredServices().map(service => ({
      id: service.id,
      name: service.name,
      url: service.url,
      permissions: service.permissions,
      status: service.status,
      lastSeen: service.lastSeen
    }));

    res.json({
      success: true,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services'
    });
  }
});

// Get specific service
router.get('/:serviceId', authenticateService(['admin:read']), (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = AuthService.getService(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service: {
        id: service.id,
        name: service.name,
        url: service.url,
        permissions: service.permissions,
        status: service.status,
        lastSeen: service.lastSeen
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service'
    });
  }
});

// Deregister service
router.delete('/:serviceId', authenticateService(['admin:write']), (req, res) => {
  try {
    const { serviceId } = req.params;
    const deleted = AuthService.deregisterService(serviceId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deregistered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to deregister service'
    });
  }
});

// Health check and cleanup
router.post('/cleanup', authenticateService(['admin:write']), (req, res) => {
  try {
    const { maxInactiveMinutes = 30 } = req.body;
    const removed = AuthService.cleanupInactiveServices(maxInactiveMinutes);

    res.json({
      success: true,
      message: `Cleaned up ${removed} inactive services`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cleanup failed'
    });
  }
});

// Service status endpoint
router.get('/status', (_req, res) => {
  res.json({
    message: 'Services registry is running',
    totalServices: AuthService.getRegisteredServices().length,
    activeServices: AuthService.getRegisteredServices().filter(s => s.status === 'active').length
  });
});

export default router;