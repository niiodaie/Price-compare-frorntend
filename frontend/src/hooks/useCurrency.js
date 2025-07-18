import { useState, useEffect } from 'react';
import { apiEndpoints } from '../lib/api';

export function useCurrency() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiEndpoints.getCurrencies();
        setCurrencies(response.data.data);
        
        // Set currency from localStorage or location
        const savedCurrency = localStorage.getItem('selected_currency');
        if (savedCurrency) {
          setSelectedCurrency(savedCurrency);
        }
      } catch (err) {
        console.error('Error fetching currencies:', err);
        setError(err.message);
        
        // Fallback currencies
        setCurrencies([
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' },
          { code: 'GBP', name: 'British Pound', symbol: '£' },
          { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const updateCurrency = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    localStorage.setItem('selected_currency', currencyCode);
  };

  const convertPrice = async (amount, fromCurrency, toCurrency = selectedCurrency) => {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    try {
      const response = await apiEndpoints.convertCurrency({
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency
      });
      
      return response.data.data.converted_amount;
    } catch (err) {
      console.error('Error converting currency:', err);
      return amount; // Return original amount if conversion fails
    }
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  };

  return {
    currencies,
    selectedCurrency,
    loading,
    error,
    updateCurrency,
    convertPrice,
    getCurrencySymbol
  };
}

