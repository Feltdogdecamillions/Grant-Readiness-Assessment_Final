import { CheckCircle2, Calendar, Clock, Video } from 'lucide-react';

export default function ScheduleSession() {
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
            You're all set for your Funding Strategy Session. Let's get your 30-minute strategy call scheduled.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What You'll Receive</h2>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Complete Funding Strategy Audit</h3>
                <p className="text-slate-600 text-sm">
                  Detailed gap analysis, prioritized action plan, grant opportunity matching, and personalized funding strategy recommendations delivered within 3 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">30-Minute 1:1 Strategy Call</h3>
                <p className="text-slate-600 text-sm">
                  Work directly with a funding expert to review your audit, ask questions, and develop a customized roadmap for securing grants or contracts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Custom Implementation Guidance</h3>
                <p className="text-slate-600 text-sm">
                  Get specific next steps tailored to your organization's unique situation and timeline.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-8 text-center">
            <Calendar className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Schedule Your Strategy Call</h3>
            <p className="text-slate-700 mb-6">
              Click the button below to access our scheduling calendar and book your 30-minute session at a time that works for you.
            </p>
            <a
              href="#"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your Strategy Call Now
            </a>
            <p className="text-slate-600 text-sm mt-4">
              You'll also receive a scheduling link via email
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Check Your Email</h3>
          <p className="text-blue-800 text-sm">
            You'll receive a confirmation email with your purchase details and a link to schedule your call. Your audit will be delivered within 3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
