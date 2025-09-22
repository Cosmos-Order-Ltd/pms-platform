/**
 * Cyprus Access Control (CAC) - Database Connection
 * PostgreSQL connection management with connection pooling
 */

import { Pool, PoolClient, QueryResult } from 'pg';
import { createClient, RedisClientType } from 'redis';
import winston from 'winston';

// Database configuration interface
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number; // max number of clients in pool
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Redis configuration interface
interface RedisConfig {
  url: string;
  prefix: string;
  maxRetries: number;
  retryDelayOnFailover: number;
}

class DatabaseManager {
  private pool: Pool;
  private redisClient: RedisClientType;
  private logger: winston.Logger;
  private isConnected: boolean = false;
  private redisConnected: boolean = false;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/database.log' })
      ]
    });

    this.initializePostgreSQL();
    this.initializeRedis();
  }

  /**
   * Initialize PostgreSQL connection pool
   */
  private initializePostgreSQL(): void {
    const dbConfig: DatabaseConfig = {
      host: process.env.DB_HOST || '192.168.30.98',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'invitations',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.NODE_ENV === 'production',
      max: 20, // max number of clients in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(dbConfig);

    // Handle pool events
    this.pool.on('connect', () => {
      this.isConnected = true;
      this.logger.info('New PostgreSQL client connected');
    });

    this.pool.on('error', (err) => {
      this.isConnected = false;
      this.logger.error('Unexpected error on idle PostgreSQL client', err);
    });

    this.pool.on('remove', () => {
      this.logger.info('PostgreSQL client removed from pool');
    });
  }

  /**
   * Initialize Redis connection
   */
  private initializeRedis(): void {
    const redisConfig: RedisConfig = {
      url: process.env.REDIS_URL || 'redis://192.168.30.98:6379',
      prefix: process.env.REDIS_PREFIX || 'cac',
      maxRetries: 3,
      retryDelayOnFailover: 100,
    };

    this.redisClient = createClient({
      url: redisConfig.url,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > redisConfig.maxRetries) {
            this.logger.error('Redis connection failed after max retries');
            return false;
          }
          return Math.min(retries * 50, 500);
        }
      }
    });

    // Handle Redis events
    this.redisClient.on('connect', () => {
      this.redisConnected = true;
      this.logger.info('Connected to Redis');
    });

    this.redisClient.on('error', (err) => {
      this.redisConnected = false;
      this.logger.error('Redis connection error', err);
    });

    this.redisClient.on('reconnecting', () => {
      this.logger.info('Reconnecting to Redis...');
    });

    // Connect to Redis
    this.redisClient.connect().catch((err) => {
      this.logger.error('Failed to connect to Redis', err);
    });
  }

  /**
   * Execute a PostgreSQL query
   */
  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    let client: PoolClient | undefined;

    try {
      client = await this.pool.connect();
      const result = await client.query<T>(text, params);
      const duration = Date.now() - start;

      this.logger.debug('Query executed', {
        query: text.substring(0, 100),
        duration,
        rows: result.rowCount
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error('Query failed', {
        query: text.substring(0, 100),
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        params: params ? '[REDACTED]' : undefined
      });
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  /**
   * Execute a transaction
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Transaction failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Redis operations with error handling
   */
  async setCache(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      const prefixedKey = `${process.env.REDIS_PREFIX || 'cac'}:${key}`;
      if (ttlSeconds) {
        await this.redisClient.setEx(prefixedKey, ttlSeconds, value);
      } else {
        await this.redisClient.set(prefixedKey, value);
      }
    } catch (error) {
      this.logger.error('Redis SET failed', { key, error });
      throw error;
    }
  }

  async getCache(key: string): Promise<string | null> {
    try {
      const prefixedKey = `${process.env.REDIS_PREFIX || 'cac'}:${key}`;
      return await this.redisClient.get(prefixedKey);
    } catch (error) {
      this.logger.error('Redis GET failed', { key, error });
      return null;
    }
  }

  async deleteCache(key: string): Promise<void> {
    try {
      const prefixedKey = `${process.env.REDIS_PREFIX || 'cac'}:${key}`;
      await this.redisClient.del(prefixedKey);
    } catch (error) {
      this.logger.error('Redis DELETE failed', { key, error });
      throw error;
    }
  }

  async setCacheObject(key: string, obj: Record<string, any>, ttlSeconds?: number): Promise<void> {
    await this.setCache(key, JSON.stringify(obj), ttlSeconds);
  }

  async getCacheObject<T = Record<string, any>>(key: string): Promise<T | null> {
    const value = await this.getCache(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error('Failed to parse cached object', { key, error });
      return null;
    }
  }

  /**
   * Health check for both PostgreSQL and Redis
   */
  async healthCheck(): Promise<{
    postgres: boolean;
    redis: boolean;
    details: {
      postgres?: string;
      redis?: string;
    };
  }> {
    const result = {
      postgres: false,
      redis: false,
      details: {} as Record<string, string>
    };

    // Test PostgreSQL
    try {
      await this.query('SELECT 1');
      result.postgres = true;
      result.details.postgres = 'Connected';
    } catch (error) {
      result.details.postgres = error instanceof Error ? error.message : 'Connection failed';
    }

    // Test Redis
    try {
      await this.redisClient.ping();
      result.redis = true;
      result.details.redis = 'Connected';
    } catch (error) {
      result.details.redis = error instanceof Error ? error.message : 'Connection failed';
    }

    return result;
  }

  /**
   * Get connection pool statistics
   */
  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  /**
   * Graceful shutdown
   */
  async close(): Promise<void> {
    this.logger.info('Closing database connections...');

    try {
      await this.pool.end();
      this.isConnected = false;
      this.logger.info('PostgreSQL pool closed');
    } catch (error) {
      this.logger.error('Error closing PostgreSQL pool', error);
    }

    try {
      await this.redisClient.quit();
      this.redisConnected = false;
      this.logger.info('Redis connection closed');
    } catch (error) {
      this.logger.error('Error closing Redis connection', error);
    }
  }

  /**
   * Check if database is connected
   */
  get connected(): boolean {
    return this.isConnected && this.redisConnected;
  }

  /**
   * Get the raw pool for advanced operations
   */
  get rawPool(): Pool {
    return this.pool;
  }

  /**
   * Get the raw Redis client for advanced operations
   */
  get rawRedis(): RedisClientType {
    return this.redisClient;
  }
}

// Singleton instance
const databaseManager = new DatabaseManager();

export default databaseManager;
export { DatabaseManager };

/**
 * Utility functions for common database operations
 */

// Generate next invitation number
export async function getNextInvitationNumber(businessType: 'hotel' | 'real_estate' | 'company'): Promise<string> {
  const prefixes = {
    hotel: 'CYH',
    real_estate: 'CYR',
    company: 'CYC'
  };

  const result = await databaseManager.transaction(async (client) => {
    // Get current sequence number
    const sequenceResult = await client.query(
      `SELECT config_value->>'${businessType}' as current_number FROM system_config WHERE config_key = 'invitation_sequences'`
    );

    const currentNumber = parseInt(sequenceResult.rows[0]?.current_number || '0');
    const nextNumber = currentNumber + 1;

    // Update sequence
    await client.query(
      `UPDATE system_config
       SET config_value = config_value || $1::jsonb
       WHERE config_key = 'invitation_sequences'`,
      [JSON.stringify({ [businessType]: nextNumber })]
    );

    return `${prefixes[businessType]}-${nextNumber.toString().padStart(3, '0')}`;
  });

  return result;
}

// Cyprus location validation
export function isCyprusLocation(lat: number, lng: number): boolean {
  const bounds = {
    north: 35.7011,
    south: 34.5588,
    east: 34.6049,
    west: 32.2567
  };

  return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
}

// Distance calculation using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Generate secure hash
export function generateSecureHash(input: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(input).digest('hex');
}

// Validate Cyprus business registration number
export function isValidCyprusBusinessRegistration(regNumber: string): boolean {
  // Cyprus business registration format: HE123456
  const pattern = /^HE\d{6}$/;
  return pattern.test(regNumber);
}

// Cyprus mobile number validation
export function isValidCyprusMobile(mobile: string): boolean {
  // Cyprus mobile format: +357 99 123456 or 99123456
  const patterns = [
    /^\+357\s?\d{8}$/,
    /^00357\s?\d{8}$/,
    /^\d{8}$/
  ];

  return patterns.some(pattern => pattern.test(mobile.replace(/\s/g, '')));
}