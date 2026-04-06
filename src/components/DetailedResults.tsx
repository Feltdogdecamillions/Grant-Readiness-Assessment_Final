import { CheckCircle2, Award, FileText, Target } from 'lucide-react';

export default function DetailedResults() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Thank You for Your Purchase!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your Grant Readiness Audit is being prepared. You'll receive your detailed analysis within 3 business days.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What Happens Next?</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Detailed Gap Analysis</h3>
                <p className="text-slate-600 text-sm">
                  We'll review your assessment responses and identify exactly what's holding you back from being fully grant-ready. You'll get a comprehensive breakdown of strengths and priority improvements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Prioritized Action Plan</h3>
                <p className="text-slate-600 text-sm">
                  Receive a step-by-step roadmap ranked by impact and ease of implementation. Know exactly what to tackle first to maximize your chances of securing funding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Grant Opportunity Matching</h3>
                <p className="text-slate-600 text-sm">
                  Get 3-5 specific grants matched to your organization's mission, capacity, and readiness level. No more searching blindly through grant databases.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Check Your Email</h3>
          <p className="text-slate-700 text-sm">
            You'll receive a confirmation email shortly with your purchase details. Your personalized audit will be delivered to the same email address within 3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
