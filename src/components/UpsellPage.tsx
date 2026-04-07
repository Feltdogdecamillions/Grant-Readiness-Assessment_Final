import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { pricingTiers } from '../config/pricing';

interface UpsellPageProps {
  onUpgrade: (tierId: string) => void;
  onContinue: () => void;
}

export default function UpsellPage({ onUpgrade, onContinue }: UpsellPageProps) {
  const auditTier = pricingTiers.find(t => t.id === 'strategy-audit');
  const sessionTier = pricingTiers.find(t => t.id === 'strategy-session');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Your Action Plan is Ready!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Check your email for your Funding Readiness Action Plan. While you're here, consider upgrading to get even more value.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold">Upgrade Your Results</h2>
          </div>
          <p className="text-blue-100 text-lg mb-8">
            You've taken the first step with your Action Plan. Now accelerate your progress with personalized grant matching and expert guidance.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {auditTier && (
              <div className="bg-white rounded-xl p-8 text-slate-900">
                <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">{auditTier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${auditTier.price}</span>
                </div>
                <p className="text-slate-600 text-sm mb-6">
                  {auditTier.description}
                </p>

                <div className="space-y-3 mb-6">
                  {auditTier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-700 text-sm">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
                  <p className="text-sm font-bold text-amber-900 text-center mb-2">
                    🎁 Your free 30-minute strategy session is included (limited to 10 spots per week).
                  </p>
                  <p className="text-xs text-amber-800 text-center">
                    Must purchase before May 31, 2026
                  </p>
                </div>

                <button
                  onClick={() => onUpgrade(auditTier.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg transition-all mb-2"
                >
                  Upgrade to Audit
                </button>

                <p className="text-xs text-slate-600 text-center font-medium">
                  Limited weekly availability — secure your spot now.
                </p>
              </div>
            )}

            {sessionTier && (
              <div className="bg-white rounded-xl p-8 text-slate-900 border-2 border-slate-700">
                <div className="bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  PREMIUM
                </div>
                <h3 className="text-2xl font-bold mb-2">{sessionTier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${sessionTier.price}</span>
                </div>
                <p className="text-slate-600 text-sm mb-6">
                  {sessionTier.description}
                </p>

                <div className="space-y-3 mb-6">
                  {sessionTier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-700 text-sm">{feature}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onUpgrade(sessionTier.id)}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg transition-all"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            No thanks, continue to my results
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
