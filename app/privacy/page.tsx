import Link from 'next/link';
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl">🇨🇾</div>
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Privacy Policy</h1>
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
            <h2>Cyprus PMS Privacy Policy</h2>
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> September 14, 2025
            </p>

            <h3>1. Introduction</h3>
            <p>
              Cyprus PMS ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our property management system service.
            </p>

            <h3>2. Information We Collect</h3>

            <h4>2.1 Personal Information</h4>
            <p>We may collect personal information including:</p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Property information and business details</li>
              <li>Billing and payment information</li>
              <li>Guest data processed through our system</li>
              <li>Communication preferences</li>
            </ul>

            <h4>2.2 Usage Information</h4>
            <p>We automatically collect information about how you use our Service:</p>
            <ul>
              <li>Device information and IP address</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and features used</li>
              <li>Time spent on the Service</li>
              <li>Clickstream data</li>
            </ul>

            <h3>3. How We Use Your Information</h3>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and maintain our Service</li>
              <li>Process reservations and manage bookings</li>
              <li>Generate Cyprus tax and compliance reports</li>
              <li>Provide customer support</li>
              <li>Send service notifications and updates</li>
              <li>Improve and optimize our Service</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h3>4. Data Processing Legal Basis (GDPR)</h3>
            <p>Under GDPR, we process your data based on:</p>
            <ul>
              <li><strong>Contract:</strong> To fulfill our service agreement with you</li>
              <li><strong>Legitimate Interest:</strong> To improve our Service and provide support</li>
              <li><strong>Legal Obligation:</strong> To comply with Cyprus and EU laws</li>
              <li><strong>Consent:</strong> For marketing communications (when applicable)</li>
            </ul>

            <h3>5. Data Sharing and Disclosure</h3>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in providing our Service</li>
              <li><strong>OTA Partners:</strong> Booking.com, Expedia, and other channel partners (only reservation data)</li>
              <li><strong>Payment Processors:</strong> To handle billing and payments securely</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Partners:</strong> With your explicit consent</li>
            </ul>

            <h3>6. Cyprus-Specific Data Processing</h3>
            <p>For properties in Cyprus, we process data to:</p>
            <ul>
              <li>Calculate and report VAT at 19%</li>
              <li>Collect Tourism Tax (€1.50 per person per night)</li>
              <li>Generate CTO (Cyprus Tourism Organisation) reports</li>
              <li>Comply with Cyprus hospitality regulations</li>
            </ul>

            <h3>7. Data Security</h3>
            <p>We implement appropriate security measures including:</p>
            <ul>
              <li>SSL/TLS encryption for data transmission</li>
              <li>AES-256 encryption for data storage</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>

            <h3>8. Your Rights (GDPR)</h3>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request copies of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Restriction:</strong> Request limitation of processing</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdraw Consent:</strong> For consent-based processing</li>
            </ul>

            <h3>9. Data Retention</h3>
            <p>We retain your data for:</p>
            <ul>
              <li><strong>Account Data:</strong> Duration of your subscription plus 7 years for tax purposes</li>
              <li><strong>Guest Data:</strong> As required by Cyprus hospitality laws (minimum 3 years)</li>
              <li><strong>Financial Data:</strong> 7 years for accounting and tax compliance</li>
              <li><strong>Usage Logs:</strong> 12 months for security and improvement purposes</li>
            </ul>

            <h3>10. International Data Transfers</h3>
            <p>
              Your data is primarily processed within the EU/EEA. Any transfers to third countries are protected by appropriate safeguards such as Standard Contractual Clauses.
            </p>

            <h3>11. Cookies and Tracking</h3>
            <p>We use cookies to:</p>
            <ul>
              <li>Maintain your session and preferences</li>
              <li>Analyze Service usage and performance</li>
              <li>Provide personalized experience</li>
              <li>Prevent fraud and enhance security</li>
            </ul>

            <h3>12. Children's Privacy</h3>
            <p>
              Our Service is not intended for children under 16. We do not knowingly collect personal information from children under 16.
            </p>

            <h3>13. Changes to Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h3>14. Contact Information</h3>
            <p>
              For privacy-related questions or to exercise your rights, contact us:
            </p>
            <ul>
              <li><strong>Data Protection Officer:</strong> privacy@cypruspms.com</li>
              <li><strong>Phone:</strong> +357 25 123 456</li>
              <li><strong>Address:</strong> Limassol Technology Park, 3106 Limassol, Cyprus</li>
            </ul>

            <h3>15. Supervisory Authority</h3>
            <p>
              You have the right to lodge a complaint with the Cyprus Commissioner for Personal Data Protection if you believe we have violated your privacy rights.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Link
              href="/terms"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Terms of Service
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