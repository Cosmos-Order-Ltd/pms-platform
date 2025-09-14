import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl">🇨🇾</div>
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="prose max-w-none">
            <h2>Cyprus PMS Terms of Service</h2>
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> September 14, 2025
            </p>

            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing and using Cyprus PMS (the "Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h3>2. Description of Service</h3>
            <p>
              Cyprus PMS is a cloud-based Property Management System designed specifically for hotels, resorts, and accommodation providers in Cyprus and beyond. The Service includes:
            </p>
            <ul>
              <li>Reservation management and booking system</li>
              <li>Guest management and communication tools</li>
              <li>Revenue management and analytics</li>
              <li>Cyprus-specific tax and compliance features</li>
              <li>Channel management and OTA integration</li>
              <li>Reporting and business intelligence tools</li>
            </ul>

            <h3>3. User Accounts</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h3>4. Cyprus Compliance</h3>
            <p>
              Our Service includes features for Cyprus tax compliance, including:
            </p>
            <ul>
              <li>VAT calculations at 19% rate</li>
              <li>Tourism Tax collection (€1.50 per person per night)</li>
              <li>CTO (Cyprus Tourism Organisation) reporting</li>
            </ul>
            <p>
              While we provide these tools, you remain responsible for ensuring compliance with all local regulations and tax requirements.
            </p>

            <h3>5. Free Trial</h3>
            <p>
              We offer a 14-day free trial with full access to all features. No credit card is required to start your trial. At the end of the trial period, you must subscribe to continue using the Service.
            </p>

            <h3>6. Privacy and Data Protection</h3>
            <p>
              We are committed to protecting your privacy and complying with GDPR and Cyprus data protection laws. Please review our Privacy Policy for details on how we collect, use, and protect your data.
            </p>

            <h3>7. Payment Terms</h3>
            <ul>
              <li>Subscription fees are billed monthly or annually in advance</li>
              <li>All prices are in EUR and include applicable VAT</li>
              <li>Payment is due within 30 days of invoice date</li>
              <li>Late payments may result in service suspension</li>
            </ul>

            <h3>8. Limitation of Liability</h3>
            <p>
              Cyprus PMS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h3>9. Support and Maintenance</h3>
            <p>
              We provide technical support during Cyprus business hours (Monday-Friday, 8:00-18:00 EET). Emergency support is available on weekends for critical issues.
            </p>

            <h3>10. Termination</h3>
            <p>
              Either party may terminate this agreement at any time with 30 days written notice. Upon termination, you will have 90 days to export your data before it is permanently deleted.
            </p>

            <h3>11. Governing Law</h3>
            <p>
              These terms are governed by the laws of the Republic of Cyprus. Any disputes will be resolved in the courts of Cyprus.
            </p>

            <h3>12. Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. We will notify you of significant changes via email or through the Service. Continued use of the Service constitutes acceptance of the modified terms.
            </p>

            <h3>13. Contact Information</h3>
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li>Email: legal@cypruspms.com</li>
              <li>Phone: +357 25 123 456</li>
              <li>Address: Limassol Technology Park, 3106 Limassol, Cyprus</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}