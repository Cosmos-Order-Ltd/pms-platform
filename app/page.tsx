export default function HomePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to PMS Platform
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Property Management System Hub
        </p>
        <div className="space-y-4">
          <p className="text-gray-700">
            This platform coordinates multiple microservices for comprehensive property management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="font-semibold text-gray-900">Core Services</h3>
              <p className="text-sm text-gray-600 mt-2">
                Backend API, Admin Dashboard, Guest Portal, Staff App
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="font-semibold text-gray-900">Infrastructure</h3>
              <p className="text-sm text-gray-600 mt-2">
                Database Schema, Shared Libraries, Infrastructure Tools
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="font-semibold text-gray-900">Specialized</h3>
              <p className="text-sm text-gray-600 mt-2">
                Cyprus Localization, Invitation Engine, Business Automation
              </p>
            </div>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              🚀 All services are available in individual repositories for focused development.
            </p>
            <p className="text-blue-600 text-sm mt-2">
              Visit <a href="http://192.168.30.98:3000/charilaouc" className="underline">Gitea repositories</a> to work on specific services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
