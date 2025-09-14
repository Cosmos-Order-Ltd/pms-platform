import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

export const locales = ["en", "el", "tr", "ru"] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: "Europe/Nicosia",
    formats: {
      currency: {
        EUR: {
          style: "currency",
          currency: "EUR",
        },
      },
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
        medium: {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
      },
    },
  }
})