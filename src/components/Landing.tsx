import { CheckCircle2, Target, TrendingUp, Settings, ShieldCheck, ClipboardList, Gauge, Map, Building2 } from 'lucide-react';
import { useState } from 'react';

interface LandingProps {
  onStart: () => void;
  onAdminClick: () => void;
}

export default function Landing({ onStart, onAdminClick }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <button
            onClick={onAdminClick}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Admin Dashboard"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-12">
          <p className="inline-block px-4 py-1 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full mb-4">
            Grant Readiness IQ
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Is Your Organization Actually Ready to Win Grant Funding?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
            Before you spend weeks pursuing grants, discover whether your organization has the
            financial systems, documentation, programs, and capacity funders expect.
          </p>
          <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Complete our grant readiness assessment to uncover strengths, identify critical gaps,
            and understand what your organization should improve before pursuing funding opportunities.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={onStart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Free Assessment
            </button>
            <a
              href="#services"
              className="text-center bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-slate-400 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
            >
              Explore Grant Readiness Services
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-emerald-100 rounded-full p-4 mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Evaluate Your Readiness
              </h3>
              <p className="text-slate-600 text-sm">
                Assess your organization's funding readiness across key operational areas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Identify Weaknesses
              </h3>
              <p className="text-slate-600 text-sm">
                Find gaps that could affect your applications before funders see them.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-amber-100 rounded-full p-4 mb-4">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Get Actionable Steps
              </h3>
              <p className="text-slate-600 text-sm">
                Receive practical recommendations to strengthen your organization.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-slate-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Complete the Assessment</h3>
              <p className="text-slate-600 text-sm">
                Answer questions about your governance, financial systems, compliance, programming, and operational readiness.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-slate-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Receive Your Readiness Score</h3>
              <p className="text-slate-600 text-sm">
                Review an overall readiness score and category-level results based on your responses.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-slate-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Identify Opportunities</h3>
              <p className="text-slate-600 text-sm">
                Discover strengths, documentation gaps, and areas needing attention.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-slate-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Develop Your Action Plan</h3>
              <p className="text-slate-600 text-sm">
                Use your results to prioritize improvements, purchase a detailed audit, or request consulting assistance.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6 text-center">
            <p className="text-sm text-slate-600">
              The readiness assessment is <span className="font-semibold">completely free</span>.
              Optional paid services — a detailed audit and consulting support — are offered after
              you receive your results.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8" id="services">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            What You'll Learn
          </h2>
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-3">
              Assessment Categories:
            </h3>
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
                <span>Documentation &amp; Compliance</span>
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
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-teal-500/20 rounded-full p-3 flex-shrink-0">
              <Building2 className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">
                About Grant Readiness IQ
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Grant Readiness IQ helps nonprofits and mission-driven organizations understand
                their funding readiness, identify organizational gaps, and develop practical
                strategies to compete for grant opportunities with greater confidence.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Grant Readiness IQ is the assessment platform of{' '}
                <span className="font-semibold text-white">FelStev Consulting Group</span>, a
                consulting service line of Discipline Over Doughnuts LLC. Successful grant
                preparation requires more than finding an opportunity and submitting an
                application — organizations must demonstrate clear programs, responsible financial
                management, effective governance, measurable outcomes, and the capacity to manage
                funding requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Important Disclaimer
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                This assessment is an informational, self-evaluation tool. It does not guarantee
                grant awards or funding outcomes, and it does not establish eligibility for any
                specific grant. Funding decisions are made solely by funders based on their own
                criteria. Grant Readiness IQ is operated by FelStev Consulting Group, a service
                line of Discipline Over Doughnuts LLC.
              </p>
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
