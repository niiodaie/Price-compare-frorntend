import { useTranslation } from 'react-i18next';
import { ExternalLink, MapPin, Store } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatPrice, getCountryFlag, getCategoryIcon } from '../lib/utils';
import { useCurrency } from '../hooks/useCurrency';

export function PriceCard({ entry }) {
  const { t } = useTranslation();
  const { selectedCurrency, getCurrencySymbol } = useCurrency();

  // Use converted price if available, otherwise original price
  const displayPrice = entry.converted_price || entry.price;
  const displayCurrency = entry.target_currency || entry.currency;
  
  const handleViewDeal = () => {
    if (entry.link) {
      window.open(entry.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        {/* Header with icon and name */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-lg">{getCategoryIcon(entry.category)}</span>
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {entry.name}
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {t(`categories.${entry.category}`) || entry.category}
          </Badge>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(displayPrice, displayCurrency)}
          </div>
          {entry.converted_price && entry.currency !== displayCurrency && (
            <div className="text-xs text-muted-foreground">
              {t('currency.convertedFrom', { currency: entry.currency })}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 mb-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="flex items-center space-x-1">
            <span>{getCountryFlag(entry.country)}</span>
            <span>{entry.city}, {entry.country}</span>
          </span>
        </div>

        {/* Vendor */}
        <div className="flex items-center space-x-1 mb-4 text-sm text-muted-foreground">
          <Store className="h-3 w-3" />
          <span>{entry.vendor}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleViewDeal}
          disabled={!entry.link}
          className="w-full"
          size="sm"
        >
          {entry.link ? (
            <>
              <ExternalLink className="h-3 w-3 mr-1" />
              {t('entry.viewDeal')}
            </>
          ) : (
            t('entry.viewDeal')
          )}
        </Button>

        {/* Type Badge */}
        <div className="mt-2 flex justify-center">
          <Badge variant="outline" className="text-xs">
            {t(`entry.${entry.type}`)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

