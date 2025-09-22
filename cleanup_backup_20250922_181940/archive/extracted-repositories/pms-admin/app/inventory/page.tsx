"use client"

import { useState } from "react"

interface InventoryItem {
  id: string
  name: string
  description?: string
  category: 'linens' | 'toiletries' | 'cleaning_supplies' | 'minibar' | 'amenities' | 'office_supplies' | 'maintenance_parts' | 'food_beverage' | 'other'
  sku?: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  reorderPoint: number
  unitCost: number
  supplierPrice?: number
  unit: string
  location?: string
  supplierName?: string
  supplierContact?: string
  isActive: boolean
  lastUpdated: string
  movements?: StockMovement[]
}

interface StockMovement {
  id: string
  type: 'stock_in' | 'stock_out' | 'adjustment' | 'transfer' | 'damaged' | 'expired' | 'theft'
  quantity: number
  previousStock: number
  newStock: number
  unitCost?: number
  totalCost?: number
  referenceNumber?: string
  notes?: string
  user: string
  createdAt: string
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Bath Towels - White",
    description: "100% Cotton premium bath towels",
    category: "linens",
    sku: "LIN-BTW-001",
    currentStock: 45,
    minimumStock: 20,
    maximumStock: 100,
    reorderPoint: 25,
    unitCost: 15.50,
    supplierPrice: 12.00,
    unit: "pieces",
    location: "Linen Room - Shelf A1",
    supplierName: "Cyprus Linen Supply Co.",
    supplierContact: "+357 22 123456",
    isActive: true,
    lastUpdated: "2024-01-15T08:30:00Z"
  },
  {
    id: "INV-002",
    name: "Shampoo Bottles - 30ml",
    description: "Premium hotel shampoo bottles",
    category: "toiletries",
    sku: "TOI-SHP-030",
    currentStock: 15,
    minimumStock: 50,
    maximumStock: 200,
    reorderPoint: 50,
    unitCost: 2.50,
    supplierPrice: 1.80,
    unit: "pieces",
    location: "Housekeeping Storage",
    supplierName: "Hospitality Amenities Ltd",
    supplierContact: "+357 25 987654",
    isActive: true,
    lastUpdated: "2024-01-14T16:20:00Z"
  },
  {
    id: "INV-003",
    name: "All-Purpose Cleaner",
    description: "Multi-surface cleaning solution",
    category: "cleaning_supplies",
    sku: "CLN-APC-001",
    currentStock: 8,
    minimumStock: 12,
    maximumStock: 50,
    reorderPoint: 15,
    unitCost: 8.75,
    supplierPrice: 6.50,
    unit: "liters",
    location: "Maintenance Room",
    supplierName: "Professional Cleaning Solutions",
    supplierContact: "+357 24 555123",
    isActive: true,
    lastUpdated: "2024-01-13T11:45:00Z"
  },
  {
    id: "INV-004",
    name: "Coca-Cola Cans - 330ml",
    description: "Minibar refreshments",
    category: "minibar",
    sku: "MB-COK-330",
    currentStock: 120,
    minimumStock: 100,
    maximumStock: 500,
    reorderPoint: 150,
    unitCost: 1.20,
    supplierPrice: 0.85,
    unit: "pieces",
    location: "Minibar Storage - Fridge 2",
    supplierName: "Cyprus Beverages Dist.",
    supplierContact: "+357 22 456789",
    isActive: true,
    lastUpdated: "2024-01-15T09:15:00Z"
  },
  {
    id: "INV-005",
    name: "LED Light Bulbs - E27",
    description: "Energy efficient LED bulbs",
    category: "maintenance_parts",
    sku: "MNT-LED-E27",
    currentStock: 25,
    minimumStock: 15,
    maximumStock: 75,
    reorderPoint: 20,
    unitCost: 12.00,
    supplierPrice: 9.50,
    unit: "pieces",
    location: "Maintenance Workshop",
    supplierName: "Electrical Supplies Cyprus",
    supplierContact: "+357 23 789456",
    isActive: true,
    lastUpdated: "2024-01-12T14:30:00Z"
  }
]

const mockMovements: StockMovement[] = [
  {
    id: "MOV-001",
    type: "stock_out",
    quantity: -5,
    previousStock: 50,
    newStock: 45,
    notes: "Used for Room 205 setup",
    user: "Maria Ioannou",
    createdAt: "2024-01-15T08:30:00Z"
  },
  {
    id: "MOV-002",
    type: "stock_in",
    quantity: 100,
    previousStock: 50,
    newStock: 150,
    unitCost: 1.80,
    totalCost: 180.00,
    referenceNumber: "PO-2024-001",
    notes: "Weekly delivery from supplier",
    user: "System",
    createdAt: "2024-01-14T10:00:00Z"
  }
]

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedView, setSelectedView] = useState<'overview' | 'movements' | 'reorder'>('overview')

  const getCategoryIcon = (category: InventoryItem['category']) => {
    switch (category) {
      case 'linens':
        return '🛏️'
      case 'toiletries':
        return '🧴'
      case 'cleaning_supplies':
        return '🧹'
      case 'minibar':
        return '🥤'
      case 'amenities':
        return '🎁'
      case 'office_supplies':
        return '📝'
      case 'maintenance_parts':
        return '🔧'
      case 'food_beverage':
        return '🍽️'
      default:
        return '📦'
    }
  }

  const getCategoryColor = (category: InventoryItem['category']) => {
    switch (category) {
      case 'linens':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'toiletries':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'cleaning_supplies':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'minibar':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'amenities':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'office_supplies':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'maintenance_parts':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'food_beverage':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
    }
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.reorderPoint) {
      return { status: 'critical', color: 'bg-red-500', text: 'Critical' }
    } else if (item.currentStock <= item.minimumStock) {
      return { status: 'low', color: 'bg-orange-500', text: 'Low' }
    } else if (item.currentStock >= item.maximumStock * 0.9) {
      return { status: 'high', color: 'bg-blue-500', text: 'High' }
    } else {
      return { status: 'normal', color: 'bg-green-500', text: 'Normal' }
    }
  }

  const getMovementIcon = (type: StockMovement['type']) => {
    switch (type) {
      case 'stock_in':
        return '📥'
      case 'stock_out':
        return '📤'
      case 'adjustment':
        return '⚖️'
      case 'transfer':
        return '🔄'
      case 'damaged':
        return '💔'
      case 'expired':
        return '⏰'
      case 'theft':
        return '🚨'
      default:
        return '📦'
    }
  }

  const getMovementColor = (type: StockMovement['type']) => {
    switch (type) {
      case 'stock_in':
        return 'text-green-600 dark:text-green-400'
      case 'stock_out':
        return 'text-blue-600 dark:text-blue-400'
      case 'adjustment':
        return 'text-purple-600 dark:text-purple-400'
      case 'transfer':
        return 'text-indigo-600 dark:text-indigo-400'
      case 'damaged':
        return 'text-red-600 dark:text-red-400'
      case 'expired':
        return 'text-orange-600 dark:text-orange-400'
      case 'theft':
        return 'text-red-700 dark:text-red-300'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const filteredItems = selectedCategory === 'all' ? mockInventoryItems : mockInventoryItems.filter(item => item.category === selectedCategory)

  const criticalItems = mockInventoryItems.filter(item => item.currentStock <= item.reorderPoint).length
  const lowStockItems = mockInventoryItems.filter(item => item.currentStock <= item.minimumStock && item.currentStock > item.reorderPoint).length
  const totalValue = mockInventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
  const reorderNeeded = mockInventoryItems.filter(item => item.currentStock <= item.reorderPoint).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Track stock levels and manage supplies</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('overview')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === 'overview'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedView('movements')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === 'movements'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Movements
                </button>
                <button
                  onClick={() => setSelectedView('reorder')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === 'reorder'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Reorder
                </button>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Categories</option>
                <option value="linens">Linens</option>
                <option value="toiletries">Toiletries</option>
                <option value="cleaning_supplies">Cleaning Supplies</option>
                <option value="minibar">Minibar</option>
                <option value="amenities">Amenities</option>
                <option value="maintenance_parts">Maintenance Parts</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900">
                <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Stock</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{criticalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-orange-100 dark:bg-orange-900">
                <span className="text-orange-600 dark:text-orange-400 text-xl">📉</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">€{totalValue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900">
                <span className="text-purple-600 dark:text-purple-400 text-xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reorder Needed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reorderNeeded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview */}
        {selectedView === 'overview' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item)
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{getCategoryIcon(item.category)}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </div>
                              {item.sku && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  SKU: {item.sku}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category.replace('_', ' ').split(' ').map(word =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.currentStock} {item.unit}
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div
                                  className={`h-2 rounded-full ${stockStatus.color}`}
                                  style={{
                                    width: `${Math.min((item.currentStock / item.maximumStock) * 100, 100)}%`
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            €{item.unitCost.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Total: €{(item.currentStock * item.unitCost).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {item.location || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full ${stockStatus.color} mr-2`} />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {stockStatus.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              View
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                              Adjust
                            </button>
                            {stockStatus.status === 'critical' && (
                              <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                Reorder
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Movements View */}
        {selectedView === 'movements' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stock Movements</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getMovementIcon(movement.type)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {movement.type.replace('_', ' ').split(' ').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          By {movement.user} • {new Date(movement.createdAt).toLocaleDateString()} {new Date(movement.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getMovementColor(movement.type)}`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {movement.previousStock} → {movement.newStock}
                        </div>
                      </div>
                      {movement.totalCost && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            €{movement.totalCost.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @€{movement.unitCost?.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reorder View */}
        {selectedView === 'reorder' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items Requiring Reorder</h2>
            </div>
            <div className="p-6">
              {mockInventoryItems.filter(item => item.currentStock <= item.reorderPoint).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-600 text-4xl mb-2">✅</div>
                  <p className="text-gray-500 dark:text-gray-400">All items are adequately stocked</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockInventoryItems
                    .filter(item => item.currentStock <= item.reorderPoint)
                    .map((item) => {
                      const suggestedQuantity = item.maximumStock - item.currentStock
                      const estimatedCost = suggestedQuantity * (item.supplierPrice || item.unitCost)

                      return (
                        <div key={item.id} className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {item.name}
                                </div>
                                <div className="text-sm text-red-600 dark:text-red-400">
                                  Critical: {item.currentStock} {item.unit} remaining
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                Suggest: {suggestedQuantity} {item.unit}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Est: €{estimatedCost.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {item.supplierName && (
                            <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                              Supplier: {item.supplierName} • {item.supplierContact}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Min: {item.minimumStock} • Max: {item.maximumStock} • Reorder at: {item.reorderPoint}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                                Create PO
                              </button>
                              <button className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded">
                                Adjust Levels
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}