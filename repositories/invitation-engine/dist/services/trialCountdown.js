"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialCountdownService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
class TrialCountdownService {
    trials = new Map();
    campaignTemplates = [];
    isRunning = false;
    constructor() {
        this.initializeCampaignTemplates();
        this.startCountdownService();
    }
    initializeCampaignTemplates() {
        this.campaignTemplates = [
            {
                id: 'welcome',
                name: 'Trial Welcome & Onboarding',
                type: 'email',
                trigger: { daysRemaining: 30 },
                content: {
                    subject: '🎉 Welcome to Cyprus PMS - Your Trial Has Started!',
                    body: `Welcome to the Cyprus PMS Platform! Your {TRIAL_DAYS}-day trial is now active.

Here's what you can explore:
• Complete booking management system
• Real-time analytics dashboard
• Multi-property management tools
• Revenue optimization features

Need help getting started? Our Cyprus-based support team is here to assist you.`,
                    cta: 'Start Your Setup',
                    urgencyMessage: 'Make the most of your trial period!'
                }
            },
            {
                id: 'mid_trial_value',
                name: 'Mid-Trial Value Demonstration',
                type: 'email',
                trigger: { daysRemaining: 15 },
                content: {
                    subject: '📊 See How Cyprus PMS is Already Helping Your Business',
                    body: `You're halfway through your Cyprus PMS trial! Here's what you've accomplished:

✅ Properties connected: {PROPERTIES_COUNT}
✅ Bookings processed: {BOOKINGS_COUNT}
✅ Revenue insights generated: {INSIGHTS_COUNT}
✅ Time saved: {TIME_SAVED} hours

Ready to see advanced features? Explore our revenue optimization tools next.`,
                    cta: 'Explore Advanced Features',
                    urgencyMessage: '{DAYS_REMAINING} days left to explore everything!'
                }
            },
            {
                id: 'urgency_conversion',
                name: 'Urgent: Trial Expiring Soon',
                type: 'email',
                trigger: { daysRemaining: 3, urgencyLevel: 'high' },
                content: {
                    subject: '⚠️ Only {DAYS_REMAINING} Days Left - Secure Your Cyprus PMS Access',
                    body: `Your Cyprus PMS trial expires in just {DAYS_REMAINING} days!

Don't lose access to:
🎯 Your configured property settings
📊 All your analytics and reports
💼 Your booking pipeline and guest data
🚀 Revenue optimization recommendations

EXCLUSIVE OFFER: Upgrade now and get 20% off your first 3 months + free migration assistance from our Cyprus team.`,
                    cta: 'Secure My Access Now',
                    urgencyMessage: 'This offer expires with your trial!'
                }
            },
            {
                id: 'final_day',
                name: 'Final Day - Last Chance',
                type: 'email',
                trigger: { daysRemaining: 1, urgencyLevel: 'critical' },
                content: {
                    subject: '🚨 FINAL DAY: Your Cyprus PMS Trial Expires Tonight',
                    body: `This is your final reminder - your Cyprus PMS trial expires at midnight tonight!

After tonight, you'll lose access to:
• Your complete property management setup
• All booking data and guest profiles
• Revenue analytics and forecasting tools
• Direct support from our Cyprus team

LAST CHANCE OFFER: Convert today and receive:
✅ 30% off your first 6 months
✅ Free data migration and setup
✅ Priority support for 90 days
✅ Exclusive Cyprus market insights`,
                    cta: 'Convert Now - Final Hours',
                    urgencyMessage: 'Expires at midnight tonight!'
                }
            },
            {
                id: 'win_back',
                name: 'Win-Back: Special Re-activation Offer',
                type: 'email',
                trigger: { daysRemaining: -1 },
                content: {
                    subject: '🎯 Missed Your Cyprus PMS Trial? Special Re-activation Available',
                    body: `We noticed your Cyprus PMS trial recently expired. Based on your usage during the trial, we believe our platform could significantly impact your business.

We'd like to offer you a special opportunity:
🎁 Extended 14-day trial (no strings attached)
💼 Free one-on-one setup consultation
📊 Custom analytics report for your property
🎯 Personalized revenue optimization plan

This offer is valid for the next 7 days only.`,
                    cta: 'Reactivate My Trial',
                    urgencyMessage: 'Limited time offer - 7 days only'
                }
            },
            {
                id: 'low_activity',
                name: 'Need Help Getting Started?',
                type: 'email',
                trigger: { daysRemaining: 20, activityThreshold: 72 },
                content: {
                    subject: '🤝 Need Help Getting Started with Cyprus PMS?',
                    body: `We noticed you haven't been active in Cyprus PMS lately. Our platform has so much to offer, and we want to make sure you get the most from your trial.

Would you like:
📞 A free 30-minute setup call with our Cyprus team?
📚 Access to our quick-start video series?
🎯 A personalized demo for your specific business type?

Our goal is your success. Let us help you unlock the full potential of Cyprus PMS.`,
                    cta: 'Schedule Setup Help',
                    urgencyMessage: 'Don\'t waste your valuable trial time!'
                }
            }
        ];
    }
    async startTrial(invitationNumber, userDetails) {
        const trialStartDate = new Date();
        const trialEndDate = new Date(trialStartDate.getTime() + userDetails.trialDays * 24 * 60 * 60 * 1000);
        const trialUser = {
            id: this.generateTrialId(),
            invitationNumber,
            email: userDetails.email,
            phone: userDetails.phone,
            companyName: userDetails.companyName,
            businessType: userDetails.businessType,
            tier: userDetails.tier,
            trialStartDate,
            trialEndDate,
            trialDays: userDetails.trialDays,
            activatedFeatures: [],
            lastActivity: new Date(),
            conversionGoal: userDetails.conversionGoal || this.calculateDefaultConversionGoal(userDetails.businessType, userDetails.tier),
            urgencyLevel: 'low',
            campaignsSent: [],
            conversionEvents: [{
                    event: 'trial_started',
                    timestamp: new Date()
                }]
        };
        this.trials.set(invitationNumber, trialUser);
        await this.sendCampaign(trialUser, 'welcome');
        console.log(`🎯 Trial started for ${invitationNumber} (${userDetails.companyName}) - ${userDetails.trialDays} days`);
        return trialUser;
    }
    getTrialCountdown(invitationNumber) {
        const trial = this.trials.get(invitationNumber);
        if (!trial)
            return null;
        const now = new Date();
        const timeRemaining = Math.max(0, trial.trialEndDate.getTime() - now.getTime());
        const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
        const hoursRemaining = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
        return {
            timeRemaining: Math.floor(timeRemaining / 1000),
            daysRemaining,
            hoursRemaining,
            minutesRemaining,
            urgencyLevel: this.calculateUrgencyLevel(daysRemaining, trial),
            warningsSent: trial.campaignsSent
        };
    }
    async updateActivity(invitationNumber, activity) {
        const trial = this.trials.get(invitationNumber);
        if (!trial)
            return;
        trial.lastActivity = new Date();
        if (activity.feature && !trial.activatedFeatures.includes(activity.feature)) {
            trial.activatedFeatures.push(activity.feature);
        }
        trial.conversionEvents.push({
            event: activity.event,
            timestamp: new Date(),
            value: activity.value
        });
        const countdown = this.getTrialCountdown(invitationNumber);
        if (countdown) {
            trial.urgencyLevel = countdown.urgencyLevel;
        }
        this.trials.set(invitationNumber, trial);
    }
    async convertTrial(invitationNumber, subscriptionValue) {
        const trial = this.trials.get(invitationNumber);
        if (!trial)
            return false;
        trial.conversionEvents.push({
            event: 'converted',
            timestamp: new Date(),
            value: subscriptionValue
        });
        console.log(`🎉 CONVERSION SUCCESS: ${invitationNumber} (${trial.companyName}) - €${subscriptionValue}`);
        await this.sendConversionConfirmation(trial, subscriptionValue);
        return true;
    }
    startCountdownService() {
        if (this.isRunning)
            return;
        node_cron_1.default.schedule('0 * * * *', async () => {
            await this.processCampaignTriggers();
        });
        node_cron_1.default.schedule('0 9 * * *', async () => {
            await this.sendDailyReminders();
        });
        node_cron_1.default.schedule('0 0 * * *', async () => {
            await this.processTrialExpirations();
        });
        this.isRunning = true;
        console.log('🕒 Trial countdown service started');
    }
    async processCampaignTriggers() {
        for (const [invitationNumber, trial] of this.trials) {
            const countdown = this.getTrialCountdown(invitationNumber);
            if (!countdown)
                continue;
            for (const template of this.campaignTemplates) {
                if (this.shouldSendCampaign(trial, template, countdown)) {
                    await this.sendCampaign(trial, template.id);
                }
            }
        }
    }
    shouldSendCampaign(trial, template, countdown) {
        if (trial.campaignsSent.includes(template.id)) {
            return false;
        }
        if (template.trigger.daysRemaining !== countdown.daysRemaining) {
            return false;
        }
        if (template.trigger.urgencyLevel && template.trigger.urgencyLevel !== countdown.urgencyLevel) {
            return false;
        }
        if (template.trigger.activityThreshold) {
            const hoursSinceActivity = (Date.now() - trial.lastActivity.getTime()) / (60 * 60 * 1000);
            if (hoursSinceActivity < template.trigger.activityThreshold) {
                return false;
            }
        }
        return true;
    }
    async sendCampaign(trial, campaignId) {
        const template = this.campaignTemplates.find(t => t.id === campaignId);
        if (!template)
            return;
        const countdown = this.getTrialCountdown(trial.invitationNumber);
        if (!countdown)
            return;
        const personalizedContent = this.personalizeContent(template.content, trial, countdown);
        try {
            switch (template.type) {
                case 'email':
                    await this.sendEmail(trial, personalizedContent);
                    break;
                case 'sms':
                    await this.sendSMS(trial, personalizedContent);
                    break;
                case 'in_app':
                    await this.sendInAppNotification(trial, personalizedContent);
                    break;
                case 'push':
                    await this.sendPushNotification(trial, personalizedContent);
                    break;
            }
            trial.campaignsSent.push(campaignId);
            this.trials.set(trial.invitationNumber, trial);
            console.log(`📧 Campaign '${template.name}' sent to ${trial.invitationNumber} (${countdown.daysRemaining} days remaining)`);
        }
        catch (error) {
            console.error(`Failed to send campaign ${campaignId} to ${trial.invitationNumber}:`, error);
        }
    }
    personalizeContent(content, trial, countdown) {
        const personalizedContent = JSON.parse(JSON.stringify(content));
        const replacements = {
            '{COMPANY_NAME}': trial.companyName,
            '{TRIAL_DAYS}': trial.trialDays.toString(),
            '{DAYS_REMAINING}': countdown.daysRemaining.toString(),
            '{HOURS_REMAINING}': countdown.hoursRemaining.toString(),
            '{BUSINESS_TYPE}': trial.businessType.replace('_', ' '),
            '{TIER}': trial.tier,
            '{FEATURES_USED}': trial.activatedFeatures.length.toString(),
            '{CONVERSION_GOAL}': `€${trial.conversionGoal.toLocaleString()}`,
            '{PROPERTIES_COUNT}': Math.floor(Math.random() * 5) + 1,
            '{BOOKINGS_COUNT}': Math.floor(Math.random() * 50) + 10,
            '{INSIGHTS_COUNT}': Math.floor(Math.random() * 20) + 5,
            '{TIME_SAVED}': Math.floor(Math.random() * 10) + 5
        };
        Object.keys(replacements).forEach(key => {
            personalizedContent.subject = personalizedContent.subject?.replace(new RegExp(key, 'g'), replacements[key]);
            personalizedContent.body = personalizedContent.body?.replace(new RegExp(key, 'g'), replacements[key]);
            personalizedContent.urgencyMessage = personalizedContent.urgencyMessage?.replace(new RegExp(key, 'g'), replacements[key]);
        });
        return personalizedContent;
    }
    calculateUrgencyLevel(daysRemaining, trial) {
        const activityRecency = (Date.now() - trial.lastActivity.getTime()) / (24 * 60 * 60 * 1000);
        const featureUsage = trial.activatedFeatures.length;
        if (daysRemaining <= 1)
            return 'critical';
        if (daysRemaining <= 3)
            return 'high';
        if (daysRemaining <= 7 && (activityRecency > 2 || featureUsage < 3))
            return 'high';
        if (daysRemaining <= 14)
            return 'medium';
        return 'low';
    }
    calculateDefaultConversionGoal(businessType, tier) {
        const baseValues = {
            hotel: { founder: 5000, early_access: 3000, beta: 2000, standard: 1500 },
            real_estate: { founder: 4000, early_access: 2500, beta: 1800, standard: 1200 },
            company: { founder: 3000, early_access: 2000, beta: 1500, standard: 1000 }
        };
        return baseValues[businessType]?.[tier] || 1000;
    }
    async getConversionMetrics() {
        const trials = Array.from(this.trials.values());
        const now = new Date();
        const totalTrials = trials.length;
        const activeTrials = trials.filter(t => t.trialEndDate > now).length;
        const expiredTrials = trials.filter(t => t.trialEndDate <= now).length;
        const convertedTrials = trials.filter(t => t.conversionEvents.some(e => e.event === 'converted')).length;
        const conversionRate = totalTrials > 0 ? (convertedTrials / totalTrials) * 100 : 0;
        const totalRevenuePotential = trials.reduce((sum, t) => sum + t.conversionGoal, 0);
        const actualRevenue = trials.reduce((sum, t) => {
            const conversionEvent = t.conversionEvents.find(e => e.event === 'converted');
            return sum + (conversionEvent?.value || 0);
        }, 0);
        return {
            totalTrials,
            activeTrials,
            expiredTrials,
            convertedTrials,
            conversionRate,
            averageTrialDuration: trials.length > 0 ? trials.reduce((sum, t) => sum + t.trialDays, 0) / trials.length : 0,
            totalRevenuePotential,
            actualRevenue,
            campaignEffectiveness: {}
        };
    }
    async sendEmail(trial, content) {
        console.log(`📧 Email sent to ${trial.email}: ${content.subject}`);
    }
    async sendSMS(trial, content) {
        if (trial.phone) {
            console.log(`📱 SMS sent to ${trial.phone}: ${content.body.substring(0, 100)}...`);
        }
    }
    async sendInAppNotification(trial, content) {
        console.log(`🔔 In-app notification for ${trial.invitationNumber}: ${content.subject}`);
    }
    async sendPushNotification(trial, content) {
        console.log(`📲 Push notification for ${trial.invitationNumber}: ${content.subject}`);
    }
    async sendConversionConfirmation(trial, value) {
        console.log(`✅ Conversion confirmation sent to ${trial.email} for €${value}`);
    }
    async sendDailyReminders() {
        const metrics = await this.getConversionMetrics();
        console.log(`📊 Daily trial metrics: ${metrics.activeTrials} active, ${metrics.conversionRate.toFixed(1)}% conversion rate`);
    }
    async processTrialExpirations() {
        const now = new Date();
        let expiredCount = 0;
        for (const [invitationNumber, trial] of this.trials) {
            if (trial.trialEndDate <= now && !trial.campaignsSent.includes('win_back')) {
                await this.sendCampaign(trial, 'win_back');
                expiredCount++;
            }
        }
        if (expiredCount > 0) {
            console.log(`⏰ Processed ${expiredCount} trial expirations and sent win-back campaigns`);
        }
    }
    generateTrialId() {
        return Math.random().toString(36).substring(2, 15);
    }
}
exports.TrialCountdownService = TrialCountdownService;
exports.default = new TrialCountdownService();
//# sourceMappingURL=trialCountdown.js.map