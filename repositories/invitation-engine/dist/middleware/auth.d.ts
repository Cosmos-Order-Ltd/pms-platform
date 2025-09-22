import { Request, Response, NextFunction } from 'express';
export declare const adminAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const generateAdminToken: (adminId?: string) => string;
declare const _default: {
    adminAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generateAdminToken: (adminId?: string) => string;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map