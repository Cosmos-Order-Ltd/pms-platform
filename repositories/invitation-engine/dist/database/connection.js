"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
exports.getNextInvitationNumber = getNextInvitationNumber;
exports.isCyprusLocation = isCyprusLocation;
exports.calculateDistance = calculateDistance;
exports.generateSecureHash = generateSecureHash;
exports.isValidCyprusBusinessRegistration = isValidCyprusBusinessRegistration;
exports.isValidCyprusMobile = isValidCyprusMobile;
const pg_1 = require("pg");
const redis_1 = require("redis");
const winston_1 = __importDefault(require("winston"));
class DatabaseManager {
    pool;
    redisClient;
    logger;
    isConnected = false;
    redisConnected = false;
    constructor() {
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'logs/database.log' })
            ]
        });
        this.initializePostgreSQL();
        this.initializeRedis();
    }
    initializePostgreSQL() {
        const dbConfig = {
            host: process.env.DB_HOST || '192.168.30.98',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'invitations',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            ssl: process.env.NODE_ENV === 'production',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };
        this.pool = new pg_1.Pool(dbConfig);
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
    initializeRedis() {
        const redisConfig = {
            url: process.env.REDIS_URL || 'redis://192.168.30.98:6379',
            prefix: process.env.REDIS_PREFIX || 'cac',
            maxRetries: 3,
            retryDelayOnFailover: 100,
        };
        this.redisClient = (0, redis_1.createClient)({
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
        this.redisClient.connect().catch((err) => {
            this.logger.error('Failed to connect to Redis', err);
        });
    }
    async query(text, params) {
        const start = Date.now();
        let client;
        try {
            client = await this.pool.connect();
            const result = await client.query(text, params);
            const duration = Date.now() - start;
            this.logger.debug('Query executed', {
                query: text.substring(0, 100),
                duration,
                rows: result.rowCount
            });
            return result;
        }
        catch (error) {
            const duration = Date.now() - start;
            this.logger.error('Query failed', {
                query: text.substring(0, 100),
                duration,
                error: error instanceof Error ? error.message : 'Unknown error',
                params: params ? '[REDACTED]' : undefined
            });
            throw error;
        }
        finally {
            if (client) {
                client.release();
            }
        }
    }
    async transaction(callback) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            this.logger.error('Transaction failed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
        finally {
            client.release();
        }
    }
    async setCache(key, value, ttlSeconds) {
        try {
            const prefixedKey = `${process.env.REDIS_PREFIX || 'cac'}:${key}`;
            if (ttlSeconds) {
                await this.redisClient.setEx(prefixedKey, ttlSeconds, value);
            }
            else {
                await this.redisClient.set(prefixedKey, value);
            }
        }
        catch (error) {
            this.logger.error('Redis SET failed', { key, error });
            throw error;
        }
    }
    async getCache(key) {
        try {
            const prefixedKey = `${process.env.REDIS_PREFIX || 'cac'}:${key}`;
            return await this.redisClient.get(prefixedKey);
        }
        catch (error) {
            this.logger.error('Redis GET failed', { key, error });
            return null;
        }
    }
    async deleteCache(key) {
        try {
            const prefixedKey = `${process.env.REDIS_PREFIX || 'cac'}:${key}`;
            await this.redisClient.del(prefixedKey);
        }
        catch (error) {
            this.logger.error('Redis DELETE failed', { key, error });
            throw error;
        }
    }
    async setCacheObject(key, obj, ttlSeconds) {
        await this.setCache(key, JSON.stringify(obj), ttlSeconds);
    }
    async getCacheObject(key) {
        const value = await this.getCache(key);
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch (error) {
            this.logger.error('Failed to parse cached object', { key, error });
            return null;
        }
    }
    async healthCheck() {
        const result = {
            postgres: false,
            redis: false,
            details: {}
        };
        try {
            await this.query('SELECT 1');
            result.postgres = true;
            result.details.postgres = 'Connected';
        }
        catch (error) {
            result.details.postgres = error instanceof Error ? error.message : 'Connection failed';
        }
        try {
            await this.redisClient.ping();
            result.redis = true;
            result.details.redis = 'Connected';
        }
        catch (error) {
            result.details.redis = error instanceof Error ? error.message : 'Connection failed';
        }
        return result;
    }
    getPoolStats() {
        return {
            totalCount: this.pool.totalCount,
            idleCount: this.pool.idleCount,
            waitingCount: this.pool.waitingCount
        };
    }
    async close() {
        this.logger.info('Closing database connections...');
        try {
            await this.pool.end();
            this.isConnected = false;
            this.logger.info('PostgreSQL pool closed');
        }
        catch (error) {
            this.logger.error('Error closing PostgreSQL pool', error);
        }
        try {
            await this.redisClient.quit();
            this.redisConnected = false;
            this.logger.info('Redis connection closed');
        }
        catch (error) {
            this.logger.error('Error closing Redis connection', error);
        }
    }
    get connected() {
        return this.isConnected && this.redisConnected;
    }
    get rawPool() {
        return this.pool;
    }
    get rawRedis() {
        return this.redisClient;
    }
}
exports.DatabaseManager = DatabaseManager;
const databaseManager = new DatabaseManager();
exports.default = databaseManager;
async function getNextInvitationNumber(businessType) {
    const prefixes = {
        hotel: 'CYH',
        real_estate: 'CYR',
        company: 'CYC'
    };
    const result = await databaseManager.transaction(async (client) => {
        const sequenceResult = await client.query(`SELECT config_value->>'${businessType}' as current_number FROM system_config WHERE config_key = 'invitation_sequences'`);
        const currentNumber = parseInt(sequenceResult.rows[0]?.current_number || '0');
        const nextNumber = currentNumber + 1;
        await client.query(`UPDATE system_config
       SET config_value = config_value || $1::jsonb
       WHERE config_key = 'invitation_sequences'`, [JSON.stringify({ [businessType]: nextNumber })]);
        return `${prefixes[businessType]}-${nextNumber.toString().padStart(3, '0')}`;
    });
    return result;
}
function isCyprusLocation(lat, lng) {
    const bounds = {
        north: 35.7011,
        south: 34.5588,
        east: 34.6049,
        west: 32.2567
    };
    return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
}
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function generateSecureHash(input) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(input).digest('hex');
}
function isValidCyprusBusinessRegistration(regNumber) {
    const pattern = /^HE\d{6}$/;
    return pattern.test(regNumber);
}
function isValidCyprusMobile(mobile) {
    const patterns = [
        /^\+357\s?\d{8}$/,
        /^00357\s?\d{8}$/,
        /^\d{8}$/
    ];
    return patterns.some(pattern => pattern.test(mobile.replace(/\s/g, '')));
}
//# sourceMappingURL=connection.js.map