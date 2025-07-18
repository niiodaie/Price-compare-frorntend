import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { apiEndpoints } from '../lib/api';
import { useLocation } from '../hooks/useLocation';
import { useCurrency } from '../hooks/useCurrency';
import { isValidUrl } from '../lib/utils';

export function SubmitPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { location: userLocation } = useLocation();
  const { currencies, selectedCurrency } = useCurrency();
  
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'product',
    category: '',
    price: '',
    currency: selectedCurrency,
    vendor: '',
    country: userLocation?.country || '',
    city: userLocation?.city || '',
    link: ''
  });

  const [errors, setErrors] = useState({});

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
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);

  // Update form data when user location changes
  useEffect(() => {
    if (userLocation) {
      setFormData(prev => ({
        ...prev,
        country: prev.country || userLocation.country,
        city: prev.city || userLocation.city,
        currency: prev.currency || userLocation.suggested_currency || selectedCurrency
      }));
    }
  }, [userLocation, selectedCurrency]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      await apiEndpoints.createEntry(submitData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        type: 'product',
        category: '',
        price: '',
        currency: selectedCurrency,
        vendor: '',
        country: userLocation?.country || '',
        city: userLocation?.city || '',
        link: ''
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('Error submitting entry:', err);
      setError(err.response?.data?.error || t('submit.form.error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t('submit.form.success')}
            </AlertDescription>
          </Alert>
          <p className="text-center text-muted-foreground mt-4">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('submit.title')}</h1>
          <p className="text-muted-foreground">{t('submit.subtitle')}</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('submit.title')}</CardTitle>
            <CardDescription>
              {t('submit.note')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">{t('submit.form.name')} *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('submit.form.namePlaceholder')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <Label>{t('submit.form.type')} *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product" id="product" />
                    <Label htmlFor="product">{t('entry.product')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="service" id="service" />
                    <Label htmlFor="service">{t('entry.service')}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">{t('submit.form.category')} *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {t(`categories.${category.name}`) || category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Price and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">{t('submit.form.price')} *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="currency">{t('submit.form.currency')} *</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vendor */}
              <div>
                <Label htmlFor="vendor">{t('submit.form.vendor')} *</Label>
                <Input
                  id="vendor"
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  placeholder={t('submit.form.vendorPlaceholder')}
                  className={errors.vendor ? 'border-red-500' : ''}
                />
                {errors.vendor && (
                  <p className="text-sm text-red-500 mt-1">{errors.vendor}</p>
                )}
              </div>

              {/* Country and City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">{t('submit.form.country')} *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">{t('submit.form.city')} *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder={t('submit.form.cityPlaceholder')}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Link */}
              <div>
                <Label htmlFor="link">{t('submit.form.link')}</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder={t('submit.form.linkPlaceholder')}
                  className={errors.link ? 'border-red-500' : ''}
                />
                {errors.link && (
                  <p className="text-sm text-red-500 mt-1">{errors.link}</p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('submit.form.submitting')}
                  </>
                ) : (
                  t('submit.form.submit')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

