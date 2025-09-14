import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      property?: string;
      propertyType?: string;
      requestType?: string;
      message?: string;
    };
    const {
      firstName,
      lastName,
      email,
      phone,
      property,
      propertyType,
      requestType,
      message
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !property || !propertyType) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Phone validation (if provided)
    if (phone && phone.length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number' },
          { status: 400 }
        );
      }
    }

    // Validate property type
    const validPropertyTypes = ['hotel', 'resort', 'apartment', 'villa', 'boutique', 'other'];
    if (!validPropertyTypes.includes(propertyType)) {
      return NextResponse.json(
        { error: 'Please select a valid property type' },
        { status: 400 }
      );
    }

    // Validate request type
    const validRequestTypes = ['demo', 'trial', 'pricing', 'support', 'migration'];
    if (requestType && !validRequestTypes.includes(requestType)) {
      return NextResponse.json(
        { error: 'Please select a valid request type' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save the inquiry to database
    // 2. Send email notification to sales team
    // 3. Send confirmation email to customer
    // 4. Schedule follow-up tasks
    // 5. Integrate with CRM system

    const inquiry = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone: phone || null,
      property,
      propertyType,
      requestType: requestType || 'demo',
      message: message || '',
      submittedAt: new Date().toISOString(),
      status: 'new'
    };

    // Simulate successful submission
    return NextResponse.json({
      success: true,
      message: 'Thank you! We will contact you within 24 hours to schedule your demo.',
      inquiryId: inquiry.id,
      expectedResponse: '24 hours',
      nextSteps: [
        'Our Cyprus team will review your request',
        'We\'ll prepare a personalized demo based on your property type',
        'You\'ll receive a calendar invitation for the demo session'
      ]
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your request. Please try again.' },
      { status: 500 }
    );
  }
}