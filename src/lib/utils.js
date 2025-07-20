import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format price with currency symbol
export function formatPrice(price, currency = 'USD') {
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'INR': '₹',
    'BRL': 'R$',
    'KRW': '₩',
    'CNY': '¥',
    'MXN': '$',
    'CHF': 'CHF',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr',
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format number with appropriate decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return `${symbol}${formattedPrice}`;
}

// Get country flag emoji
export function getCountryFlag(countryCode) {
  const flagMap = {
    'US': '🇺🇸',
    'CA': '🇨🇦',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'IT': '🇮🇹',
    'ES': '🇪🇸',
    'NL': '🇳🇱',
    'JP': '🇯🇵',
    'AU': '🇦🇺',
    'NZ': '🇳🇿',
    'CH': '🇨🇭',
    'SE': '🇸🇪',
    'NO': '🇳🇴',
    'DK': '🇩🇰',
    'CN': '🇨🇳',
    'IN': '🇮🇳',
    'BR': '🇧🇷',
    'MX': '🇲🇽',
    'AR': '🇦🇷',
    'KR': '🇰🇷',
    'SG': '🇸🇬',
    'ZA': '🇿🇦',
    'RU': '🇷🇺',
    'TR': '🇹🇷',
    'PL': '🇵🇱',
    'CZ': '🇨🇿',
    'HU': '🇭🇺',
    'TH': '🇹🇭',
    'MY': '🇲🇾',
    'ID': '🇮🇩',
    'PH': '🇵🇭',
    'VN': '🇻🇳',
    'EG': '🇪🇬',
    'NG': '🇳🇬',
    'KE': '🇰🇪',
    'GH': '🇬🇭',
    'IL': '🇮🇱',
    'AE': '🇦🇪',
    'SA': '🇸🇦'
  };

  return flagMap[countryCode] || '🌍';
}

// Get category icon
export function getCategoryIcon(category) {
  const iconMap = {
    'Electronics': '📱',
    'Computers': '💻',
    'Phones': '📱',
    'Laptops': '💻',
    'Groceries': '🛒',
    'Food': '🍕',
    'Haircuts': '✂️',
    'Cleaning': '🧽',
    'Delivery': '🚚',
    'Freelancers': '💼',
    'Tutoring': '📚',
    'Medical': '🏥',
    'Legal Services': '⚖️',
    'Transportation': '🚗',
    'Accommodation': '🏠',
    'Entertainment': '🎬'
  };

  return iconMap[category] || '📦';
}

// Format time ago
export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

// Debounce function for search
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Validate URL
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

