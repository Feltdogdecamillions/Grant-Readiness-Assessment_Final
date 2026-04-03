import { CheckCircle2, Target, TrendingUp, Settings } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
  onAdminClick: () => void;
}

export default function Landing({ onStart, onAdminClick }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={onAdminClick}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Admin Dashboard"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Grants Made Simple
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700 mb-6">
            Funding Readiness Assessment
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover whether your organization is prepared to pursue grants, government contracts, or both.
            This assessment helps you evaluate your systems, structure, documentation, and readiness to compete for funding opportunities.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            What You'll Learn:
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-emerald-100 rounded-full p-4 mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">
                Your Readiness Score
              </h4>
              <p className="text-slate-600 text-sm">
                See how prepared your organization is based on key funding-readiness criteria.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">
                Strengths & Gaps
              </h4>
              <p className="text-slate-600 text-sm">
                Understand where you are strong and where you need to improve.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-amber-100 rounded-full p-4 mb-4">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">
                Next Steps
              </h4>
              <p className="text-slate-600 text-sm">
                Get tailored action steps to move closer to funding readiness.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-slate-800 mb-3">
              Assessment Categories:
            </h4>
            <ul className="grid md:grid-cols-2 gap-2 text-slate-700">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Organizational Foundations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Financial Readiness</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Program or Service Readiness</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Documentation & Compliance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Funding Strategy</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Procurement Readiness</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={onStart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Assessment
            </button>
            <p className="text-slate-500 text-sm mt-4">
              Takes approximately 5-7 minutes to complete
            </p>
          </div>
        </div>

        <div className="text-center text-slate-600 text-sm">
          <p>
            This free assessment tool helps organizations make informed decisions about pursuing funding opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
