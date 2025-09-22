// Date utilities
export const formatDate = (date: Date | string, locale: string = 'en-US'): string => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string, locale: string = 'en-US'): string => {
  const d = new Date(date);
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateNights = (checkIn: Date | string, checkOut: Date | string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Currency utilities
export const formatCurrency = (amount: number, currency: string = 'EUR', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

export const calculateVAT = (amount: number, vatRate: number = 0.19): number => {
  return amount * vatRate;
};

export const calculateTourismTax = (nights: number, guests: number, taxPerPersonPerNight: number = 1.5): number => {
  return nights * guests * taxPerPersonPerNight;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateId = (prefix?: string): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${randomPart}` : `${timestamp}-${randomPart}`;
};

// API utilities
export const buildApiUrl = (endpoint: string, baseUrl?: string): string => {
  const base = baseUrl || (process.env.NODE_ENV === 'production'
    ? 'https://api.pms.com'
    : 'http://localhost:5000');
  return `${base}/api/v1${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export const createAuthHeaders = (token: string): Record<string, string> => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};