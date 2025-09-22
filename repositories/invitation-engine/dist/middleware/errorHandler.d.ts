import { Request, Response, NextFunction } from 'express';
export declare class APIError extends Error {
    statusCode: number;
    code: string;
    details?: Record<string, any>;
    constructor(message: string, statusCode?: number, code?: string, details?: Record<string, any>);
}
export declare class ValidationError extends APIError {
    constructor(message: string, details?: Record<string, any>);
}
export declare class NotFoundError extends APIError {
    constructor(resource: string, id?: string);
}
export declare class UnauthorizedError extends APIError {
    constructor(message?: string);
}
export declare class ForbiddenError extends APIError {
    constructor(message?: string);
}
export declare class ConflictError extends APIError {
    constructor(message: string, details?: Record<string, any>);
}
export declare class GeofencingError extends APIError {
    constructor(message: string, details?: Record<string, any>);
}
export declare class CourierError extends APIError {
    constructor(message: string, details?: Record<string, any>);
}
export declare class RateLimitError extends APIError {
    constructor(message?: string);
}
declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const formatErrorResponse: (code: string, message: string, statusCode?: number, details?: Record<string, any>, requestId?: string) => {
    success: boolean;
    error: {
        code: string;
        message: string;
        details: Record<string, any> | undefined;
        timestamp: string;
        requestId: string | undefined;
        service: string;
    };
};
export declare const formatValidationError: (error: any) => ValidationError;
export declare const formatGeofencingError: (message: string, coordinates?: {
    lat: number;
    lng: number;
}, distance?: number, allowedRadius?: number) => GeofencingError;
export declare class CyprusValidationError extends ValidationError {
    constructor(field: string, value: any, expectedFormat: string);
}
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map