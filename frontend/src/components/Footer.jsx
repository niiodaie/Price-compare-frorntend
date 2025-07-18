import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    { name: t('navigation.about'), href: '/about' },
    { name: t('navigation.contact'), href: '/contact' },
    { name: t('navigation.submit'), href: '/submit' },
    { name: t('navigation.admin'), href: '/admin' },
    { name: t('navigation.privacy'), href: '/privacy' },
    { name: t('navigation.terms'), href: '/terms' },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          {/* Logo and Description */}
          <div className="flex flex-col items-center space-y-2 md:items-start">
            <Link to="/" className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-primary">
                {t('app.title')}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {t('app.description')}
            </p>
          </div>

          {/* Footer Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('app.title')}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

