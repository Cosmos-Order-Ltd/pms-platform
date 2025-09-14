import { EmailService } from './service'

interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  nationality?: string
  isNewGuest: boolean
  preferences?: GuestPreferences
  loyaltyTier?: string
}

interface GuestPreferences {
  bedType?: string
  floor?: string
  view?: string
  accessibility?: boolean
  quietRoom?: boolean
  smokingRoom?: boolean
}

interface Reservation {
  id: string
  guestId: string
  checkIn: string
  checkOut: string
  roomNumber?: string
  roomType: string
  adults: number
  children: number
  totalAmount: number
  specialRequests?: string
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  datesChanged?: boolean
}

interface _EmailSchedule {
  id: string
  type: 'pre_arrival' | 'checkout_reminder' | 'post_stay_feedback' | 'loyalty_points'
  reservationId: string
  guestId: string
  scheduledFor: string
  sent: boolean
}

interface _AutomationRule {
  id: string
  name: string
  trigger: 'reservation_created' | 'reservation_modified' | 'check_in' | 'check_out'
  conditions?: Record<string, unknown>
  actions: AutomationAction[]
  isActive: boolean
}

interface AutomationAction {
  type: 'send_email' | 'schedule_email' | 'update_guest' | 'create_task'
  config: Record<string, unknown>
  delay?: number
}

export class EmailAutomation {
  private emailService: EmailService

  constructor() {
    this.emailService = EmailService.getInstance()
  }

  async handleReservationCreated(reservation: Reservation, guest: Guest): Promise<void> {
    try {
      // Send confirmation email immediately
      await this.emailService.sendReservationConfirmation(reservation, guest)

      // Schedule welcome email for new guests
      if (guest.isNewGuest) {
        await this.emailService.sendWelcomeEmail(guest)
      }

      // Schedule pre-arrival reminder (24 hours before check-in)
      this.schedulePreArrivalReminder(reservation, guest)

      console.log(`✅ Email automation triggered for reservation ${reservation.id}`)
    } catch (error) {
      console.error(`❌ Email automation failed for reservation ${reservation.id}:`, error)
    }
  }

  async handleReservationModified(reservation: Reservation, guest: Guest): Promise<void> {
    try {
      // Send modification confirmation
      await this.emailService.sendReservationModification(reservation, guest)

      // Reschedule pre-arrival reminder if dates changed
      if (reservation.datesChanged) {
        this.schedulePreArrivalReminder(reservation, guest)
      }

      console.log(`✅ Modification email sent for reservation ${reservation.id}`)
    } catch (error) {
      console.error(`❌ Modification email failed for reservation ${reservation.id}:`, error)
    }
  }

  async handleCheckIn(reservation: Reservation, guest: Guest): Promise<void> {
    try {
      // Schedule check-out instructions for day before checkout
      this.scheduleCheckOutReminder(reservation, guest)

      console.log(`✅ Check-in automation triggered for reservation ${reservation.id}`)
    } catch (error) {
      console.error(`❌ Check-in automation failed for reservation ${reservation.id}:`, error)
    }
  }

  async handleCheckOut(reservation: Reservation, guest: Guest): Promise<void> {
    try {
      // Send thank you email and request feedback
      await this.sendThankYouEmail(reservation, guest)

      console.log(`✅ Check-out automation completed for reservation ${reservation.id}`)
    } catch (error) {
      console.error(`❌ Check-out automation failed for reservation ${reservation.id}:`, error)
    }
  }

  private schedulePreArrivalReminder(reservation: Reservation, guest: Guest): void {
    const checkInDate = new Date(reservation.checkIn)
    const reminderDate = new Date(checkInDate.getTime() - 24 * 60 * 60 * 1000) // 24 hours before

    if (reminderDate > new Date()) {
      // In a real implementation, you would schedule this with a job queue
      console.log(`📅 Pre-arrival reminder scheduled for ${reminderDate.toISOString()}`)

      // Simulate scheduling
      setTimeout(async () => {
        await this.emailService.sendCheckInReminder(reservation, guest)
        console.log(`📧 Pre-arrival reminder sent for reservation ${reservation.id}`)
      }, Math.max(0, reminderDate.getTime() - Date.now()))
    }
  }

  private scheduleCheckOutReminder(reservation: Reservation, guest: Guest): void {
    const checkOutDate = new Date(reservation.checkOut)
    const reminderDate = new Date(checkOutDate.getTime() - 24 * 60 * 60 * 1000) // 24 hours before

    if (reminderDate > new Date()) {
      // In a real implementation, you would schedule this with a job queue
      console.log(`📅 Check-out reminder scheduled for ${reminderDate.toISOString()}`)

      // Simulate scheduling
      setTimeout(async () => {
        await this.emailService.sendCheckOutInstructions(reservation, guest)
        console.log(`📧 Check-out instructions sent for reservation ${reservation.id}`)
      }, Math.max(0, reminderDate.getTime() - Date.now()))
    }
  }

  private async sendThankYouEmail(reservation: Reservation, guest: Guest): Promise<void> {
    const template = {
      subject: `Thank you for staying with Cyprus PMS - ${guest.firstName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Thank You</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #10B981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .feedback-section { background: #D1FAE5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; }
            .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏨 Cyprus PMS</h1>
            <h2>Thank You for Your Stay!</h2>
          </div>

          <div class="content">
            <p>Dear ${guest.firstName} ${guest.lastName},</p>

            <p>Thank you for choosing Cyprus PMS for your recent stay. We hope you had a wonderful experience and enjoyed exploring beautiful Cyprus!</p>

            <div class="feedback-section">
              <h3>📝 Share Your Experience</h3>
              <p>Your feedback helps us improve and provide better service for future guests. We'd love to hear about your stay!</p>
              <a href="#" class="button">Leave a Review</a>
            </div>

            <h3>🎁 Special Offers</h3>
            <p>As a valued guest, you're eligible for:</p>
            <ul>
              <li>10% discount on your next stay</li>
              <li>Complimentary room upgrade (subject to availability)</li>
              <li>Late check-out at no extra charge</li>
            </ul>

            <p>We look forward to welcoming you back to Cyprus PMS soon!</p>

            <p>Warm regards,<br>The Cyprus PMS Team</p>
          </div>

          <div class="footer">
            <p>Cyprus PMS - Thank you for making us your home in Cyprus!</p>
          </div>
        </body>
        </html>
      `,
      text: `
Thank You for Your Stay - Cyprus PMS

Dear ${guest.firstName} ${guest.lastName},

Thank you for choosing Cyprus PMS for your recent stay. We hope you had a wonderful experience and enjoyed exploring beautiful Cyprus!

SHARE YOUR EXPERIENCE
Your feedback helps us improve and provide better service for future guests. We'd love to hear about your stay!

SPECIAL OFFERS
As a valued guest, you're eligible for:
• 10% discount on your next stay
• Complimentary room upgrade (subject to availability)
• Late check-out at no extra charge

We look forward to welcoming you back to Cyprus PMS soon!

Contact us: reservations@cyprus-pms.com | +357 22 123456

Warm regards,
The Cyprus PMS Team
      `
    }

    await this.emailService['sendEmail'](guest.email, template)
  }

  // Bulk operations for marketing and operational emails
  async sendBulkEmails(guests: Guest[], template: 'newsletter' | 'promotion' | 'survey'): Promise<number> {
    let successCount = 0

    for (const guest of guests) {
      try {
        let emailTemplate

        switch (template) {
          case 'newsletter':
            emailTemplate = this.getNewsletterTemplate(guest)
            break
          case 'promotion':
            emailTemplate = this.getPromotionTemplate(guest)
            break
          case 'survey':
            emailTemplate = this.getSurveyTemplate(guest)
            break
          default:
            continue
        }

        const success = await this.emailService['sendEmail'](guest.email, emailTemplate)
        if (success) successCount++

      } catch (error) {
        console.error(`Failed to send ${template} email to ${guest.email}:`, error)
      }
    }

    console.log(`📧 Bulk ${template} emails: ${successCount}/${guests.length} sent successfully`)
    return successCount
  }

  private getNewsletterTemplate(guest: Guest) {
    return {
      subject: "Cyprus PMS Monthly Newsletter - Discover What's New!",
      html: `
        <h1>🏨 Cyprus PMS Newsletter</h1>
        <p>Dear ${guest.firstName},</p>
        <p>Welcome to our monthly newsletter with the latest updates from Cyprus PMS!</p>
        <h2>🌟 This Month's Highlights</h2>
        <ul>
          <li>New spa services now available</li>
          <li>Seasonal dining menu featuring local Cyprus cuisine</li>
          <li>Exclusive partnerships with local tour operators</li>
        </ul>
      `,
      text: `Cyprus PMS Newsletter - Discover What's New!`
    }
  }

  private getPromotionTemplate(guest: Guest) {
    return {
      subject: "🎉 Special Offer Just for You - 20% Off Your Next Stay!",
      html: `
        <h1>🏨 Exclusive Offer from Cyprus PMS</h1>
        <p>Dear ${guest.firstName},</p>
        <p>We have a special 20% discount waiting for you!</p>
        <p>Book now and save on your next Cyprus getaway.</p>
      `,
      text: `Special 20% discount offer from Cyprus PMS!`
    }
  }

  private getSurveyTemplate(guest: Guest) {
    return {
      subject: "📝 Help Us Improve - Quick 2-Minute Survey",
      html: `
        <h1>🏨 We Value Your Opinion</h1>
        <p>Dear ${guest.firstName},</p>
        <p>Help us improve our services by taking our quick 2-minute survey.</p>
        <p>Your feedback is important to us!</p>
      `,
      text: `Help us improve - quick 2-minute survey from Cyprus PMS`
    }
  }
}

// Utility functions for common email automation scenarios
export const emailAutomation = new EmailAutomation()

export async function triggerReservationEmails(reservation: Reservation, guest: Guest, action: 'created' | 'modified' | 'checkin' | 'checkout') {
  switch (action) {
    case 'created':
      await emailAutomation.handleReservationCreated(reservation, guest)
      break
    case 'modified':
      await emailAutomation.handleReservationModified(reservation, guest)
      break
    case 'checkin':
      await emailAutomation.handleCheckIn(reservation, guest)
      break
    case 'checkout':
      await emailAutomation.handleCheckOut(reservation, guest)
      break
  }
}

export async function scheduleEmailReminders() {
  // This would typically be called by a cron job or task scheduler
  console.log('📅 Email reminder scheduler started')

  // In a real implementation, you would:
  // 1. Query database for reservations needing reminders
  // 2. Send pre-arrival reminders (24h before check-in)
  // 3. Send check-out instructions (24h before check-out)
  // 4. Send follow-up surveys (24h after check-out)
}