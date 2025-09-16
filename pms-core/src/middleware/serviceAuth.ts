import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';

interface AuthenticatedRequest extends Request {
  serviceToken?: any;
  serviceId?: string;
  serviceName?: string;
}

export const authenticateService = (requiredPermissions: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Service token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const serviceToken = AuthService.verifyServiceToken(token);

    if (!serviceToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired service token'
      });
    }

    // Check permissions if required
    if (requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some(permission =>
        AuthService.hasPermission(serviceToken, permission)
      );

      if (!hasRequiredPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required: requiredPermissions,
          granted: serviceToken.permissions
        });
      }
    }

    // Attach service info to request
    req.serviceToken = serviceToken;
    req.serviceId = serviceToken.serviceId;
    req.serviceName = serviceToken.serviceName;

    next();
  };
};

export const optionalServiceAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const serviceToken = AuthService.verifyServiceToken(token);

    if (serviceToken) {
      req.serviceToken = serviceToken;
      req.serviceId = serviceToken.serviceId;
      req.serviceName = serviceToken.serviceName;
    }
  }

  next();
};