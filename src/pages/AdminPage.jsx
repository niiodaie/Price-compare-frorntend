import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Edit, Trash2, Clock, Users, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { apiEndpoints } from '../lib/api';
import { formatTimeAgo, getCountryFlag, getCategoryIcon, formatPrice } from '../lib/utils';

export function AdminPage() {
  const { t } = useTranslation();
  const [pendingEntries, setPendingEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Mock stats - in a real app, these would come from the API
  const [stats] = useState({
    pending: 0,
    approved: 1247,
    total: 1259,
    today: 5
  });

  useEffect(() => {
    fetchPendingEntries();
  }, []);

  const fetchPendingEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiEndpoints.getPendingEntries();
      const entries = response.data.data || [];
      setPendingEntries(entries);
      
      // Update pending count in stats
      stats.pending = entries.length;
    } catch (err) {
      console.error('Error fetching pending entries:', err);
      setError(err.message || 'Failed to fetch pending entries');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (entryId) => {
    try {
      setActionLoading(prev => ({ ...prev, [entryId]: 'approving' }));
      
      await apiEndpoints.approveEntry(entryId);
      
      // Remove from pending list
      setPendingEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      // Update stats
      stats.pending -= 1;
      stats.approved += 1;
      stats.total += 1;
      
    } catch (err) {
      console.error('Error approving entry:', err);
      setError(err.message || 'Failed to approve entry');
    } finally {
      setActionLoading(prev => ({ ...prev, [entryId]: null }));
    }
  };

  const handleEdit = (entryId) => {
    // In a real app, this would open an edit modal or navigate to edit page
    console.log('Edit entry:', entryId);
    alert('Edit functionality would be implemented here');
  };

  const handleReject = async (entryId) => {
    try {
      setActionLoading(prev => ({ ...prev, [entryId]: 'rejecting' }));
      
      // In a real app, this would call a reject API endpoint
      await apiEndpoints.deleteEntry(entryId);
      
      // Remove from pending list
      setPendingEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      // Update stats
      stats.pending -= 1;
      
    } catch (err) {
      console.error('Error rejecting entry:', err);
      setError(err.message || 'Failed to reject entry');
    } finally {
      setActionLoading(prev => ({ ...prev, [entryId]: null }));
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
        <p className="text-muted-foreground">
          Manage price submissions and monitor platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('admin.pending')}
                </p>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">
                  {t('admin.submissions')}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('admin.approved')}
                </p>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">
                  {t('admin.entries')}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('admin.total')}
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">
                  {t('admin.entries')}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('admin.today')}
                </p>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-xs text-muted-foreground">
                  {t('admin.new')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-8 border-red-200 bg-red-50 dark:bg-red-950">
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
            <Button
              variant="link"
              className="ml-2 p-0 h-auto text-red-800 dark:text-red-200"
              onClick={fetchPendingEntries}
            >
              {t('common.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.pendingSubmissions')}</CardTitle>
          <CardDescription>
            Review and approve new price submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingEntries.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No pending submissions to review
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Entry Header */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {getCategoryIcon(entry.category)}
                        </span>
                        <h3 className="font-semibold">{entry.name}</h3>
                        <Badge variant="outline">
                          {t(`entry.${entry.type}`)}
                        </Badge>
                        <Badge variant="secondary">
                          {t(`categories.${entry.category}`) || entry.category}
                        </Badge>
                      </div>

                      {/* Entry Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm text-muted-foreground">
                        <div>
                          <strong>Price:</strong> {formatPrice(entry.price, entry.currency)}
                        </div>
                        <div>
                          <strong>Vendor:</strong> {entry.vendor}
                        </div>
                        <div className="flex items-center space-x-1">
                          <strong>Location:</strong>
                          <span>{getCountryFlag(entry.country)}</span>
                          <span>{entry.city}, {entry.country}</span>
                        </div>
                      </div>

                      {/* Link */}
                      {entry.link && (
                        <div className="mb-3 text-sm">
                          <strong>Link:</strong>{' '}
                          <a
                            href={entry.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {entry.link}
                          </a>
                        </div>
                      )}

                      {/* Submission Time */}
                      <p className="text-xs text-muted-foreground">
                        {t('admin.submittedAgo', { time: formatTimeAgo(entry.created_at) })}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(entry.id)}
                        disabled={actionLoading[entry.id]}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading[entry.id] === 'approving' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        <span className="ml-1 hidden sm:inline">
                          {t('admin.approve')}
                        </span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(entry.id)}
                        disabled={actionLoading[entry.id]}
                      >
                        <Edit className="h-3 w-3" />
                        <span className="ml-1 hidden sm:inline">
                          {t('admin.edit')}
                        </span>
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(entry.id)}
                        disabled={actionLoading[entry.id]}
                      >
                        {actionLoading[entry.id] === 'rejecting' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        <span className="ml-1 hidden sm:inline">
                          {t('admin.reject')}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-6">
            <Button variant="outline">
              {t('admin.viewAll')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

