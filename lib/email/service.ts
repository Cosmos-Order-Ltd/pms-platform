import { Reservation, Guest } from '@/types/pms'

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class EmailService {
  private static instance: EmailService
  private apiKey: string
  private baseUrl: string

  private constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || ''
    this.baseUrl = process.env.EMAIL_SERVICE_URL || 'https://api.emailservice.com/v1'
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendReservationConfirmation(reservation: any, guest: any): Promise<boolean> {
    const template = this.getReservationConfirmationTemplate(reservation, guest)
    return this.sendEmail(guest.email, template)
  }

  async sendReservationModification(reservation: any, guest: any): Promise<boolean> {
    const template = this.getReservationModificationTemplate(reservation, guest)
    return this.sendEmail(guest.email, template)
  }

  async sendCheckInReminder(reservation: any, guest: any): Promise<boolean> {
    const template = this.getCheckInReminderTemplate(reservation, guest)
    return this.sendEmail(guest.email, template)
  }

  async sendCheckOutInstructions(reservation: any, guest: any): Promise<boolean> {
    const template = this.getCheckOutInstructionsTemplate(reservation, guest)
    return this.sendEmail(guest.email, template)
  }

  async sendWelcomeEmail(guest: any): Promise<boolean> {
    const template = this.getWelcomeEmailTemplate(guest)
    return this.sendEmail(guest.email, template)
  }

  private async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      // In a real implementation, this would send via your email service
      // For demo purposes, we'll simulate the email sending
      console.log(`📧 Sending email to ${to}`)
      console.log(`Subject: ${template.subject}`)
      console.log(`Content: ${template.text}`)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100))

      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  private getReservationConfirmationTemplate(reservation: any, guest: any): EmailTemplate {
    const checkInDate = new Date(reservation.checkIn).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const checkOutDate = new Date(reservation.checkOut).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const subject = `Reservation Confirmed - Cyprus PMS (${reservation.id})`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reservation Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .reservation-details { background: #F3F4F6; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; }
          .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏨 Cyprus PMS</h1>
          <h2>Reservation Confirmed!</h2>
        </div>

        <div class="content">
          <p>Dear ${guest.firstName} ${guest.lastName},</p>

          <p>We're delighted to confirm your reservation. Here are your booking details:</p>

          <div class="reservation-details">
            <h3>📋 Reservation Details</h3>
            <p><strong>Confirmation Number:</strong> ${reservation.id}</p>
            <p><strong>Check-in:</strong> ${checkInDate}</p>
            <p><strong>Check-out:</strong> ${checkOutDate}</p>
            <p><strong>Room:</strong> ${reservation.roomType} - Room ${reservation.roomNumber || 'TBA'}</p>
            <p><strong>Guests:</strong> ${reservation.adults} Adult${reservation.adults > 1 ? 's' : ''}${reservation.children > 0 ? `, ${reservation.children} Child${reservation.children > 1 ? 'ren' : ''}` : ''}</p>
            <p><strong>Total Amount:</strong> €${reservation.totalAmount.toFixed(2)}</p>
          </div>

          <h3>🏨 Hotel Information</h3>
          <p><strong>Check-in Time:</strong> 15:00 (3:00 PM)</p>
          <p><strong>Check-out Time:</strong> 11:00 (11:00 AM)</p>
          <p><strong>Address:</strong> Cyprus PMS Hotel, Nicosia, Cyprus</p>
          <p><strong>Phone:</strong> +357 22 123456</p>

          ${reservation.specialRequests ? `
          <h3>📝 Special Requests</h3>
          <p>${reservation.specialRequests}</p>
          ` : ''}

          <h3>🇨🇾 Cyprus Travel Information</h3>
          <p>• Tourism Tax: €1.50 per person per night (payable at hotel)</p>
          <p>• Free WiFi available throughout the property</p>
          <p>• Airport transfer available upon request</p>

          <a href="#" class="button">Manage Your Booking</a>

          <p>If you have any questions or need to modify your reservation, please contact us:</p>
          <p>📧 Email: reservations@cyprus-pms.com</p>
          <p>📞 Phone: +357 22 123456</p>
        </div>

        <div class="footer">
          <p>Thank you for choosing Cyprus PMS!</p>
          <p>We look forward to welcoming you to Cyprus.</p>
        </div>
      </body>
      </html>
    `

    const text = `
Reservation Confirmed - Cyprus PMS

Dear ${guest.firstName} ${guest.lastName},

We're delighted to confirm your reservation. Here are your booking details:

RESERVATION DETAILS
Confirmation Number: ${reservation.id}
Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Room: ${reservation.roomType} - Room ${reservation.roomNumber || 'TBA'}
Guests: ${reservation.adults} Adult${reservation.adults > 1 ? 's' : ''}${reservation.children > 0 ? `, ${reservation.children} Child${reservation.children > 1 ? 'ren' : ''}` : ''}
Total Amount: €${reservation.totalAmount.toFixed(2)}

HOTEL INFORMATION
Check-in Time: 15:00 (3:00 PM)
Check-out Time: 11:00 (11:00 AM)
Address: Cyprus PMS Hotel, Nicosia, Cyprus
Phone: +357 22 123456

${reservation.specialRequests ? `SPECIAL REQUESTS\n${reservation.specialRequests}\n\n` : ''}

CYPRUS TRAVEL INFORMATION
• Tourism Tax: €1.50 per person per night (payable at hotel)
• Free WiFi available throughout the property
• Airport transfer available upon request

If you have any questions or need to modify your reservation, please contact us:
Email: reservations@cyprus-pms.com
Phone: +357 22 123456

Thank you for choosing Cyprus PMS!
We look forward to welcoming you to Cyprus.
    `

    return { subject, html, text }
  }

  private getReservationModificationTemplate(reservation: any, guest: any): EmailTemplate {
    const subject = `Reservation Updated - Cyprus PMS (${reservation.id})`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reservation Updated</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .reservation-details { background: #FEF3C7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏨 Cyprus PMS</h1>
          <h2>Reservation Updated</h2>
        </div>

        <div class="content">
          <p>Dear ${guest.firstName} ${guest.lastName},</p>

          <p>Your reservation has been successfully updated. Please review your new booking details:</p>

          <div class="reservation-details">
            <h3>📋 Updated Reservation Details</h3>
            <p><strong>Confirmation Number:</strong> ${reservation.id}</p>
            <p><strong>Check-in:</strong> ${new Date(reservation.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(reservation.checkOut).toLocaleDateString()}</p>
            <p><strong>Room:</strong> ${reservation.roomType}</p>
            <p><strong>Total Amount:</strong> €${reservation.totalAmount.toFixed(2)}</p>
          </div>

          <p>If you have any questions about these changes, please contact us immediately.</p>
        </div>

        <div class="footer">
          <p>Cyprus PMS - Your comfort is our priority</p>
        </div>
      </body>
      </html>
    `

    const text = `
Reservation Updated - Cyprus PMS

Dear ${guest.firstName} ${guest.lastName},

Your reservation has been successfully updated. Please review your new booking details:

UPDATED RESERVATION DETAILS
Confirmation Number: ${reservation.id}
Check-in: ${new Date(reservation.checkIn).toLocaleDateString()}
Check-out: ${new Date(reservation.checkOut).toLocaleDateString()}
Room: ${reservation.roomType}
Total Amount: €${reservation.totalAmount.toFixed(2)}

If you have any questions about these changes, please contact us immediately.

Contact: reservations@cyprus-pms.com | +357 22 123456
    `

    return { subject, html, text }
  }

  private getCheckInReminderTemplate(reservation: any, guest: any): EmailTemplate {
    const subject = `Check-in Reminder - Cyprus PMS (${reservation.id})`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Check-in Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .checkin-info { background: #D1FAE5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏨 Cyprus PMS</h1>
          <h2>Ready for Check-in!</h2>
        </div>

        <div class="content">
          <p>Dear ${guest.firstName} ${guest.lastName},</p>

          <p>We're excited to welcome you tomorrow! Your room is ready and we've prepared everything for your arrival.</p>

          <div class="checkin-info">
            <h3>✅ Check-in Information</h3>
            <p><strong>Check-in Date:</strong> ${new Date(reservation.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-in Time:</strong> From 15:00 (3:00 PM)</p>
            <p><strong>Room:</strong> ${reservation.roomType} - Room ${reservation.roomNumber}</p>
            <p><strong>Confirmation:</strong> ${reservation.id}</p>
          </div>

          <h3>📍 Getting Here</h3>
          <p><strong>Address:</strong> Cyprus PMS Hotel, Nicosia, Cyprus</p>
          <p><strong>From Airport:</strong> 45 minutes by taxi or rental car</p>
          <p><strong>Parking:</strong> Free on-site parking available</p>

          <p>Looking forward to hosting you!</p>
        </div>

        <div class="footer">
          <p>See you soon at Cyprus PMS!</p>
        </div>
      </body>
      </html>
    `

    const text = `
Check-in Reminder - Cyprus PMS

Dear ${guest.firstName} ${guest.lastName},

We're excited to welcome you tomorrow! Your room is ready and we've prepared everything for your arrival.

CHECK-IN INFORMATION
Check-in Date: ${new Date(reservation.checkIn).toLocaleDateString()}
Check-in Time: From 15:00 (3:00 PM)
Room: ${reservation.roomType} - Room ${reservation.roomNumber}
Confirmation: ${reservation.id}

GETTING HERE
Address: Cyprus PMS Hotel, Nicosia, Cyprus
From Airport: 45 minutes by taxi or rental car
Parking: Free on-site parking available

Looking forward to hosting you!

Contact: +357 22 123456
    `

    return { subject, html, text }
  }

  private getCheckOutInstructionsTemplate(reservation: any, guest: any): EmailTemplate {
    const subject = `Check-out Instructions - Cyprus PMS (${reservation.id})`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Check-out Instructions</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .checkout-info { background: #FEE2E2; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏨 Cyprus PMS</h1>
          <h2>Check-out Information</h2>
        </div>

        <div class="content">
          <p>Dear ${guest.firstName} ${guest.lastName},</p>

          <p>We hope you've enjoyed your stay with us! Here's everything you need to know about check-out:</p>

          <div class="checkout-info">
            <h3>🚪 Check-out Details</h3>
            <p><strong>Check-out Date:</strong> ${new Date(reservation.checkOut).toLocaleDateString()}</p>
            <p><strong>Check-out Time:</strong> By 11:00 AM</p>
            <p><strong>Room:</strong> ${reservation.roomNumber}</p>
            <p><strong>Express Check-out:</strong> Available via TV or front desk</p>
          </div>

          <h3>📋 Before You Leave</h3>
          <p>• Please ensure all personal items are packed</p>
          <p>• Return room keys to reception</p>
          <p>• Settle any outstanding charges</p>
          <p>• Rate your stay (we value your feedback!)</p>

          <p>Thank you for choosing Cyprus PMS. We hope to welcome you back soon!</p>
        </div>

        <div class="footer">
          <p>Safe travels from all of us at Cyprus PMS!</p>
        </div>
      </body>
      </html>
    `

    const text = `
Check-out Instructions - Cyprus PMS

Dear ${guest.firstName} ${guest.lastName},

We hope you've enjoyed your stay with us! Here's everything you need to know about check-out:

CHECK-OUT DETAILS
Check-out Date: ${new Date(reservation.checkOut).toLocaleDateString()}
Check-out Time: By 11:00 AM
Room: ${reservation.roomNumber}
Express Check-out: Available via TV or front desk

BEFORE YOU LEAVE
• Please ensure all personal items are packed
• Return room keys to reception
• Settle any outstanding charges
• Rate your stay (we value your feedback!)

Thank you for choosing Cyprus PMS. We hope to welcome you back soon!

Safe travels from all of us at Cyprus PMS!
    `

    return { subject, html, text }
  }

  private getWelcomeEmailTemplate(guest: any): EmailTemplate {
    const subject = `Welcome to Cyprus PMS - ${guest.firstName}!`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Cyprus PMS</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .welcome-info { background: #EDE9FE; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏨 Cyprus PMS</h1>
          <h2>Welcome to Our Family!</h2>
        </div>

        <div class="content">
          <p>Dear ${guest.firstName} ${guest.lastName},</p>

          <p>Welcome to Cyprus PMS! We're thrilled to have you as our guest and part of our hospitality family.</p>

          <div class="welcome-info">
            <h3>🎉 Your Guest Benefits</h3>
            <p>• Priority room selection</p>
            <p>• Complimentary WiFi throughout the property</p>
            <p>• 24/7 concierge service</p>
            <p>• Access to our loyalty program</p>
            <p>• Special rates for future bookings</p>
          </div>

          <h3>🇨🇾 Discover Cyprus</h3>
          <p>Our concierge team is here to help you explore the beautiful island of Cyprus. From ancient ruins to pristine beaches, we'll help you create unforgettable memories.</p>

          <p>Ready to book your stay? Contact us anytime!</p>
        </div>

        <div class="footer">
          <p>Welcome to Cyprus PMS - Where every stay is special!</p>
        </div>
      </body>
      </html>
    `

    const text = `
Welcome to Cyprus PMS!

Dear ${guest.firstName} ${guest.lastName},

Welcome to Cyprus PMS! We're thrilled to have you as our guest and part of our hospitality family.

YOUR GUEST BENEFITS
• Priority room selection
• Complimentary WiFi throughout the property
• 24/7 concierge service
• Access to our loyalty program
• Special rates for future bookings

DISCOVER CYPRUS
Our concierge team is here to help you explore the beautiful island of Cyprus. From ancient ruins to pristine beaches, we'll help you create unforgettable memories.

Ready to book your stay? Contact us anytime!

Contact: reservations@cyprus-pms.com | +357 22 123456

Welcome to Cyprus PMS - Where every stay is special!
    `

    return { subject, html, text }
  }
}