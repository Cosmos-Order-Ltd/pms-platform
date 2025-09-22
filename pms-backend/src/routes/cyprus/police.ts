import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Cyprus Police Registration Configuration
const POLICE_API_CONFIG = {
  baseUrl: process.env.CYPRUS_POLICE_API || 'https://police.gov.cy/api',
  apiKey: process.env.CYPRUS_POLICE_API_KEY,
  timeout: 30000,
  maxRetries: 3
};

// Validation schemas
const registerGuestSchema = z.object({
  reservationId: z.string().cuid(),
  guestId: z.string().cuid(),
  passportNumber: z.string().min(1),
  nationality: z.string().min(2).max(3), // ISO country code
  arrivalDate: z.string().datetime(),
  departureDate: z.string().datetime(),
  roomNumber: z.string().min(1)
});

const bulkRegisterSchema = z.object({
  registrations: z.array(registerGuestSchema).min(1).max(50)
});

const updateRegistrationSchema = z.object({
  registrationId: z.string().cuid(),
  departureDate: z.string().datetime().optional(),
  roomNumber: z.string().optional()
});

// Police Registration Service
class CyprusPoliceService {
  /**
   * Submit guest registration to Cyprus Police system
   */
  static async submitRegistration(registrationData: any): Promise<{
    success: boolean;
    referenceNumber?: string;
    confirmationCode?: string;
    errorMessage?: string;
  }> {
    try {
      // Format data for police API
      const policeApiData = {
        property_license: registrationData.propertyLicense,
        guest: {
          passport_number: registrationData.passportNumber,
          nationality: registrationData.nationality,
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          date_of_birth: registrationData.dateOfBirth
        },
        accommodation: {
          arrival_date: registrationData.arrivalDate,
          departure_date: registrationData.departureDate,
          room_number: registrationData.roomNumber,
          address: registrationData.propertyAddress
        }
      };

      // In production, make actual API call to police system
      const response = await this.makePoliceApiCall('/register-guest', policeApiData);

      if (response.success) {
        return {
          success: true,
          referenceNumber: response.reference_number,
          confirmationCode: response.confirmation_code
        };
      } else {
        return {
          success: false,
          errorMessage: response.error_message || 'Registration failed'
        };
      }

    } catch (error) {
      console.error('Police Registration API Error:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'API communication failed'
      };
    }
  }

  /**
   * Update existing guest registration
   */
  static async updateRegistration(registrationId: string, updateData: any): Promise<{
    success: boolean;
    confirmationCode?: string;
    errorMessage?: string;
  }> {
    try {
      const response = await this.makePoliceApiCall('/update-registration', {
        registration_id: registrationId,
        ...updateData
      });

      return {
        success: response.success,
        confirmationCode: response.confirmation_code,
        errorMessage: response.error_message
      };

    } catch (error) {
      console.error('Police Update API Error:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Update failed'
      };
    }
  }

  /**
   * Cancel guest registration
   */
  static async cancelRegistration(registrationId: string): Promise<{
    success: boolean;
    errorMessage?: string;
  }> {
    try {
      const response = await this.makePoliceApiCall('/cancel-registration', {
        registration_id: registrationId
      });

      return {
        success: response.success,
        errorMessage: response.error_message
      };

    } catch (error) {
      console.error('Police Cancel API Error:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Cancellation failed'
      };
    }
  }

  /**
   * Make API call to Cyprus Police system (mock implementation)
   */
  private static async makePoliceApiCall(endpoint: string, data: any): Promise<any> {
    // Mock implementation - in production, replace with actual API calls
    console.log(`Police API Call: ${endpoint}`, data);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (success) {
      return {
        success: true,
        reference_number: `CY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        confirmation_code: Math.random().toString(36).substr(2, 10).toUpperCase(),
        status: 'CONFIRMED'
      };
    } else {
      return {
        success: false,
        error_message: 'Invalid passport number or system temporarily unavailable'
      };
    }
  }

  /**
   * Validate if guest registration is required
   */
  static isRegistrationRequired(guest: any, reservation: any): boolean {
    // All non-Cyprus residents must be registered
    if (!guest.cyprusResident) {
      return true;
    }

    // Cyprus residents staying more than 3 days might need registration
    const stayDuration = Math.ceil(
      (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    return stayDuration > 3;
  }

  /**
   * Check if registration deadline is approaching
   */
  static isRegistrationOverdue(arrivalDate: Date): boolean {
    const now = new Date();
    const deadline = new Date(arrivalDate);
    deadline.setHours(deadline.getHours() + 24); // 24-hour deadline

    return now > deadline;
  }
}

// Routes

/**
 * @route POST /api/v1/cyprus/police/register
 * @desc Register a guest with Cyprus Police
 * @access Private
 */
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerGuestSchema.parse(req.body);

    // Get reservation with guest and property details
    const reservation = await prisma.reservation.findUnique({
      where: { id: validatedData.reservationId },
      include: {
        guest: true,
        property: {
          select: {
            name: true,
            address: true,
            cyprusTourismLicense: true,
            policeStationId: true
          }
        }
      }
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if registration already exists
    const existingRegistration = await prisma.policeRegistration.findUnique({
      where: {
        guestId_reservationId: {
          guestId: validatedData.guestId,
          reservationId: validatedData.reservationId
        }
      }
    });

    if (existingRegistration && existingRegistration.status !== 'FAILED') {
      return res.status(409).json({
        success: false,
        message: 'Guest registration already exists for this reservation'
      });
    }

    // Check if registration is required
    if (!CyprusPoliceService.isRegistrationRequired(reservation.guest, reservation)) {
      return res.status(400).json({
        success: false,
        message: 'Registration not required for Cyprus residents with short stays'
      });
    }

    // Submit to police system
    const submissionResult = await CyprusPoliceService.submitRegistration({
      propertyLicense: reservation.property.cyprusTourismLicense,
      propertyAddress: reservation.property.address,
      passportNumber: validatedData.passportNumber,
      nationality: validatedData.nationality,
      firstName: reservation.guest.firstName,
      lastName: reservation.guest.lastName,
      dateOfBirth: reservation.guest.dateOfBirth,
      arrivalDate: validatedData.arrivalDate,
      departureDate: validatedData.departureDate,
      roomNumber: validatedData.roomNumber
    });

    // Create or update police registration record
    const policeRegistration = await prisma.policeRegistration.upsert({
      where: {
        guestId_reservationId: {
          guestId: validatedData.guestId,
          reservationId: validatedData.reservationId
        }
      },
      update: {
        passportNumber: validatedData.passportNumber,
        nationality: validatedData.nationality,
        arrivalDate: new Date(validatedData.arrivalDate),
        departureDate: new Date(validatedData.departureDate),
        roomNumber: validatedData.roomNumber,
        submissionDate: submissionResult.success ? new Date() : null,
        referenceNumber: submissionResult.referenceNumber,
        confirmationCode: submissionResult.confirmationCode,
        status: submissionResult.success ? 'CONFIRMED' : 'FAILED',
        submittedBy: req.user?.id,
        errorMessage: submissionResult.errorMessage
      },
      create: {
        propertyId: reservation.propertyId,
        guestId: validatedData.guestId,
        reservationId: validatedData.reservationId,
        passportNumber: validatedData.passportNumber,
        nationality: validatedData.nationality,
        arrivalDate: new Date(validatedData.arrivalDate),
        departureDate: new Date(validatedData.departureDate),
        roomNumber: validatedData.roomNumber,
        submissionDate: submissionResult.success ? new Date() : null,
        referenceNumber: submissionResult.referenceNumber,
        confirmationCode: submissionResult.confirmationCode,
        status: submissionResult.success ? 'CONFIRMED' : 'FAILED',
        submittedBy: req.user?.id,
        errorMessage: submissionResult.errorMessage
      }
    });

    // Update reservation police reporting status
    if (submissionResult.success) {
      await prisma.reservation.update({
        where: { id: validatedData.reservationId },
        data: { policeReported: true }
      });
    }

    res.json({
      success: true,
      data: {
        registration: policeRegistration,
        policeResponse: {
          referenceNumber: submissionResult.referenceNumber,
          confirmationCode: submissionResult.confirmationCode,
          status: submissionResult.success ? 'CONFIRMED' : 'FAILED'
        }
      }
    });

  } catch (error) {
    console.error('Police Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/police/bulk-register
 * @desc Register multiple guests with Cyprus Police
 * @access Private
 */
router.post('/bulk-register', async (req, res) => {
  try {
    const validatedData = bulkRegisterSchema.parse(req.body);
    const results = [];

    for (const registration of validatedData.registrations) {
      try {
        // Process each registration individually
        const result = await router.handle({
          method: 'POST',
          url: '/register',
          body: registration,
          user: req.user
        } as any, res);

        results.push({
          reservationId: registration.reservationId,
          success: true,
          data: result
        });

      } catch (error) {
        results.push({
          reservationId: registration.reservationId,
          success: false,
          error: error instanceof Error ? error.message : 'Registration failed'
        });
      }
    }

    res.json({
      success: true,
      data: {
        total: validatedData.registrations.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }
    });

  } catch (error) {
    console.error('Bulk Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk registration failed'
    });
  }
});

/**
 * @route PUT /api/v1/cyprus/police/registrations/:id
 * @desc Update a police registration
 * @access Private
 */
router.put('/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateRegistrationSchema.parse(req.body);

    const registration = await prisma.policeRegistration.findUnique({
      where: { id: validatedData.registrationId }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Police registration not found'
      });
    }

    if (registration.status !== 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed registrations can be updated'
      });
    }

    // Submit update to police system
    const updateResult = await CyprusPoliceService.updateRegistration(
      registration.referenceNumber || '',
      {
        departure_date: validatedData.departureDate,
        room_number: validatedData.roomNumber
      }
    );

    // Update local record
    const updatedData: any = {};
    if (validatedData.departureDate) {
      updatedData.departureDate = new Date(validatedData.departureDate);
    }
    if (validatedData.roomNumber) {
      updatedData.roomNumber = validatedData.roomNumber;
    }

    if (updateResult.success) {
      updatedData.confirmationCode = updateResult.confirmationCode;
    } else {
      updatedData.errorMessage = updateResult.errorMessage;
      updatedData.status = 'FAILED';
    }

    const updatedRegistration = await prisma.policeRegistration.update({
      where: { id },
      data: updatedData
    });

    res.json({
      success: true,
      data: {
        registration: updatedRegistration,
        updateStatus: updateResult.success ? 'SUCCESS' : 'FAILED'
      }
    });

  } catch (error) {
    console.error('Police Registration Update Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Update failed'
    });
  }
});

/**
 * @route DELETE /api/v1/cyprus/police/registrations/:id
 * @desc Cancel a police registration
 * @access Private
 */
router.delete('/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await prisma.policeRegistration.findUnique({
      where: { id },
      include: { reservation: true }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Police registration not found'
      });
    }

    if (!['CONFIRMED', 'FAILED'].includes(registration.status)) {
      return res.status(400).json({
        success: false,
        message: 'Registration cannot be cancelled in current status'
      });
    }

    // Cancel with police system if it was confirmed
    if (registration.status === 'CONFIRMED') {
      const cancelResult = await CyprusPoliceService.cancelRegistration(
        registration.referenceNumber || ''
      );

      if (!cancelResult.success) {
        return res.status(500).json({
          success: false,
          message: `Failed to cancel with police system: ${cancelResult.errorMessage}`
        });
      }
    }

    // Delete local record
    await prisma.policeRegistration.delete({
      where: { id }
    });

    // Update reservation status
    await prisma.reservation.update({
      where: { id: registration.reservationId },
      data: { policeReported: false }
    });

    res.json({
      success: true,
      message: 'Police registration cancelled successfully'
    });

  } catch (error) {
    console.error('Police Registration Cancellation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Cancellation failed'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/police/registrations
 * @desc Get police registrations with filtering
 * @access Private
 */
router.get('/registrations', async (req, res) => {
  try {
    const {
      propertyId,
      status,
      nationality,
      startDate,
      endDate,
      overdue,
      page = 1,
      limit = 20
    } = req.query;

    const where: any = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (status) {
      where.status = status;
    }

    if (nationality) {
      where.nationality = nationality;
    }

    if (startDate || endDate) {
      where.arrivalDate = {};
      if (startDate) {
        where.arrivalDate.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.arrivalDate.lte = new Date(endDate as string);
      }
    }

    // Filter overdue registrations
    if (overdue === 'true') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      where.arrivalDate = { lte: yesterday };
      where.status = 'PENDING';
    }

    const [registrations, total] = await Promise.all([
      prisma.policeRegistration.findMany({
        where,
        include: {
          guest: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          reservation: {
            select: {
              reservationNumber: true,
              checkIn: true,
              checkOut: true
            }
          },
          property: {
            select: {
              name: true
            }
          }
        },
        orderBy: { arrivalDate: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.policeRegistration.count({ where })
    ]);

    // Add overdue flag to each registration
    const registrationsWithFlags = registrations.map(reg => ({
      ...reg,
      isOverdue: CyprusPoliceService.isRegistrationOverdue(reg.arrivalDate),
      daysSinceArrival: Math.floor(
        (new Date().getTime() - reg.arrivalDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    }));

    res.json({
      success: true,
      data: {
        registrations: registrationsWithFlags,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('Police Registrations Query Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/police/dashboard/:propertyId
 * @desc Get police registration dashboard data
 * @access Private
 */
router.get('/dashboard/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get various statistics
    const [
      totalRegistrations,
      pendingRegistrations,
      overdueRegistrations,
      todayArrivals,
      failedRegistrations
    ] = await Promise.all([
      // Total registrations this month
      prisma.policeRegistration.count({
        where: {
          propertyId,
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1)
          }
        }
      }),

      // Pending registrations
      prisma.policeRegistration.count({
        where: {
          propertyId,
          status: 'PENDING'
        }
      }),

      // Overdue registrations (more than 24 hours since arrival)
      prisma.policeRegistration.count({
        where: {
          propertyId,
          status: 'PENDING',
          arrivalDate: { lte: yesterday }
        }
      }),

      // Today's arrivals needing registration
      prisma.reservation.count({
        where: {
          propertyId,
          checkIn: {
            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
          },
          policeReported: false,
          status: {
            in: ['CONFIRMED', 'CHECKED_IN']
          }
        }
      }),

      // Failed registrations that need retry
      prisma.policeRegistration.count({
        where: {
          propertyId,
          status: 'FAILED'
        }
      })
    ]);

    // Get recent registrations
    const recentRegistrations = await prisma.policeRegistration.findMany({
      where: { propertyId },
      include: {
        guest: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        reservation: {
          select: {
            reservationNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Compliance score (percentage of required registrations that are completed)
    const requiredRegistrations = totalRegistrations + pendingRegistrations;
    const complianceScore = requiredRegistrations > 0
      ? Math.round((totalRegistrations / requiredRegistrations) * 100)
      : 100;

    res.json({
      success: true,
      data: {
        statistics: {
          totalRegistrations,
          pendingRegistrations,
          overdueRegistrations,
          todayArrivals,
          failedRegistrations,
          complianceScore
        },
        recentRegistrations,
        alerts: {
          hasOverdue: overdueRegistrations > 0,
          hasFailed: failedRegistrations > 0,
          hasTodayArrivals: todayArrivals > 0
        }
      }
    });

  } catch (error) {
    console.error('Police Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

export default router;