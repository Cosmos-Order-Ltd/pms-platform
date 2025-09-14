import {
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CogIcon,
  CurrencyEuroIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"

export const PMS_FEATURES = [
  {
    title: "Smart Reservations",
    description: "Manage bookings from multiple channels with real-time availability, automated confirmations, and seamless check-in/check-out processes.",
    icon: <CalendarIcon className="w-6 h-6" />,
  },
  {
    title: "Multi-Property Support",
    description: "Manage multiple hotels, resorts, or vacation rentals from a single dashboard with centralized reporting and operations.",
    icon: <BuildingOfficeIcon className="w-6 h-6" />,
  },
  {
    title: "Guest Management",
    description: "Comprehensive guest profiles with preferences, history, and automated communication for personalized service.",
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
  {
    title: "Revenue Analytics",
    description: "Advanced reporting with ADR, RevPAR, occupancy rates, and forecasting to maximize your property's revenue potential.",
    icon: <ChartBarIcon className="w-6 h-6" />,
  },
  {
    title: "Cyprus Tax Compliance",
    description: "Built-in VAT handling (19%), tourism tax calculation, and automated CTO (Cyprus Tourism Organisation) reporting.",
    icon: <CurrencyEuroIcon className="w-6 h-6" />,
  },
  {
    title: "Mobile Ready",
    description: "Access your PMS from anywhere on any device with our responsive design and mobile-optimized interface.",
    icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
  },
  {
    title: "24/7 Operations",
    description: "Round-the-clock system availability with automated backup, real-time sync, and 99.9% uptime guarantee.",
    icon: <ClockIcon className="w-6 h-6" />,
  },
  {
    title: "Data Security",
    description: "GDPR compliant with enterprise-grade security, encrypted data storage, and regular security audits.",
    icon: <ShieldCheckIcon className="w-6 h-6" />,
  },
  {
    title: "Multi-Language",
    description: "Full support for English, Greek, Turkish, and Russian languages for staff and guest communications.",
    icon: <GlobeAltIcon className="w-6 h-6" />,
  },
  {
    title: "Channel Management",
    description: "Connect with Booking.com, Expedia, Airbnb, and other OTAs with real-time rate and availability sync.",
    icon: <DocumentTextIcon className="w-6 h-6" />,
  },
  {
    title: "Guest Communication",
    description: "Automated emails, SMS notifications, and WhatsApp integration for seamless guest communication.",
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
  },
  {
    title: "Customizable",
    description: "Flexible configuration options, custom fields, and integrations to match your specific business needs.",
    icon: <CogIcon className="w-6 h-6" />,
  },
]

export const LP_GRID_ITEMS = PMS_FEATURES.slice(0, 6) // First 6 features for landing page