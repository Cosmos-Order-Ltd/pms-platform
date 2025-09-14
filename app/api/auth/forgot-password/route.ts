import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string };
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
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
    // 1. Check if user exists in database
    // 2. Generate secure reset token
    // 3. Store token with expiration time
    // 4. Send password reset email with secure link
    // 5. Log the password reset request

    // For demo purposes, simulate successful request
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate sending email (in production, integrate with email service)
    const _resetData = {
      email,
      resetToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      requestedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link shortly.',
      instructions: [
        'Check your email inbox and spam folder',
        'Click the reset link in the email',
        'Create a new secure password',
        'Sign in with your new password'
      ],
      // In production, don't return token in response
      debugInfo: process.env.NODE_ENV === 'development' ? {
        resetToken,
        resetLink: `/auth/reset-password?token=${resetToken}`
      } : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}