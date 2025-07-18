import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function SearchBar({ onSearch, placeholder, className = "" }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Optional: Trigger search on every keystroke with debouncing
    // This would require implementing debouncing in the parent component
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder || t('search.placeholder')}
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 pr-20"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          {t('search.button')}
        </Button>
      </div>
    </form>
  );
}

