import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      nationality,
      checkIn,
      checkOut,
      adults,
      children,
      roomType,
      selectedRoom,
      specialRequests,
      preferences
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !checkIn || !checkOut || !adults || !roomType || !selectedRoom) {
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

    // Date validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Calculate nights and pricing
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    const roomRates = {
      STANDARD: 80,
      DELUXE: 120,
      SUITE: 200,
      FAMILY: 150
    };

    const baseRate = roomRates[roomType as keyof typeof roomRates] || 0;
    const roomTotal = baseRate * nights;
    const tourismTax = 1.50 * parseInt(adults) * nights; // Cyprus Tourism Tax
    const vat = (roomTotal + tourismTax) * 0.19; // Cyprus VAT
    const total = roomTotal + tourismTax + vat;

    // Validate room type
    if (!Object.keys(roomRates).includes(roomType)) {
      return NextResponse.json(
        { error: 'Invalid room type selected' },
        { status: 400 }
      );
    }

    // Validate guest counts
    const adultsCount = parseInt(adults);
    const childrenCount = parseInt(children || '0');

    if (adultsCount < 1 || adultsCount > 4) {
      return NextResponse.json(
        { error: 'Adults count must be between 1 and 4' },
        { status: 400 }
      );
    }

    if (childrenCount < 0 || childrenCount > 3) {
      return NextResponse.json(
        { error: 'Children count must be between 0 and 3' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Check room availability
    // 2. Reserve the room
    // 3. Save reservation to database
    // 4. Send confirmation email
    // 5. Process payment (if required)
    // 6. Update room inventory

    const reservation = {
      id: `RES-${Date.now()}`,
      guest: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        nationality: nationality || null
      },
      stay: {
        checkIn,
        checkOut,
        nights,
        adults: adultsCount,
        children: childrenCount
      },
      room: {
        number: selectedRoom,
        type: roomType,
        rate: baseRate
      },
      pricing: {
        roomTotal: parseFloat(roomTotal.toFixed(2)),
        tourismTax: parseFloat(tourismTax.toFixed(2)),
        vat: parseFloat(vat.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      },
      specialRequests: specialRequests || '',
      preferences: preferences || [],
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Reservation created successfully!',
      reservation,
      confirmationNumber: reservation.id,
      nextSteps: [
        'Check your email for confirmation details',
        'Arrive at the property on your check-in date',
        'Present ID and reservation confirmation at reception'
      ]
    });

  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating your reservation. Please try again.' },
      { status: 500 }
    );
  }
}