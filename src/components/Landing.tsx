import { CheckCircle2, Target, TrendingUp, Settings, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LandingProps {
  onStart: () => void;
  onAdminClick: () => void;
}

export default function Landing({ onStart, onAdminClick }: LandingProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-05-31T23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg sm:text-xl font-bold mb-2">
            🎯 Limited-Time Offer: Get a FREE 30-Minute Grant Strategy Session when you complete your Grant Readiness Assessment. Offer ends May 31, 2026.
          </p>
          <div className="flex justify-center items-center gap-4 text-sm sm:text-base font-semibold">
            <Clock className="w-5 h-5" />
            <div className="flex gap-4">
              <span>{timeLeft.days}d</span>
              <span>{timeLeft.hours}h</span>
              <span>{timeLeft.minutes}m</span>
              <span>{timeLeft.seconds}s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={onAdminClick}
          className="absolute top-20 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
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
            This assessment evaluates your capacity, financial readiness, documentation, systems, and overall preparedness for external funding.
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
                Receive a clear score based on key criteria tied to your funding path.
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
                Identify what your organization is doing well and where improvement is needed.
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
                Get practical recommendations to improve your readiness.
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

          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
            <h4 className="font-bold text-slate-800 mb-4 text-xl">
              Grant Readiness Audit — $97
            </h4>
            <ul className="text-left space-y-2 mb-4">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Comprehensive assessment analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Detailed readiness score by category</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Personalized improvement recommendations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 font-bold">✅ BONUS (Limited Time): Free 30-Minute Strategy Call ($150 value)</span>
              </li>
            </ul>
            <p className="text-sm text-orange-700 font-semibold mb-4">
              ⏰ This bonus is only available for a limited time and will be removed after May 31, 2026.
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={onStart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Assessment + Get Free Strategy Call
            </button>
            <p className="text-slate-500 text-sm mt-4">
              Takes approximately 5-7 minutes to complete
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            What You'll Get During Your Free Strategy Session
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Personalized review of your readiness results</h4>
                <p className="text-slate-600 text-sm">We'll walk through your assessment findings and what they mean for your organization.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Funding path recommendation (grants vs. contracts)</h4>
                <p className="text-slate-600 text-sm">Discover which funding opportunities align best with your current readiness level.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-100 rounded-full p-2 mr-4 mt-1">
                <CheckCircle2 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Immediate next steps to improve your score</h4>
                <p className="text-slate-600 text-sm">Get actionable guidance on exactly what to prioritize to strengthen your funding readiness.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-4 mt-1">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Opportunity to ask questions about your organization</h4>
                <p className="text-slate-600 text-sm">Bring your specific challenges and get expert answers tailored to your situation.</p>
              </div>
            </div>
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
