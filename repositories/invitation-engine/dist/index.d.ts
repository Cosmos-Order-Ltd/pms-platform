import { Server as SocketIOServer } from 'socket.io';
declare class InvitationServer {
    private app;
    private adminApp;
    private server;
    private adminServer;
    private io;
    private adminIo;
    constructor();
    private setupMainApp;
    private setupAdminApp;
    private setupMiddleware;
    private setupRoutes;
    private setupErrorHandling;
    private setupWebSockets;
    start(): Promise<void>;
    shutdown(): Promise<void>;
    get webSockets(): {
        main: SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
        admin: SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    };
}
declare const invitationServer: InvitationServer;
export default invitationServer;
declare global {
    namespace Express {
        interface Request {
            requestId?: string;
            startTime?: number;
            user?: {
                id: string;
                role: string;
                permissions: string[];
            };
        }
    }
}
//# sourceMappingURL=index.d.ts.map