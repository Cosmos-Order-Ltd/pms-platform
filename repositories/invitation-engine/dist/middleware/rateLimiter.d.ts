import { Request, Response, NextFunction } from 'express';
export declare const globalRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const invitationCreationRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const locationVerificationRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const qrScanRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const smsVerificationRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const adminRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const webhookRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const failedAttemptsRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cyprusBusinessRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const geofencingRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const adaptiveRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default globalRateLimit;
//# sourceMappingURL=rateLimiter.d.ts.map