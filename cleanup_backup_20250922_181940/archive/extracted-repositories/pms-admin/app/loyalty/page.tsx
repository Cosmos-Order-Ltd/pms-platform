'use client'

import { useState } from 'react'

interface LoyaltyMember {
  id: string
  membershipNumber: string
  guestName: string
  email: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  points: number
  lifetimePoints: number
  joinDate: string
  lastStay: string
  stayCount: number
  totalSpent: number
  tierProgress: number
  pointsToNext: number
  benefits: string[]
}

interface PointTransaction {
  id: string
  memberName: string
  type: 'earned' | 'redeemed' | 'bonus' | 'expired' | 'adjustment'
  points: number
  description: string
  date: string
  reservationId?: string
}

interface TierBenefit {
  tier: string
  color: string
  icon: string
  minPoints: number
  benefits: string[]
  perks: {
    earnRate: string
    roomUpgrades: string
    lateCheckout: string
    bonusNights: string
    concierge: string
  }
}

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'transactions' | 'tiers' | 'promotions'>('members')
  const [selectedTier, setSelectedTier] = useState<string>('all')

  // Mock data
  const loyaltyMembers: LoyaltyMember[] = [
    {
      id: 'LM-001',
      membershipNumber: 'CP2024001',
      guestName: 'Elena Papadopoulos',
      email: 'elena.p@email.com',
      tier: 'Platinum',
      points: 8450,
      lifetimePoints: 15670,
      joinDate: '2023-03-15',
      lastStay: '2025-08-22',
      stayCount: 12,
      totalSpent: 8750.00,
      tierProgress: 84,
      pointsToNext: 1550,
      benefits: ['Room upgrades', 'Late checkout', 'Welcome amenity', 'Priority reservations']
    },
    {
      id: 'LM-002',
      membershipNumber: 'CP2024002',
      guestName: 'David Chen',
      email: 'david.chen@email.com',
      tier: 'Gold',
      points: 4280,
      lifetimePoints: 7830,
      joinDate: '2023-07-08',
      lastStay: '2025-09-01',
      stayCount: 8,
      totalSpent: 4650.00,
      tierProgress: 57,
      pointsToNext: 3220,
      benefits: ['Room upgrades', 'Late checkout', 'Welcome amenity']
    },
    {
      id: 'LM-003',
      membershipNumber: 'CP2024003',
      guestName: 'John Smith',
      email: 'j.smith@email.com',
      tier: 'Silver',
      points: 2150,
      lifetimePoints: 3890,
      joinDate: '2024-01-20',
      lastStay: '2025-09-10',
      stayCount: 5,
      totalSpent: 2250.00,
      tierProgress: 43,
      pointsToNext: 2850,
      benefits: ['Late checkout', 'Welcome amenity']
    },
    {
      id: 'LM-004',
      membershipNumber: 'CP2024004',
      guestName: 'Sarah Wilson',
      email: 'sarah.w@email.com',
      tier: 'Bronze',
      points: 890,
      lifetimePoints: 1120,
      joinDate: '2024-06-10',
      lastStay: '2025-09-14',
      stayCount: 2,
      totalSpent: 1050.00,
      tierProgress: 18,
      pointsToNext: 4110,
      benefits: ['Welcome amenity']
    }
  ]

  const pointTransactions: PointTransaction[] = [
    {
      id: 'PT-001',
      memberName: 'Elena Papadopoulos',
      type: 'earned',
      points: 125,
      description: 'Stay at Cyprus Resort - Room 312',
      date: '2025-09-14 14:30',
      reservationId: 'RES-081'
    },
    {
      id: 'PT-002',
      memberName: 'David Chen',
      type: 'redeemed',
      points: -500,
      description: 'Room upgrade to Suite',
      date: '2025-09-14 10:15',
      reservationId: 'RES-079'
    },
    {
      id: 'PT-003',
      memberName: 'John Smith',
      type: 'bonus',
      points: 200,
      description: 'Birthday bonus points',
      date: '2025-09-13 09:00'
    },
    {
      id: 'PT-004',
      memberName: 'Sarah Wilson',
      type: 'earned',
      points: 85,
      description: 'Spa services',
      date: '2025-09-12 16:45'
    }
  ]

  const tierBenefits: TierBenefit[] = [
    {
      tier: 'Bronze',
      color: 'bg-amber-100 text-amber-800',
      icon: '🥉',
      minPoints: 0,
      benefits: ['Welcome amenity', '5% discount on spa services', 'Priority customer support'],
      perks: {
        earnRate: '1 point per €1',
        roomUpgrades: 'Subject to availability',
        lateCheckout: '12:00 PM',
        bonusNights: 'None',
        concierge: 'Standard'
      }
    },
    {
      tier: 'Silver',
      color: 'bg-gray-100 text-gray-800',
      icon: '🥈',
      minPoints: 5000,
      benefits: ['All Bronze benefits', 'Late checkout', '10% dining discount', 'Birthday bonus'],
      perks: {
        earnRate: '1.25 points per €1',
        roomUpgrades: 'Complimentary when available',
        lateCheckout: '1:00 PM',
        bonusNights: '1 night per year',
        concierge: 'Priority'
      }
    },
    {
      tier: 'Gold',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🥇',
      minPoints: 7500,
      benefits: ['All Silver benefits', 'Room upgrades', 'Free WiFi', 'Airport transfer discount'],
      perks: {
        earnRate: '1.5 points per €1',
        roomUpgrades: 'Guaranteed upgrade',
        lateCheckout: '2:00 PM',
        bonusNights: '2 nights per year',
        concierge: 'Dedicated line'
      }
    },
    {
      tier: 'Platinum',
      color: 'bg-slate-100 text-slate-800',
      icon: '💎',
      minPoints: 10000,
      benefits: ['All Gold benefits', 'Suite upgrades', 'VIP amenities', 'Priority reservations'],
      perks: {
        earnRate: '2 points per €1',
        roomUpgrades: 'Premium suite upgrades',
        lateCheckout: '4:00 PM',
        bonusNights: '3 nights per year',
        concierge: 'Personal concierge'
      }
    },
    {
      tier: 'Diamond',
      color: 'bg-indigo-100 text-indigo-800',
      icon: '💎',
      minPoints: 15000,
      benefits: ['All Platinum benefits', 'Penthouse access', 'Personal butler', 'Helicopter transfers'],
      perks: {
        earnRate: '2.5 points per €1',
        roomUpgrades: 'Penthouse when available',
        lateCheckout: 'Flexible',
        bonusNights: '5 nights per year',
        concierge: 'Dedicated manager'
      }
    }
  ]

  const getTierIcon = (tier: string) => {
    const tierInfo = tierBenefits.find(t => t.tier === tier)
    return tierInfo ? tierInfo.icon : '🥉'
  }

  const getTierColor = (tier: string) => {
    const tierInfo = tierBenefits.find(t => t.tier === tier)
    return tierInfo ? tierInfo.color : 'bg-gray-100 text-gray-800'
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600'
      case 'bonus': return 'text-blue-600'
      case 'redeemed': return 'text-red-600'
      case 'expired': return 'text-gray-600'
      case 'adjustment': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const filteredMembers = selectedTier === 'all'
    ? loyaltyMembers
    : loyaltyMembers.filter(member => member.tier === selectedTier)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cyprus Rewards Program</h1>
              <p className="text-gray-600">Manage loyalty members and reward program</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-xl font-bold text-gray-900">2,847</p>
              </div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'members', label: 'Members', icon: '👥' },
              { id: 'transactions', label: 'Transactions', icon: '💳' },
              { id: 'tiers', label: 'Tier Benefits', icon: '🏆' },
              { id: 'promotions', label: 'Promotions', icon: '🎁' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'members' | 'transactions' | 'tiers' | 'promotions')}
                className={`flex items-center space-x-2 border-b-2 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All Tiers</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
              <input
                type="text"
                placeholder="Search members..."
                className="rounded-lg border border-gray-300 px-4 py-2"
              />
              <button className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">
                Export
              </button>
            </div>

            {/* Members Table */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Stays
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{member.guestName}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-xs text-gray-500">#{member.membershipNumber}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(member.tier)}`}>
                            <span className="mr-1">{getTierIcon(member.tier)}</span>
                            {member.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-lg font-bold text-gray-900">{member.points.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{member.lifetimePoints.toLocaleString()} lifetime</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${member.tierProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{member.pointsToNext} to next</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{member.stayCount}</p>
                            <p className="text-xs text-gray-500">Last: {member.lastStay}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">€{member.totalSpent.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              View
                            </button>
                            <button className="text-green-600 hover:text-green-800 text-sm">
                              Award Points
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Point Transactions</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="date"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Award Points
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pointTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{transaction.memberName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'earned' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'redeemed' ? 'bg-red-100 text-red-800' :
                              transaction.type === 'bonus' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.type}
                            </span>
                            <p className="mt-1 text-sm text-gray-600">{transaction.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                            {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{transaction.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          {transaction.reservationId && (
                            <p className="text-sm text-blue-600">{transaction.reservationId}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Tier Benefits Structure</h3>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Edit Tiers
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {tierBenefits.map((tier, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow border-l-4 border-blue-500">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{tier.icon}</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{tier.tier}</h4>
                      <p className="text-sm text-gray-600">{tier.minPoints.toLocaleString()}+ points</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Benefits</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Perks</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Earn Rate:</strong> {tier.perks.earnRate}</p>
                        <p><strong>Room Upgrades:</strong> {tier.perks.roomUpgrades}</p>
                        <p><strong>Late Checkout:</strong> {tier.perks.lateCheckout}</p>
                        <p><strong>Bonus Nights:</strong> {tier.perks.bonusNights}</p>
                        <p><strong>Concierge:</strong> {tier.perks.concierge}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Active Promotions</h3>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Create Promotion
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: 'Double Points Weekend',
                  description: 'Earn 2x points on all stays during weekends',
                  validUntil: '2025-09-30',
                  participants: 247,
                  status: 'active'
                },
                {
                  title: 'Birthday Bonus',
                  description: '500 bonus points on your birthday month',
                  validUntil: 'Ongoing',
                  participants: 189,
                  status: 'active'
                },
                {
                  title: 'Spa Package Points',
                  description: 'Triple points for spa services over €100',
                  validUntil: '2025-10-15',
                  participants: 56,
                  status: 'active'
                },
                {
                  title: 'Referral Reward',
                  description: '1000 points for each successful referral',
                  validUntil: '2025-12-31',
                  participants: 23,
                  status: 'draft'
                }
              ].map((promo, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{promo.title}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {promo.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Valid until: {promo.validUntil}</span>
                        <span className="text-blue-600">{promo.participants} participants</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-600">
                        ✏️
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}