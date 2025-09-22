import "styles/tailwind.css"
import Navigation from "components/Navigation/Navigation"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="lg:ml-64">
            <div className="lg:hidden h-16" />
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
