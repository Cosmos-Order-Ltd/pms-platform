import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      propertyName?: string;
      propertyType?: string;
      agreeTerms?: boolean;
    };
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      propertyName,
      propertyType,
      agreeTerms
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !propertyName || !propertyType) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate terms acceptance
    if (!agreeTerms) {
      return NextResponse.json(
        { error: 'You must agree to the Terms of Service and Privacy Policy' },
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

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Hash the password
    // 2. Check if user already exists
    // 3. Save user to database
    // 4. Send verification email
    // 5. Create session/JWT token

    // For demo purposes, simulate successful registration
    const user = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      propertyName,
      propertyType,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        propertyName: user.propertyName,
        propertyType: user.propertyType
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}