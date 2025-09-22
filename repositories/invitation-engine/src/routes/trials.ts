/**
 * Cyprus Access Control (CAC) - Trial Management Routes
 * Trial countdown, urgency campaigns, and conversion tracking
 */

import { Router, Request, Response } from 'express';
import trialCountdownService from '../services/trialCountdown';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for trial operations
const trialRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 requests per window
  message: { error: 'Too many trial requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(trialRateLimit);

/**
 * Start a new trial for a user
 * POST /api/trials/start
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    const {
      invitationNumber,
      email,
      phone,
      companyName,
      businessType,
      tier,
      trialDays,
      conversionGoal
    } = req.body;

    if (!invitationNumber || !email || !companyName || !businessType || !tier) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: invitationNumber, email, companyName, businessType, tier'
      });
    }

    const trial = await trialCountdownService.startTrial(invitationNumber, {
      email,
      phone,
      companyName,
      businessType,
      tier,
      trialDays: trialDays || 30,
      conversionGoal
    });

    res.json({
      success: true,
      trial: {
        id: trial.id,
        invitationNumber: trial.invitationNumber,
        companyName: trial.companyName,
        businessType: trial.businessType,
        tier: trial.tier,
        trialStartDate: trial.trialStartDate,
        trialEndDate: trial.trialEndDate,
        trialDays: trial.trialDays,
        conversionGoal: trial.conversionGoal
      },
      message: 'Trial started successfully. Welcome campaign sent.'
    });

  } catch (error) {
    console.error('Trial start error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start trial'
    });
  }
});

/**
 * Get trial countdown for a specific invitation
 * GET /api/trials/countdown/:invitationNumber
 */
router.get('/countdown/:invitationNumber', async (req: Request, res: Response) => {
  try {
    const { invitationNumber } = req.params;

    const countdown = trialCountdownService.getTrialCountdown(invitationNumber);

    if (!countdown) {
      return res.status(404).json({
        success: false,
        error: 'Trial not found'
      });
    }

    res.json({
      success: true,
      invitationNumber,
      countdown
    });

  } catch (error) {
    console.error('Trial countdown error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trial countdown'
    });
  }
});

/**
 * Update user activity during trial
 * POST /api/trials/activity/:invitationNumber
 */
router.post('/activity/:invitationNumber', async (req: Request, res: Response) => {
  try {
    const { invitationNumber } = req.params;
    const { feature, event, value } = req.body;

    if (!event) {
      return res.status(400).json({
        success: false,
        error: 'Event is required'
      });
    }

    await trialCountdownService.updateActivity(invitationNumber, {
      feature,
      event,
      value
    });

    res.json({
      success: true,
      message: 'Activity updated successfully'
    });

  } catch (error) {
    console.error('Activity update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update activity'
    });
  }
});

/**
 * Process trial conversion
 * POST /api/trials/convert/:invitationNumber
 */
router.post('/convert/:invitationNumber', async (req: Request, res: Response) => {
  try {
    const { invitationNumber } = req.params;
    const { subscriptionValue, planType } = req.body;

    if (!subscriptionValue) {
      return res.status(400).json({
        success: false,
        error: 'Subscription value is required'
      });
    }

    const success = await trialCountdownService.convertTrial(invitationNumber, subscriptionValue);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Trial not found'
      });
    }

    res.json({
      success: true,
      message: 'Trial converted successfully',
      conversion: {
        invitationNumber,
        subscriptionValue,
        planType,
        convertedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Trial conversion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process conversion'
    });
  }
});

/**
 * Get conversion metrics and analytics
 * GET /api/trials/metrics
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await trialCountdownService.getConversionMetrics();

    res.json({
      success: true,
      metrics
    });

  } catch (error) {
    console.error('Trial metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trial metrics'
    });
  }
});

/**
 * Trial countdown widget for embedding in applications
 * GET /api/trials/widget/:invitationNumber
 */
router.get('/widget/:invitationNumber', async (req: Request, res: Response) => {
  try {
    const { invitationNumber } = req.params;
    const { theme = 'light' } = req.query;

    const countdown = trialCountdownService.getTrialCountdown(invitationNumber);

    if (!countdown) {
      return res.status(404).send(`
        <div style="padding: 20px; text-align: center; color: #666;">
          Trial not found
        </div>
      `);
    }

    const widgetHTML = generateCountdownWidget(invitationNumber, countdown, theme as string);

    res.setHeader('Content-Type', 'text/html');
    res.send(widgetHTML);

  } catch (error) {
    console.error('Trial widget error:', error);
    res.status(500).send(`
      <div style="padding: 20px; text-align: center; color: #e74c3c;">
        Widget error
      </div>
    `);
  }
});

/**
 * Generate countdown widget HTML
 */
function generateCountdownWidget(invitationNumber: string, countdown: any, theme: string): string {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#2c3e50' : '#ffffff';
  const textColor = isDark ? '#ecf0f1' : '#2c3e50';
  const urgencyColor = getUrgencyColor(countdown.urgencyLevel);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trial Countdown</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: ${bgColor};
            color: ${textColor};
            padding: 20px;
          }
          .countdown-widget {
            max-width: 400px;
            margin: 0 auto;
            background: ${bgColor};
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 2px solid ${urgencyColor};
          }
          .widget-header {
            background: linear-gradient(135deg, ${urgencyColor}, ${urgencyColor}dd);
            padding: 20px;
            text-align: center;
            color: white;
          }
          .widget-header h2 {
            font-size: 1.2em;
            margin-bottom: 5px;
          }
          .widget-header .subtitle {
            opacity: 0.9;
            font-size: 0.9em;
          }
          .countdown-display {
            padding: 30px 20px;
            text-align: center;
          }
          .time-blocks {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          .time-block {
            text-align: center;
            min-width: 60px;
          }
          .time-number {
            font-size: 2em;
            font-weight: bold;
            color: ${urgencyColor};
            display: block;
            line-height: 1;
          }
          .time-label {
            font-size: 0.8em;
            color: ${textColor}99;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px;
          }
          .urgency-message {
            background: ${urgencyColor}15;
            padding: 15px;
            border-radius: 8px;
            margin: 20px;
            text-align: center;
            border-left: 4px solid ${urgencyColor};
          }
          .urgency-message strong {
            color: ${urgencyColor};
          }
          .cta-section {
            padding: 20px;
            text-align: center;
            background: ${isDark ? '#34495e' : '#f8f9fa'};
          }
          .cta-button {
            background: ${urgencyColor};
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 6px;
            font-size: 1em;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px ${urgencyColor}40;
          }
          .pulse {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        </style>
      </head>
      <body>
        <div class="countdown-widget">
          <div class="widget-header">
            <h2>🎯 Your Cyprus PMS Trial</h2>
            <div class="subtitle">Time remaining in your free trial</div>
          </div>

          <div class="countdown-display">
            <div class="time-blocks">
              <div class="time-block">
                <span class="time-number" id="days">${countdown.daysRemaining}</span>
                <div class="time-label">Days</div>
              </div>
              <div class="time-block">
                <span class="time-number" id="hours">${countdown.hoursRemaining}</span>
                <div class="time-label">Hours</div>
              </div>
              <div class="time-block">
                <span class="time-number" id="minutes">${countdown.minutesRemaining}</span>
                <div class="time-label">Minutes</div>
              </div>
            </div>

            ${getUrgencyMessage(countdown.urgencyLevel, countdown.daysRemaining)}
          </div>

          <div class="cta-section">
            <a href="/upgrade?invitation=${invitationNumber}" class="cta-button ${countdown.urgencyLevel === 'critical' ? 'pulse' : ''}">
              ${getCtaText(countdown.urgencyLevel)}
            </a>
          </div>
        </div>

        <script>
          function updateCountdown() {
            const timeRemaining = ${countdown.timeRemaining};
            const targetTime = Date.now() + (timeRemaining * 1000);

            setInterval(() => {
              const now = Date.now();
              const remaining = Math.max(0, targetTime - now);

              const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
              const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
              const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

              document.getElementById('days').textContent = days;
              document.getElementById('hours').textContent = hours;
              document.getElementById('minutes').textContent = minutes;

              if (remaining <= 0) {
                document.querySelector('.countdown-widget').innerHTML =
                  '<div style="padding: 40px; text-align: center;"><h2>Trial Expired</h2><p>Contact us to reactivate your access.</p></div>';
              }
            }, 60000); // Update every minute
          }

          updateCountdown();
        </script>
      </body>
    </html>
  `;
}

function getUrgencyColor(urgencyLevel: string): string {
  const colors = {
    low: '#3498db',
    medium: '#f39c12',
    high: '#e67e22',
    critical: '#e74c3c'
  };
  return colors[urgencyLevel] || colors.low;
}

function getUrgencyMessage(urgencyLevel: string, daysRemaining: number): string {
  const messages = {
    low: `<div class="urgency-message">
      <strong>Explore More Features!</strong><br>
      You have plenty of time to discover all Cyprus PMS capabilities.
    </div>`,
    medium: `<div class="urgency-message">
      <strong>Don't Miss Out!</strong><br>
      Your trial is halfway through. Make sure to explore all features before it expires.
    </div>`,
    high: `<div class="urgency-message">
      <strong>Time Running Out!</strong><br>
      Only ${daysRemaining} days left to experience the full power of Cyprus PMS.
    </div>`,
    critical: `<div class="urgency-message">
      <strong>🚨 URGENT: Trial Expiring Soon!</strong><br>
      Less than 24 hours remaining! Secure your access now to avoid losing your data and settings.
    </div>`
  };
  return messages[urgencyLevel] || messages.low;
}

function getCtaText(urgencyLevel: string): string {
  const ctas = {
    low: 'Learn About Upgrade Options',
    medium: 'View Pricing Plans',
    high: 'Upgrade Now - Limited Time',
    critical: 'URGENT: Secure Access Now'
  };
  return ctas[urgencyLevel] || ctas.low;
}

export default router;