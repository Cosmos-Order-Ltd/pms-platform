import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; password?: string; rememberMe?: boolean };
    const { email, password, rememberMe } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // In a real application, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Query database for user
    // 3. Validate credentials
    // 4. Create session/JWT token
    // 5. Set secure cookies

    // For demo purposes, simulate successful login
    // Accept any valid email with password length >= 6
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Simulate user data
    const user = {
      id: Date.now().toString(),
      email,
      firstName: 'Demo',
      lastName: 'User',
      propertyName: 'Cyprus Hotel Demo',
      propertyType: 'hotel',
      lastLogin: new Date().toISOString()
    };

    // Create response with session data
    const response = NextResponse.json({
      success: true,
      message: 'Sign in successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        propertyName: user.propertyName,
        propertyType: user.propertyType
      },
      redirectTo: '/dashboard'
    });

    // Set session cookie (in production, use secure HTTP-only cookies)
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
    response.cookies.set('demo-session', JSON.stringify(user), {
      httpOnly: false, // Set to true in production
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge
    });

    return response;

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'An error occurred during sign in. Please try again.' },
      { status: 500 }
    );
  }
}