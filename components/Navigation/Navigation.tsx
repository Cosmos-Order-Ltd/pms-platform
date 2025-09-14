'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import {
  Bars3Icon,
  BanknotesIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  HomeIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Reservations',
      href: '/reservations',
      icon: CalendarDaysIcon,
      children: [
        { name: 'All Reservations', href: '/reservations', icon: CalendarDaysIcon },
        { name: 'New Reservation', href: '/reservations/new', icon: CalendarDaysIcon },
      ],
    },
    {
      name: 'Rooms',
      href: '/rooms',
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Guests',
      href: '/guests',
      icon: UsersIcon,
      children: [
        { name: 'Guest Management', href: '/guests', icon: UsersIcon },
        { name: 'Guest Portal', href: '/guest-portal', icon: UsersIcon },
        { name: 'Loyalty Program', href: '/loyalty', icon: StarIcon },
        { name: 'Reviews', href: '/reviews', icon: StarIcon },
      ],
    },
    {
      name: 'Operations',
      href: '/operations',
      icon: CogIcon,
      children: [
        { name: 'Operations Dashboard', href: '/operations', icon: CogIcon },
        { name: 'Housekeeping', href: '/housekeeping', icon: BuildingOfficeIcon },
        { name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon },
        { name: 'Tasks', href: '/tasks', icon: DocumentTextIcon },
        { name: 'Inventory', href: '/inventory', icon: DocumentTextIcon },
      ],
    },
    {
      name: 'Analytics & Reports',
      href: '/analytics',
      icon: ChartBarIcon,
      children: [
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Business Intelligence', href: '/business-intelligence', icon: ChartBarIcon },
        { name: 'Forecasting', href: '/forecasting', icon: ChartBarIcon },
        { name: 'Financial Reports', href: '/reports/financial', icon: BanknotesIcon },
        { name: 'Guest Reports', href: '/reports/guests', icon: UsersIcon },
        { name: 'Performance Reports', href: '/reports/performance', icon: ChartBarIcon },
        { name: 'Operational Reports', href: '/reports/operational', icon: CogIcon },
        { name: 'Report Builder', href: '/reports/builder', icon: DocumentTextIcon },
      ],
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: BanknotesIcon,
    },
    {
      name: 'Communications',
      href: '/communications',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'Services',
      href: '/services',
      icon: UserGroupIcon,
    },
    {
      name: 'Staff',
      href: '/staff',
      icon: UserGroupIcon,
    },
    {
      name: 'Integrations',
      href: '/integrations/channels',
      icon: CogIcon,
      children: [
        { name: 'Channel Manager', href: '/integrations/channels', icon: CogIcon },
        { name: 'API Management', href: '/api-management', icon: CogIcon },
        { name: 'Automation', href: '/automation', icon: CogIcon },
      ],
    },
    {
      name: 'Compliance',
      href: '/compliance',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Mobile',
      href: '/mobile',
      icon: DevicePhoneMobileIcon,
    },
    {
      name: 'Admin',
      href: '/admin',
      icon: CogIcon,
    },
  ];

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const isActivePath = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const hasActiveChild = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some(child => isActivePath(child.href));
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const Icon = item.icon;
    const isActive = isActivePath(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.has(item.name);
    const hasActiveChildren = hasActiveChild(item.children);

    return (
      <div key={item.name}>
        <div className="flex items-center">
          <Link
            href={item.href}
            className={`flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive || hasActiveChildren
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${isChild ? 'ml-6' : ''}`}
          >
            <Icon className={`mr-3 h-5 w-5 ${isActive || hasActiveChildren ? 'text-blue-700' : 'text-gray-400'}`} />
            {item.name}
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleSection(item.name)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
        {hasChildren && (isExpanded || hasActiveChildren) && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">🇨🇾</div>
            <span className="ml-2 text-xl font-bold text-gray-900">Cyprus PMS</span>
          </Link>
        </div>

        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-1 px-4 py-6 space-y-1">
            {navItems.map(item => renderNavItem(item))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <div className="font-semibold">Cyprus PMS</div>
              <div>Property Management System</div>
              <div className="mt-1">v2.0.0</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content wrapper - adds margin for desktop sidebar */}
      <div className="lg:ml-64">
        {/* Mobile top padding */}
        <div className="lg:hidden h-16" />
      </div>
    </>
  );
};

export default Navigation;