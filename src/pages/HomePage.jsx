import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { PriceCard } from '../components/PriceCard';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { apiEndpoints } from '../lib/api';
import { debounce } from '../lib/utils';
import { useCurrency } from '../hooks/useCurrency';

export function HomePage() {
  const { t } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    country: '',
    city: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'newest'
  });

  const limit = 20;

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
    setOffset(0);
    setEntries([]);
    fetchEntries(true, term, filters);
  }, 500);

  const fetchEntries = async (reset = false, search = searchTerm, currentFilters = filters) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = {
        limit,
        offset: reset ? 0 : offset,
        currency: selectedCurrency,
        ...(search && { search }),
        ...(currentFilters.type && { type: currentFilters.type }),
        ...(currentFilters.category && { category: currentFilters.category }),
        ...(currentFilters.country && { country: currentFilters.country }),
        ...(currentFilters.city && { city: currentFilters.city }),
      };

      const response = await apiEndpoints.getEntries(params);
      const newEntries = response.data.data || [];

      if (reset) {
        setEntries(newEntries);
        setOffset(newEntries.length);
      } else {
        setEntries(prev => [...prev, ...newEntries]);
        setOffset(prev => prev + newEntries.length);
      }

      setHasMore(newEntries.length === limit);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err.message || 'Failed to fetch entries');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEntries(true);
  }, [selectedCurrency]);

  // Handle search
  const handleSearch = (term) => {
    debouncedSearch(term);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setOffset(0);
    setEntries([]);
    fetchEntries(true, searchTerm, newFilters);
  };

  // Load more entries
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchEntries(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t('app.subtitle')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('app.description')}
        </p>
        
        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          className="max-w-2xl mx-auto"
        />
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        className="mb-8"
      />

      {/* Error State */}
      {error && (
        <Alert className="mb-8">
          <AlertDescription>
            {error}
            <Button
              variant="link"
              className="ml-2 p-0 h-auto"
              onClick={() => fetchEntries(true)}
            >
              {t('common.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {entries.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t('search.noResults')}
          </p>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {entries.map((entry) => (
              <PriceCard key={entry.id} entry={entry} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                size="lg"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('search.loadMore')
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

