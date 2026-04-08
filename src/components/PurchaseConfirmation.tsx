import { CheckCircle2, Calendar, AlertCircle, Gift } from 'lucide-react';

export default function PurchaseConfirmation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg p-6 mb-8 text-center">
          <Gift className="w-12 h-12 text-slate-900 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            ✅ Your Free Strategy Session is Included!
          </h2>
          <p className="text-slate-900 text-lg">
            You've unlocked your complimentary 30-minute Grant Strategy Session. Use the link below to schedule your call.
          </p>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Thank You for Your Purchase!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your Grant Readiness Audit will be delivered within 3 business days. Plus, you've unlocked a FREE strategy session!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            What You'll Get During Your Free Strategy Session
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 rounded-full p-2 flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Personalized review of your readiness results</h3>
                <p className="text-slate-600 text-sm">
                  We'll walk through your assessment findings and what they mean for your organization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Funding path recommendation (grants vs. contracts)</h3>
                <p className="text-slate-600 text-sm">
                  Discover which funding opportunities align best with your current readiness level.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 rounded-full p-2 flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Immediate next steps to improve your score</h3>
                <p className="text-slate-600 text-sm">
                  Get actionable guidance on exactly what to prioritize to strengthen your funding readiness.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-full p-2 flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Opportunity to ask questions about your organization</h3>
                <p className="text-slate-600 text-sm">
                  Bring your specific challenges and get expert answers tailored to your situation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-8 text-center">
            <Calendar className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Schedule Your Free Strategy Call</h3>
            <p className="text-slate-700 mb-6">
              Click the button below to access our scheduling calendar and book your 30-minute session at a time that works for you.
            </p>
            <a
              href="https://calendar.app.google/rQGenW5LHczFkE2g7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Schedule My Free Call
            </a>
            <p className="text-slate-600 text-sm mt-4">
              You'll also receive a scheduling link via email
            </p>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-6 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-900">
              ⚠️ Strategy sessions are limited each week. Schedule your call now to secure your spot.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Check Your Email</h3>
          <p className="text-blue-800 text-sm">
            You'll receive a confirmation email with your purchase details, a link to schedule your free strategy call, and your audit will be delivered within 3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
