import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { apiEndpoints } from '../lib/api';

export function FilterBar({ filters, onFiltersChange, className = "" }) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Fetch categories and countries
    const fetchData = async () => {
      try {
        const [categoriesRes, countriesRes] = await Promise.all([
          apiEndpoints.getCategories(),
          apiEndpoints.getCountries()
        ]);
        
        setCategories(categoriesRes.data.data || []);
        setCountries(countriesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const handlePriceRangeChange = (values) => {
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: '',
      category: '',
      country: '',
      city: '',
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 0 && value !== 1000 && value !== 'newest'
  );

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {/* Filter Toggle Button (Mobile) */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>{t('search.filters')}</span>
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              {t('search.clearFilters')}
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className={`space-y-4 ${!isExpanded ? 'hidden md:block' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('filters.type')}
              </label>
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="product">{t('filters.products')}</SelectItem>
                  <SelectItem value="service">{t('filters.services')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('filters.category')}
              </label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.icon} {t(`categories.${category.name}`) || category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('filters.country')}
              </label>
              <Select
                value={filters.country || 'all'}
                onValueChange={(value) => handleFilterChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('filters.sortBy')}
              </label>
              <Select
                value={filters.sortBy || 'newest'}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('filters.newest')}</SelectItem>
                  <SelectItem value="price">{t('filters.price')}</SelectItem>
                  <SelectItem value="popularity">{t('filters.popularity')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('filters.priceRange')}: ${filters.minPrice || 0} - ${filters.maxPrice || 1000}
            </label>
            <Slider
              value={[filters.minPrice || 0, filters.maxPrice || 1000]}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Clear Filters Button (Desktop) */}
          {hasActiveFilters && (
            <div className="hidden md:flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                {t('search.clearFilters')}
              </Button>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.type && (
                <Badge variant="secondary">
                  {t(`filters.${filters.type}`)}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('type', '')}
                  />
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary">
                  {t(`categories.${filters.category}`) || filters.category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('category', '')}
                  />
                </Badge>
              )}
              {filters.country && (
                <Badge variant="secondary">
                  {filters.country}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('country', '')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

