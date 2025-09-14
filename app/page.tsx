import { Metadata } from "next"
import { Button } from "components/Button/Button"
import { PMS_FEATURES } from "lib/features"

export const metadata: Metadata = {
  title: "Cyprus PMS - Property Management System",
  description: "The #1 Property Management System for Cyprus and beyond. Streamline your hotel, resort, or vacation rental operations with our comprehensive PMS solution.",
  keywords: "PMS, Property Management System, Cyprus, Hotel Management, Resort Management, Vacation Rental, Booking System",
  twitter: {
    card: "summary_large_image",
    title: "Cyprus PMS - Property Management System",
    description: "The #1 Property Management System for Cyprus and beyond",
  },
  openGraph: {
    title: "Cyprus PMS - Property Management System",
    description: "The #1 Property Management System for Cyprus and beyond",
    url: "https://cyprus-pms.com/",
    siteName: "Cyprus PMS",
    images: [
      {
        width: 1200,
        height: 630,
        url: "/og-image.png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto grid max-w-(--breakpoint-xl) px-4 py-16 text-center lg:py-24">
          <div className="mx-auto place-self-center">
            <div className="mb-6 inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
              🏨 #1 in Cyprus & Beyond
            </div>
            <h1 className="mb-6 max-w-4xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Cyprus <span className="text-blue-600 dark:text-blue-400">PMS</span>
              <br />
              <span className="text-3xl md:text-4xl xl:text-5xl text-gray-600 dark:text-gray-300">
                Property Management System
              </span>
            </h1>
            <p className="mb-8 max-w-3xl mx-auto font-light text-gray-600 md:text-lg lg:text-xl dark:text-gray-300">
              Streamline your hotel, resort, or vacation rental operations with our comprehensive PMS solution.
              Built specifically for the Cyprus market with multi-language support, local compliance, and
              international scalability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button href="/auth/signin" className="min-w-44">
                Start Free Trial
              </Button>
              <Button href="/demo" intent="secondary" className="min-w-44">
                Watch Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              ✓ 14-day free trial • ✓ No credit card required • ✓ Full support included
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Manage Your Property
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From reservations to revenue management, Cyprus PMS provides all the tools you need to run a successful hospitality business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PMS_FEATURES.map((feature) => (
              <div key={feature.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cyprus Specific Section */}
      <section className="bg-blue-600 dark:bg-blue-700 py-16">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 text-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for Cyprus, Designed for the World
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl mb-4">🇨🇾</div>
                <h3 className="text-xl font-semibold mb-2">Cyprus Compliant</h3>
                <p className="text-blue-100">VAT handling, tourism board reporting, and local tax compliance built-in.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
                <p className="text-blue-100">Support for English, Greek, Turkish, and Russian languages.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl mb-4">💶</div>
                <h3 className="text-xl font-semibold mb-2">Multi-Currency</h3>
                <p className="text-blue-100">Handle EUR, USD, GBP, and other currencies with real-time rates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of properties across Cyprus and beyond who trust Cyprus PMS for their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button href="/auth/signin" className="min-w-44">
              Start Your Free Trial
            </Button>
            <Button href="/contact" intent="secondary" className="min-w-44">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
