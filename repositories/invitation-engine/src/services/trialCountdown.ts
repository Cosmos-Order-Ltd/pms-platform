/**
 * Cyprus Access Control (CAC) - Trial Countdown System
 * Automated trial management with urgency campaigns and conversion optimization
 */

import cron from 'node-cron';
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
  conversionGoal: number; // EUR value of potential subscription
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
    activityThreshold?: number; // hours since last activity
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

export class TrialCountdownService {
  private trials: Map<string, TrialUser> = new Map();
  private campaignTemplates: CampaignTemplate[] = [];
  private isRunning: boolean = false;

  constructor() {
    this.initializeCampaignTemplates();
    this.startCountdownService();
  }

  /**
   * Initialize predefined campaign templates
   */
  private initializeCampaignTemplates(): void {
    this.campaignTemplates = [
      // Welcome Campaign
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

      // Mid-trial Engagement
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

      // High-Urgency Conversion Campaign
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

      // Final Day Campaign
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

      // Expired Trial - Win-back Campaign
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

      // Activity-Based Campaigns
      {
        id: 'low_activity',
        name: 'Need Help Getting Started?',
        type: 'email',
        trigger: { daysRemaining: 20, activityThreshold: 72 }, // 3 days inactive
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

  /**
   * Start a new trial for a user
   */
  async startTrial(invitationNumber: string, userDetails: {
    email: string;
    phone?: string;
    companyName: string;
    businessType: 'hotel' | 'real_estate' | 'company';
    tier: 'founder' | 'early_access' | 'beta' | 'standard';
    trialDays: number;
    conversionGoal?: number;
  }): Promise<TrialUser> {
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate.getTime() + userDetails.trialDays * 24 * 60 * 60 * 1000);

    const trialUser: TrialUser = {
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

    // Send welcome campaign immediately
    await this.sendCampaign(trialUser, 'welcome');

    console.log(`🎯 Trial started for ${invitationNumber} (${userDetails.companyName}) - ${userDetails.trialDays} days`);

    return trialUser;
  }

  /**
   * Get trial countdown data for a user
   */
  getTrialCountdown(invitationNumber: string): TrialCountdownData | null {
    const trial = this.trials.get(invitationNumber);
    if (!trial) return null;

    const now = new Date();
    const timeRemaining = Math.max(0, trial.trialEndDate.getTime() - now.getTime());
    const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const hoursRemaining = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    return {
      timeRemaining: Math.floor(timeRemaining / 1000), // seconds
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      urgencyLevel: this.calculateUrgencyLevel(daysRemaining, trial),
      warningsSent: trial.campaignsSent
    };
  }

  /**
   * Update user activity and feature usage
   */
  async updateActivity(invitationNumber: string, activity: {
    feature?: string;
    event: string;
    value?: number;
  }): Promise<void> {
    const trial = this.trials.get(invitationNumber);
    if (!trial) return;

    trial.lastActivity = new Date();

    if (activity.feature && !trial.activatedFeatures.includes(activity.feature)) {
      trial.activatedFeatures.push(activity.feature);
    }

    trial.conversionEvents.push({
      event: activity.event,
      timestamp: new Date(),
      value: activity.value
    });

    // Update urgency level based on activity
    const countdown = this.getTrialCountdown(invitationNumber);
    if (countdown) {
      trial.urgencyLevel = countdown.urgencyLevel;
    }

    this.trials.set(invitationNumber, trial);
  }

  /**
   * Process trial conversion
   */
  async convertTrial(invitationNumber: string, subscriptionValue: number): Promise<boolean> {
    const trial = this.trials.get(invitationNumber);
    if (!trial) return false;

    trial.conversionEvents.push({
      event: 'converted',
      timestamp: new Date(),
      value: subscriptionValue
    });

    console.log(`🎉 CONVERSION SUCCESS: ${invitationNumber} (${trial.companyName}) - €${subscriptionValue}`);

    // Send conversion confirmation
    await this.sendConversionConfirmation(trial, subscriptionValue);

    return true;
  }

  /**
   * Start the countdown service with cron jobs
   */
  private startCountdownService(): void {
    if (this.isRunning) return;

    // Run every hour to check for campaign triggers
    cron.schedule('0 * * * *', async () => {
      await this.processCampaignTriggers();
    });

    // Run daily at 9 AM to send daily reminders
    cron.schedule('0 9 * * *', async () => {
      await this.sendDailyReminders();
    });

    // Run at midnight to process trial expirations
    cron.schedule('0 0 * * *', async () => {
      await this.processTrialExpirations();
    });

    this.isRunning = true;
    console.log('🕒 Trial countdown service started');
  }

  /**
   * Process campaign triggers for all active trials
   */
  private async processCampaignTriggers(): Promise<void> {
    for (const [invitationNumber, trial] of this.trials) {
      const countdown = this.getTrialCountdown(invitationNumber);
      if (!countdown) continue;

      for (const template of this.campaignTemplates) {
        if (this.shouldSendCampaign(trial, template, countdown)) {
          await this.sendCampaign(trial, template.id);
        }
      }
    }
  }

  /**
   * Check if a campaign should be sent
   */
  private shouldSendCampaign(trial: TrialUser, template: CampaignTemplate, countdown: TrialCountdownData): boolean {
    // Already sent this campaign
    if (trial.campaignsSent.includes(template.id)) {
      return false;
    }

    // Check days remaining trigger
    if (template.trigger.daysRemaining !== countdown.daysRemaining) {
      return false;
    }

    // Check urgency level if specified
    if (template.trigger.urgencyLevel && template.trigger.urgencyLevel !== countdown.urgencyLevel) {
      return false;
    }

    // Check activity threshold if specified
    if (template.trigger.activityThreshold) {
      const hoursSinceActivity = (Date.now() - trial.lastActivity.getTime()) / (60 * 60 * 1000);
      if (hoursSinceActivity < template.trigger.activityThreshold) {
        return false;
      }
    }

    return true;
  }

  /**
   * Send a campaign to a trial user
   */
  private async sendCampaign(trial: TrialUser, campaignId: string): Promise<void> {
    const template = this.campaignTemplates.find(t => t.id === campaignId);
    if (!template) return;

    const countdown = this.getTrialCountdown(trial.invitationNumber);
    if (!countdown) return;

    // Personalize content
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

      // Mark campaign as sent
      trial.campaignsSent.push(campaignId);
      this.trials.set(trial.invitationNumber, trial);

      console.log(`📧 Campaign '${template.name}' sent to ${trial.invitationNumber} (${countdown.daysRemaining} days remaining)`);

    } catch (error) {
      console.error(`Failed to send campaign ${campaignId} to ${trial.invitationNumber}:`, error);
    }
  }

  /**
   * Personalize campaign content with user and trial data
   */
  private personalizeContent(content: any, trial: TrialUser, countdown: TrialCountdownData): any {
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
      '{PROPERTIES_COUNT}': Math.floor(Math.random() * 5) + 1, // Mock data
      '{BOOKINGS_COUNT}': Math.floor(Math.random() * 50) + 10, // Mock data
      '{INSIGHTS_COUNT}': Math.floor(Math.random() * 20) + 5, // Mock data
      '{TIME_SAVED}': Math.floor(Math.random() * 10) + 5 // Mock data
    };

    Object.keys(replacements).forEach(key => {
      personalizedContent.subject = personalizedContent.subject?.replace(new RegExp(key, 'g'), replacements[key]);
      personalizedContent.body = personalizedContent.body?.replace(new RegExp(key, 'g'), replacements[key]);
      personalizedContent.urgencyMessage = personalizedContent.urgencyMessage?.replace(new RegExp(key, 'g'), replacements[key]);
    });

    return personalizedContent;
  }

  /**
   * Calculate urgency level based on days remaining and user behavior
   */
  private calculateUrgencyLevel(daysRemaining: number, trial: TrialUser): 'low' | 'medium' | 'high' | 'critical' {
    const activityRecency = (Date.now() - trial.lastActivity.getTime()) / (24 * 60 * 60 * 1000); // days
    const featureUsage = trial.activatedFeatures.length;

    if (daysRemaining <= 1) return 'critical';
    if (daysRemaining <= 3) return 'high';
    if (daysRemaining <= 7 && (activityRecency > 2 || featureUsage < 3)) return 'high';
    if (daysRemaining <= 14) return 'medium';
    return 'low';
  }

  /**
   * Calculate default conversion goal based on business type and tier
   */
  private calculateDefaultConversionGoal(businessType: string, tier: string): number {
    const baseValues = {
      hotel: { founder: 5000, early_access: 3000, beta: 2000, standard: 1500 },
      real_estate: { founder: 4000, early_access: 2500, beta: 1800, standard: 1200 },
      company: { founder: 3000, early_access: 2000, beta: 1500, standard: 1000 }
    };

    return baseValues[businessType]?.[tier] || 1000;
  }

  /**
   * Get conversion metrics for analytics
   */
  async getConversionMetrics(): Promise<ConversionMetrics> {
    const trials = Array.from(this.trials.values());
    const now = new Date();

    const totalTrials = trials.length;
    const activeTrials = trials.filter(t => t.trialEndDate > now).length;
    const expiredTrials = trials.filter(t => t.trialEndDate <= now).length;
    const convertedTrials = trials.filter(t =>
      t.conversionEvents.some(e => e.event === 'converted')
    ).length;

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
      campaignEffectiveness: {} // Would calculate from actual campaign data
    };
  }

  // Private helper methods for sending notifications
  private async sendEmail(trial: TrialUser, content: any): Promise<void> {
    // Email sending implementation would go here
    console.log(`📧 Email sent to ${trial.email}: ${content.subject}`);
  }

  private async sendSMS(trial: TrialUser, content: any): Promise<void> {
    // SMS sending implementation would go here
    if (trial.phone) {
      console.log(`📱 SMS sent to ${trial.phone}: ${content.body.substring(0, 100)}...`);
    }
  }

  private async sendInAppNotification(trial: TrialUser, content: any): Promise<void> {
    // In-app notification implementation would go here
    console.log(`🔔 In-app notification for ${trial.invitationNumber}: ${content.subject}`);
  }

  private async sendPushNotification(trial: TrialUser, content: any): Promise<void> {
    // Push notification implementation would go here
    console.log(`📲 Push notification for ${trial.invitationNumber}: ${content.subject}`);
  }

  private async sendConversionConfirmation(trial: TrialUser, value: number): Promise<void> {
    // Send conversion confirmation
    console.log(`✅ Conversion confirmation sent to ${trial.email} for €${value}`);
  }

  private async sendDailyReminders(): Promise<void> {
    // Send daily reminder digest to admins
    const metrics = await this.getConversionMetrics();
    console.log(`📊 Daily trial metrics: ${metrics.activeTrials} active, ${metrics.conversionRate.toFixed(1)}% conversion rate`);
  }

  private async processTrialExpirations(): Promise<void> {
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

  private generateTrialId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

export default new TrialCountdownService();