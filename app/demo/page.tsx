import React from 'react';
import Link from 'next/link';
import { Button } from 'components/Button/Button';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl">🇨🇾</div>
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Cyprus PMS Demo</h1>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          See Cyprus PMS in Action
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Watch how Cyprus PMS streamlines hotel operations with Cyprus-specific features,
          multi-language support, and comprehensive property management tools.
        </p>

        {/* Video Placeholder */}
        <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="text-6xl text-white mb-4">▶️</div>
            <p className="text-white text-lg">Demo Video</p>
            <p className="text-gray-300 text-sm">(5 minutes)</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/auth/signin" className="min-w-44">
            Start Free Trial
          </Button>
          <Button href="/contact" intent="secondary" className="min-w-44">
            Schedule Live Demo
          </Button>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You'll See in the Demo
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🏨',
                title: 'Dashboard Overview',
                description: 'Real-time occupancy, revenue, and guest analytics at a glance'
              },
              {
                icon: '📅',
                title: 'Reservation Management',
                description: 'Book, modify, and manage reservations with Cyprus tax calculations'
              },
              {
                icon: '👥',
                title: 'Guest Portal',
                description: 'Self-service check-in/out and guest communication system'
              },
              {
                icon: '💰',
                title: 'Revenue Analytics',
                description: 'ADR, RevPAR, and forecasting with Cyprus market insights'
              },
              {
                icon: '🔗',
                title: 'Channel Integration',
                description: 'Connect with Booking.com, Expedia, and other OTAs seamlessly'
              },
              {
                icon: '🇨🇾',
                title: 'Cyprus Compliance',
                description: 'Automated VAT (19%) and Tourism Tax (€1.50/night) handling'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cyprus Specific Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Built for Cyprus Hotels & Resorts
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-xl font-semibold text-white mb-2">CTO Reporting</h4>
              <p className="text-blue-100">Automated Cyprus Tourism Organisation compliance</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h4 className="text-xl font-semibold text-white mb-2">Multi-Language</h4>
              <p className="text-blue-100">English, Greek, Turkish, and Russian support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💶</div>
              <h4 className="text-xl font-semibold text-white mb-2">Local Currency</h4>
              <p className="text-blue-100">EUR pricing with real-time exchange rates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Cyprus Hotels Say
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">⭐⭐⭐⭐⭐</div>
                <div>
                  <h4 className="font-semibold">Maria Constantinou</h4>
                  <p className="text-sm text-gray-600">Hotel Manager, Limassol</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Cyprus PMS made our VAT reporting so much easier. The Tourism Tax calculation
                is automatic and CTO reports are generated with one click!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">⭐⭐⭐⭐⭐</div>
                <div>
                  <h4 className="font-semibold">Andreas Paphos</h4>
                  <p className="text-sm text-gray-600">Resort Owner, Paphos</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The multi-language support is perfect for our international guests.
                Revenue increased 15% in the first quarter after switching!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Property?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join 200+ hotels across Cyprus using our PMS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/auth/signin" className="min-w-44">
              Start 14-Day Free Trial
            </Button>
            <Button href="/contact" intent="secondary" className="min-w-44">
              Schedule Personal Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ✓ No credit card required • ✓ Setup in 24 hours • ✓ Cyprus support team
          </p>
        </div>
      </div>
    </div>
  );
}