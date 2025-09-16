import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface ServiceToken {
  serviceId: string;
  serviceName: string;
  permissions: string[];
  iat: number;
  exp: number;
}

interface ServiceRegistration {
  id: string;
  name: string;
  url: string;
  permissions: string[];
  status: 'active' | 'inactive';
  lastSeen: Date;
  token?: string;
}

// In-memory service registry (in production, this would be in Redis/Database)
const serviceRegistry = new Map<string, ServiceRegistration>();

const JWT_SECRET = process.env.JWT_SECRET || 'pms-core-secret-change-in-production';
const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  // Register a new service
  static registerService(name: string, url: string, permissions: string[] = []): ServiceRegistration {
    const serviceId = uuidv4();
    const service: ServiceRegistration = {
      id: serviceId,
      name,
      url,
      permissions,
      status: 'active',
      lastSeen: new Date()
    };

    // Generate service token
    const token = this.generateServiceToken(serviceId, name, permissions);
    service.token = token;

    serviceRegistry.set(serviceId, service);
    console.log(`✅ Service registered: ${name} (${serviceId})`);

    return service;
  }

  // Generate JWT token for service
  static generateServiceToken(serviceId: string, serviceName: string, permissions: string[]): string {
    const payload: ServiceToken = {
      serviceId,
      serviceName,
      permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }

  // Verify service token
  static verifyServiceToken(token: string): ServiceToken | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as ServiceToken;

      // Check if service is still registered
      const service = serviceRegistry.get(decoded.serviceId);
      if (!service || service.status !== 'active') {
        console.warn(`⚠️ Service not found or inactive: ${decoded.serviceId}`);
        return null;
      }

      // Update last seen
      service.lastSeen = new Date();
      serviceRegistry.set(decoded.serviceId, service);

      return decoded;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return null;
    }
  }

  // Get all registered services
  static getRegisteredServices(): ServiceRegistration[] {
    return Array.from(serviceRegistry.values());
  }

  // Get service by ID
  static getService(serviceId: string): ServiceRegistration | undefined {
    return serviceRegistry.get(serviceId);
  }

  // Deregister service
  static deregisterService(serviceId: string): boolean {
    const deleted = serviceRegistry.delete(serviceId);
    if (deleted) {
      console.log(`✅ Service deregistered: ${serviceId}`);
    }
    return deleted;
  }

  // Check service permissions
  static hasPermission(serviceToken: ServiceToken, requiredPermission: string): boolean {
    return serviceToken.permissions.includes(requiredPermission) ||
           serviceToken.permissions.includes('*');
  }

  // Refresh service token
  static refreshServiceToken(serviceId: string): string | null {
    const service = serviceRegistry.get(serviceId);
    if (!service) {
      return null;
    }

    const newToken = this.generateServiceToken(serviceId, service.name, service.permissions);
    service.token = newToken;
    service.lastSeen = new Date();
    serviceRegistry.set(serviceId, service);

    return newToken;
  }

  // Health check - remove inactive services
  static cleanupInactiveServices(maxInactiveMinutes: number = 30): number {
    const cutoff = new Date(Date.now() - maxInactiveMinutes * 60 * 1000);
    let removed = 0;

    for (const [serviceId, service] of serviceRegistry.entries()) {
      if (service.lastSeen < cutoff) {
        serviceRegistry.delete(serviceId);
        removed++;
        console.log(`🧹 Removed inactive service: ${service.name} (${serviceId})`);
      }
    }

    return removed;
  }
}

// Auto-register core services
export function initializeCoreServices(): void {
  // Register the backend API service
  AuthService.registerService('pms-backend', 'http://localhost:5000', [
    'users:read', 'users:write',
    'properties:read', 'properties:write',
    'reservations:read', 'reservations:write',
    'rooms:read', 'rooms:write',
    'admin:read', 'admin:write'
  ]);

  // Register the admin dashboard
  AuthService.registerService('pms-admin', 'http://localhost:3001', [
    'admin:read', 'admin:write',
    'users:read', 'users:write',
    'properties:read', 'properties:write'
  ]);

  // Register the guest portal
  AuthService.registerService('pms-guest', 'http://localhost:3002', [
    'reservations:read', 'reservations:write',
    'properties:read',
    'rooms:read'
  ]);

  // Register the staff app
  AuthService.registerService('pms-staff', 'http://localhost:3003', [
    'tasks:read', 'tasks:write',
    'housekeeping:read', 'housekeeping:write',
    'rooms:read', 'rooms:write'
  ]);

  // Register the marketplace
  AuthService.registerService('pms-marketplace', 'http://localhost:3004', [
    'marketplace:read', 'marketplace:write',
    'properties:read',
    'listings:read', 'listings:write'
  ]);

  console.log('🔐 Core services registered with authentication tokens');
}