import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Globe, MapPin, Search, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import { useLocation as useUserLocation } from '../hooks/useLocation';
import { useCurrency } from '../hooks/useCurrency';
import { getCountryFlag, formatPrice } from '../lib/utils';
import { cn } from '../lib/utils';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { location: userLocation } = useUserLocation();
  const { selectedCurrency, getCurrencySymbol } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.submit'), href: '/submit' },
    { name: t('navigation.admin'), href: '/admin' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">
              {t('app.title')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Location, Currency, Theme Toggle */}
          <div className="flex items-center space-x-2">
            {/* Location Indicator */}
            {userLocation && (
              <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="flex items-center space-x-1">
                  <span>{getCountryFlag(userLocation.country_code)}</span>
                  <span>{userLocation.country_code}</span>
                </span>
              </div>
            )}

            {/* Currency Indicator */}
            <div className="hidden sm:flex items-center text-sm text-muted-foreground">
              <span>{t('location.pricesIn', { currency: selectedCurrency })}</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Location/Currency Info */}
              <div className="pt-4 border-t space-y-2">
                {userLocation && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="flex items-center space-x-1">
                      <span>{getCountryFlag(userLocation.country_code)}</span>
                      <span>{userLocation.country}, {userLocation.city}</span>
                    </span>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {t('location.pricesIn', { currency: selectedCurrency })}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

