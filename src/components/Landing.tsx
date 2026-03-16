import { CheckCircle2, Target, TrendingUp } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Grants Made Simple
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700 mb-6">
            Grant Readiness Assessment
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover if your nonprofit organization is ready to pursue grant funding.
            This comprehensive assessment evaluates your organizational capacity,
            financial systems, and program development.
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
                Get a comprehensive score from 0-100 based on 25 key criteria
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
                Identify what you're doing well and areas for improvement
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
                Receive actionable recommendations to improve your readiness
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-slate-800 mb-3">
              Assessment Categories:
            </h4>
            <ul className="space-y-2 text-slate-700">
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
                <span>Program Design</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Organizational Documentation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Grant Management Capacity</span>
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
            This free assessment tool helps nonprofits make informed decisions about pursuing grant funding.
          </p>
        </div>
      </div>
    </div>
  );
}
