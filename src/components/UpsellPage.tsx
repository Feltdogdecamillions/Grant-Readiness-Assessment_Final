import { useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { pricingTiers, bookPreOrder } from '../config/pricing';

interface UpsellPageProps {
  onUpgrade: (tierId: string, includeBook?: boolean) => void;
  onContinue: () => void;
}

export default function UpsellPage({ onUpgrade, onContinue }: UpsellPageProps) {
  const auditTier = pricingTiers.find(t => t.id === 'strategy-audit');
  const sessionTier = pricingTiers.find(t => t.id === 'strategy-session');
  const [includeBook, setIncludeBook] = useState(false);

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

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeBook}
                onChange={(e) => setIncludeBook(e.target.checked)}
                className="mt-1 w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-lg">
                    📘 Pre-Order: {bookPreOrder.name} (Releases {bookPreOrder.releaseDate})
                  </h4>
                </div>
                <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                  {bookPreOrder.description}
                </p>
                <div className="space-y-2 mb-4">
                  {bookPreOrder.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-700 text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-emerald-700">${bookPreOrder.price}</span>
                  <span className="text-sm text-slate-600">pre-order price</span>
                  {bookPreOrder.futurePrice && (
                    <span className="text-sm text-slate-500 line-through">${bookPreOrder.futurePrice} after launch</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Lock in early access before the official release on {bookPreOrder.releaseDate}.
                </p>
                <p className="text-xs text-slate-600 italic">
                  You will receive your digital copy (PDF) via email on {bookPreOrder.releaseDate}.
                </p>
              </div>
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {auditTier && (
              <div className="bg-white rounded-xl p-8 text-slate-900">
                <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">{auditTier.name}</h3>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${auditTier.price}</span>
                    {includeBook && (
                      <span className="text-sm text-slate-600">+ ${bookPreOrder.price}</span>
                    )}
                  </div>
                  {includeBook && (
                    <p className="text-sm font-semibold text-emerald-700 mt-1">
                      Total: ${auditTier.price + bookPreOrder.price}
                    </p>
                  )}
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
                  onClick={() => onUpgrade(auditTier.id, includeBook)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg transition-all mb-2"
                >
                  {includeBook ? `Upgrade to Audit + Book ($${auditTier.price + bookPreOrder.price})` : 'Upgrade to Audit'}
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${sessionTier.price}</span>
                    {includeBook && (
                      <span className="text-sm text-slate-600">+ ${bookPreOrder.price}</span>
                    )}
                  </div>
                  {includeBook && (
                    <p className="text-sm font-semibold text-emerald-700 mt-1">
                      Total: ${sessionTier.price + bookPreOrder.price}
                    </p>
                  )}
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
                  onClick={() => onUpgrade(sessionTier.id, includeBook)}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg transition-all"
                >
                  {includeBook ? `Upgrade to Premium + Book ($${sessionTier.price + bookPreOrder.price})` : 'Upgrade to Premium'}
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
