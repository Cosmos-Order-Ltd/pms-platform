import { TrialCountdownData } from '../types/extended';
export interface TrialUser {
    id: string;
    invitationNumber: string;
    email: string;
    phone?: string;
    companyName: string;
    businessType: 'hotel' | 'real_estate' | 'company';
    tier: 'founder' | 'early_access' | 'beta' | 'standard';
    trialStartDate: Date;
    trialEndDate: Date;
    trialDays: number;
    activatedFeatures: string[];
    lastActivity: Date;
    conversionGoal: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    campaignsSent: string[];
    conversionEvents: Array<{
        event: string;
        timestamp: Date;
        value?: number;
    }>;
}
export interface CampaignTemplate {
    id: string;
    name: string;
    type: 'email' | 'sms' | 'in_app' | 'push';
    trigger: {
        daysRemaining: number;
        urgencyLevel?: string;
        activityThreshold?: number;
    };
    content: {
        subject: string;
        body: string;
        cta: string;
        urgencyMessage?: string;
    };
    businessTypeSpecific?: {
        hotel?: any;
        real_estate?: any;
        company?: any;
    };
}
export interface ConversionMetrics {
    totalTrials: number;
    activeTrials: number;
    expiredTrials: number;
    convertedTrials: number;
    conversionRate: number;
    averageTrialDuration: number;
    totalRevenuePotential: number;
    actualRevenue: number;
    campaignEffectiveness: {
        [campaignId: string]: {
            sent: number;
            opened: number;
            clicked: number;
            converted: number;
            conversionRate: number;
        };
    };
}
export declare class TrialCountdownService {
    private trials;
    private campaignTemplates;
    private isRunning;
    constructor();
    private initializeCampaignTemplates;
    startTrial(invitationNumber: string, userDetails: {
        email: string;
        phone?: string;
        companyName: string;
        businessType: 'hotel' | 'real_estate' | 'company';
        tier: 'founder' | 'early_access' | 'beta' | 'standard';
        trialDays: number;
        conversionGoal?: number;
    }): Promise<TrialUser>;
    getTrialCountdown(invitationNumber: string): TrialCountdownData | null;
    updateActivity(invitationNumber: string, activity: {
        feature?: string;
        event: string;
        value?: number;
    }): Promise<void>;
    convertTrial(invitationNumber: string, subscriptionValue: number): Promise<boolean>;
    private startCountdownService;
    private processCampaignTriggers;
    private shouldSendCampaign;
    private sendCampaign;
    private personalizeContent;
    private calculateUrgencyLevel;
    private calculateDefaultConversionGoal;
    getConversionMetrics(): Promise<ConversionMetrics>;
    private sendEmail;
    private sendSMS;
    private sendInAppNotification;
    private sendPushNotification;
    private sendConversionConfirmation;
    private sendDailyReminders;
    private processTrialExpirations;
    private generateTrialId;
}
declare const _default: TrialCountdownService;
export default _default;
//# sourceMappingURL=trialCountdown.d.ts.map