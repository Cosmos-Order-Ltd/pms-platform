/**
 * Cyprus Access Control (CAC) - Authentication Middleware
 * JWT-based authentication for admin and API access
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-for-invitation-system';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-admin-dashboard-password';

interface JWTPayload {
  id: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

/**
 * Admin authentication middleware
 */
export const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const adminPassword = req.headers['x-admin-password'];

    // Check for admin password in header (simple auth for now)
    if (adminPassword === ADMIN_PASSWORD) {
      req.user = {
        id: 'admin',
        role: 'admin',
        permissions: ['*']
      };
      next();
      return;
    }

    // Check for JWT token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token required');
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (payload.role !== 'admin') {
      throw new ForbiddenError('Admin access required');
    }

    req.user = {
      id: payload.id,
      role: payload.role,
      permissions: payload.permissions
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid authentication token'));
    } else {
      next(error);
    }
  }
};

/**
 * Generate admin JWT token
 */
export const generateAdminToken = (adminId: string = 'admin'): string => {
  return jwt.sign(
    {
      id: adminId,
      role: 'admin',
      permissions: ['*']
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export default { adminAuth, generateAdminToken };