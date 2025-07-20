import { useState, useEffect } from 'react';
import { apiEndpoints } from '../lib/api';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if location is cached in localStorage
        const cachedLocation = localStorage.getItem('user_location');
        if (cachedLocation) {
          const parsed = JSON.parse(cachedLocation);
          // Check if cache is less than 1 hour old
          const cacheTime = new Date(parsed.timestamp);
          const now = new Date();
          const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 1) {
            setLocation(parsed.data);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh location data
        const response = await apiEndpoints.getLocation();
        const locationData = response.data.data;
        
        // Cache the location data
        localStorage.setItem('user_location', JSON.stringify({
          data: locationData,
          timestamp: new Date().toISOString()
        }));
        
        setLocation(locationData);
      } catch (err) {
        console.error('Error fetching location:', err);
        setError(err.message);
        
        // Fallback to default location
        setLocation({
          country: 'United States',
          country_code: 'US',
          city: 'New York',
          suggested_currency: 'USD'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('user_location', JSON.stringify({
      data: newLocation,
      timestamp: new Date().toISOString()
    }));
  };

  return {
    location,
    loading,
    error,
    updateLocation
  };
}

