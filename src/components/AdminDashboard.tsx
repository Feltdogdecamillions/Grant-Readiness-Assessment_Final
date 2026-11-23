import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Download, ArrowLeft, RefreshCw, Tag } from 'lucide-react';

interface Assessment {
  id: string;
  name: string;
  email: string;
  organization: string;
  score: number;
  created_at: string;
  responses: boolean[];
  lead_details?: {
    organization_type?: string;
    state?: string;
    primary_challenge?: string;
  } | null;
  marketing_consent?: boolean;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

  const [promo, setPromo] = useState({
    promoEnabled: true,
    promoPriceCents: 0,
    regularPriceCents: 9700,
    promoStartDate: '2026-11-18',
    promoEndDate: '2027-01-31',
  });
  const [promoSaving, setPromoSaving] = useState(false);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid password');
    }
  };

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssessments(data || []);
    } catch (err) {
      setError('Failed to load assessments. Make sure you have admin access.');
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssessments();
      fetchPromotionSettings();
    }
  }, [isAuthenticated]);

  const fetchPromotionSettings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-promotion-settings`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ADMIN_PASSWORD}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) return;
      const { settings } = await response.json();
      if (settings) {
        setPromo({
          promoEnabled: settings.promo_enabled,
          promoPriceCents: settings.promo_price_cents,
          regularPriceCents: settings.regular_price_cents,
          promoStartDate: settings.promo_starts_at.slice(0, 10),
          promoEndDate: settings.promo_ends_at.slice(0, 10),
        });
      }
    } catch (err) {
      console.error('Error loading promotion settings:', err);
    }
  };

  const savePromotionSettings = async () => {
    setPromoSaving(true);
    setPromoMessage(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-promotion-settings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ADMIN_PASSWORD}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            promoEnabled: promo.promoEnabled,
            promoPriceCents: promo.promoPriceCents,
            regularPriceCents: promo.regularPriceCents,
            promoStartDate: promo.promoStartDate,
            promoEndDate: promo.promoEndDate,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        setPromoMessage(result.error || 'Failed to save promotion settings.');
      } else {
        setPromoMessage('Promotion settings saved. Pricing updates apply immediately.');
      }
    } catch {
      setPromoMessage('Failed to save promotion settings.');
    } finally {
      setPromoSaving(false);
    }
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Organization', 'Organization Type', 'State', 'Primary Challenge', 'Marketing Consent', 'Score', 'Date'];
    const csvContent = [
      headers.join(','),
      ...assessments.map(a => [
        `"${a.name}"`,
        `"${a.email}"`,
        `"${a.organization}"`,
        `"${a.lead_details?.organization_type || ''}"`,
        `"${a.lead_details?.state || ''}"`,
        `"${(a.lead_details?.primary_challenge || '').replace(/"/g, '""')}"`,
        a.marketing_consent ? 'Yes' : 'No',
        a.score,
        new Date(a.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assessments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Login</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <button
                onClick={onBack}
                className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Assessment
              </button>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">
                {assessments.length} total submission{assessments.length !== 1 ? 's' : ''}
              </p>

              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-2xl">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  Promotion &amp; Pricing Settings
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={promo.promoEnabled}
                      onChange={(e) => setPromo({ ...promo, promoEnabled: e.target.checked })}
                      className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">Promotion enabled</span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Promo start date (Eastern Time)</label>
                      <input
                        type="date"
                        value={promo.promoStartDate}
                        onChange={(e) => setPromo({ ...promo, promoStartDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Promo end date (Eastern Time)</label>
                      <input
                        type="date"
                        value={promo.promoEndDate}
                        onChange={(e) => setPromo({ ...promo, promoEndDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Promotional price ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={promo.promoPriceCents / 100}
                        onChange={(e) => setPromo({ ...promo, promoPriceCents: Math.round(Number(e.target.value) * 100) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Regular price ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={promo.regularPriceCents / 100}
                        onChange={(e) => setPromo({ ...promo, regularPriceCents: Math.round(Number(e.target.value) * 100) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    onClick={savePromotionSettings}
                    disabled={promoSaving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {promoSaving ? 'Saving...' : 'Save Promotion Settings'}
                  </button>
                  {promoMessage && (
                    <p className={`text-sm ${promoMessage.startsWith('Promotion settings saved') ? 'text-emerald-700' : 'text-red-600'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchAssessments}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={assessments.length === 0}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 mt-4">Loading assessments...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No assessments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Organization</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">State</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Primary Challenge</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Marketing</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => (
                    <tr
                      key={assessment.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-900">{assessment.name}</td>
                      <td className="py-3 px-4 text-slate-700">{assessment.email}</td>
                      <td className="py-3 px-4 text-slate-700">{assessment.organization}</td>
                      <td className="py-3 px-4 text-slate-700">{assessment.lead_details?.organization_type || '—'}</td>
                      <td className="py-3 px-4 text-slate-700">{assessment.lead_details?.state || '—'}</td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs">{assessment.lead_details?.primary_challenge || '—'}</td>
                      <td className="py-3 px-4">
                        {assessment.marketing_consent ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Opted in</span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          assessment.score >= 80 ? 'bg-green-100 text-green-800' :
                          assessment.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assessment.score}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(assessment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
