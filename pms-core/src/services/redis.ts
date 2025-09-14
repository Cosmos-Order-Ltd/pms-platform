import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const initializeRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        commandTimeout: 5000,
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });

    redisClient.on('end', () => {
      console.log('Redis connection ended');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

// Session management
export const setSession = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
  const client = getRedisClient();
  await client.setEx(key, ttl, JSON.stringify(value));
};

export const getSession = async (key: string): Promise<any | null> => {
  const client = getRedisClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
};

export const deleteSession = async (key: string): Promise<void> => {
  const client = getRedisClient();
  await client.del(key);
};

// Service token management
export const setServiceToken = async (serviceId: string, token: any, ttl: number = 3600): Promise<void> => {
  const key = `service:${serviceId}:token`;
  await setSession(key, token, ttl);
};

export const getServiceToken = async (serviceId: string): Promise<any | null> => {
  const key = `service:${serviceId}:token`;
  return await getSession(key);
};

export const revokeServiceToken = async (serviceId: string): Promise<void> => {
  const key = `service:${serviceId}:token`;
  await deleteSession(key);
};

// Rate limiting support
export const incrementRateLimit = async (key: string, window: number = 3600): Promise<number> => {
  const client = getRedisClient();
  const current = await client.incr(key);
  if (current === 1) {
    await client.expire(key, window);
  }
  return current;
};

export const getRateLimitCount = async (key: string): Promise<number> => {
  const client = getRedisClient();
  const count = await client.get(key);
  return count ? parseInt(count) : 0;
};