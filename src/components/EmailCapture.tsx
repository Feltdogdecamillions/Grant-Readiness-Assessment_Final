import { useState } from 'react';
import { Mail, Loader2, User, Building2, MapPin, HelpCircle, Building } from 'lucide-react';

interface EmailCaptureProps {
  onSubmit: (data: {
    name: string;
    organization: string;
    email: string;
    organizationType: string;
    state: string;
    primaryChallenge: string;
    marketingConsent: boolean;
  }) => void;
}

const ORGANIZATION_TYPES = [
  'Nonprofit 501(c)(3)',
  'Nonprofit (pending status)',
  'Faith-based organization',
  'School or educational program',
  'For-profit business',
  'Government agency',
  'Other',
];

export default function EmailCapture({ onSubmit }: EmailCaptureProps) {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [state, setState] = useState('');
  const [primaryChallenge, setPrimaryChallenge] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!organization.trim()) {
      setError('Please enter your organization name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!organizationType) {
      setError('Please select your organization type');
      return;
    }

    if (!state.trim()) {
      setError('Please enter your state');
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      name: name.trim(),
      organization: organization.trim(),
      email: email.trim(),
      organizationType,
      state: state.trim(),
      primaryChallenge: primaryChallenge.trim(),
      marketingConsent,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Almost There!
            </h2>
            <p className="text-slate-600">
              Enter your information to receive your personalized Grant Readiness Audit results.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-slate-700 mb-2">
                Organization Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Your Organization"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.org"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="organizationType" className="block text-sm font-medium text-slate-700 mb-2">
                Organization Type
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  id="organizationType"
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors bg-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select organization type...</option>
                  {ORGANIZATION_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
                State
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Georgia"
                  maxLength={50}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="primaryChallenge" className="block text-sm font-medium text-slate-700 mb-2">
                Primary Grant Readiness Challenge{' '}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <HelpCircle className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  id="primaryChallenge"
                  value={primaryChallenge}
                  onChange={(e) => setPrimaryChallenge(e.target.value)}
                  placeholder="e.g. We don't have organized financial records yet"
                  rows={3}
                  maxLength={500}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
              <input
                type="checkbox"
                id="marketingConsent"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                disabled={isSubmitting}
              />
              <label htmlFor="marketingConsent" className="text-sm text-slate-600 cursor-pointer">
                Send me Grant Readiness IQ newsletters, resources, and consulting offers.
                Optional — you'll receive your results either way.
              </label>
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'View My Results'
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              We respect your privacy. Your information will only be used to send you your
              assessment results and, if you opt in, resources you've requested.
            </p>
          </form>
        </div>

        <p className="text-center text-slate-600 text-sm mt-6">
          Your responses have been saved. We'll calculate your score and show you detailed insights in the next step.
        </p>
      </div>
    </div>
  );
}
