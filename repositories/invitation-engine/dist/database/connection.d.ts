import { Pool, PoolClient, QueryResult } from 'pg';
import { RedisClientType } from 'redis';
declare class DatabaseManager {
    private pool;
    private redisClient;
    private logger;
    private isConnected;
    private redisConnected;
    constructor();
    private initializePostgreSQL;
    private initializeRedis;
    query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
    setCache(key: string, value: string, ttlSeconds?: number): Promise<void>;
    getCache(key: string): Promise<string | null>;
    deleteCache(key: string): Promise<void>;
    setCacheObject(key: string, obj: Record<string, any>, ttlSeconds?: number): Promise<void>;
    getCacheObject<T = Record<string, any>>(key: string): Promise<T | null>;
    healthCheck(): Promise<{
        postgres: boolean;
        redis: boolean;
        details: {
            postgres?: string;
            redis?: string;
        };
    }>;
    getPoolStats(): {
        totalCount: number;
        idleCount: number;
        waitingCount: number;
    };
    close(): Promise<void>;
    get connected(): boolean;
    get rawPool(): Pool;
    get rawRedis(): RedisClientType;
}
declare const databaseManager: DatabaseManager;
export default databaseManager;
export { DatabaseManager };
export declare function getNextInvitationNumber(businessType: 'hotel' | 'real_estate' | 'company'): Promise<string>;
export declare function isCyprusLocation(lat: number, lng: number): boolean;
export declare function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
export declare function generateSecureHash(input: string): string;
export declare function isValidCyprusBusinessRegistration(regNumber: string): boolean;
export declare function isValidCyprusMobile(mobile: string): boolean;
//# sourceMappingURL=connection.d.ts.map