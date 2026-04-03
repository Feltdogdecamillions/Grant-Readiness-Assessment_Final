import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface ProcurementResultsProps {
  score: number;
  responses: string[];
  scoreLevel: {
    level: string;
    color: string;
    description: string;
  };
  categoryScores: Array<{
    category: string;
    points: number;
    maxPoints: number;
  }>;
  strengths: string[];
  improvements: Array<{
    category: string;
    question: string;
  }>;
}

export default function ProcurementResults({
  score,
  scoreLevel,
  categoryScores,
  strengths,
  improvements
}: ProcurementResultsProps) {
  const answeredOptimally = strengths.length;
  const needsWork = improvements.length;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Procurement Readiness Score</h2>
          <p className="text-slate-600">Assessment completed on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <svg className="w-56 h-56 transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="#e2e8f0"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke={`${scoreLevel.color === 'emerald' ? '#10b981' : scoreLevel.color === 'amber' ? '#f59e0b' : '#3b82f6'}`}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * (1 - score / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-6xl font-bold text-slate-900">{score}</div>
                  <div className="text-sm text-slate-600">out of 100</div>
                </div>
              </div>
            </div>
            <h3 className={`text-3xl font-bold mb-2 ${scoreLevel.color === 'emerald' ? 'text-emerald-600' : scoreLevel.color === 'amber' ? 'text-amber-600' : 'text-blue-600'}`}>
              {scoreLevel.level}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {scoreLevel.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h3 className="font-semibold text-slate-900">Strong Areas</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-600">{answeredOptimally}</p>
              <p className="text-sm text-slate-600">Areas where you excel</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <h3 className="font-semibold text-slate-900">Growth Areas</h3>
              </div>
              <p className="text-4xl font-bold text-amber-600">{needsWork}</p>
              <p className="text-sm text-slate-600">Areas to develop</p>
            </div>
          </div>
        </div>

        <div className={`mt-6 p-6 rounded-xl border-2 ${
          score >= 75 ? 'bg-emerald-50 border-emerald-200' :
          score >= 50 ? 'bg-amber-50 border-amber-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <h4 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
            <AlertCircle className={`w-5 h-5 ${
              score >= 75 ? 'text-emerald-600' :
              score >= 50 ? 'text-amber-600' :
              'text-blue-600'
            }`} />
            Understanding Your Score
          </h4>
          <div className="space-y-3 text-slate-700">
            {score >= 75 ? (
              <>
                <p className="font-semibold text-emerald-800">
                  75–100: Your business appears procurement ready and positioned to compete for government contracts.
                </p>
                <p className="text-sm leading-relaxed">
                  Businesses in this range typically have proper registration, documentation, past performance, and operational capacity. You can actively pursue opportunities that match your capabilities and certifications.
                </p>
              </>
            ) : score >= 50 ? (
              <>
                <p className="font-semibold text-amber-800">
                  50–74: Your business has foundational elements but should strengthen key systems before aggressively pursuing contracts.
                </p>
                <p className="text-sm leading-relaxed">
                  Businesses in this range have made progress but have gaps to address. Focus on completing SAM.gov registration, building documentation, and improving your capability statement. Consider starting with subcontracting opportunities while building capacity.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-blue-800">
                  0–49: Your business is in the early stages and should build foundation before pursuing competitive contracts.
                </p>
                <p className="text-sm leading-relaxed">
                  Businesses in this range need to establish core infrastructure including registration, documentation, and operational systems. This is normal for newer businesses. Focus on SAM.gov registration, capability statement development, and building past performance through smaller opportunities.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-blue-600" />
          Category Performance
        </h3>
        <div className="space-y-6">
          {categoryScores.map((cat) => {
            const percentage = (cat.points / cat.maxPoints) * 100;
            return (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg">{cat.category}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{cat.points}</div>
                    <div className="text-sm text-slate-600">of {cat.maxPoints} points</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      percentage >= 80 ? 'bg-emerald-600' :
                      percentage >= 60 ? 'bg-blue-500' :
                      percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {strengths.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            Your Strengths ({strengths.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 text-sm">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {improvements.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-7 h-7 text-amber-600" />
            Action Items ({improvements.length})
          </h3>
          <div className="space-y-3">
            {improvements.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded border-2 border-slate-400 bg-white mt-0.5"></div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-700 uppercase mb-1">{item.category}</p>
                  <p className="text-slate-700">{item.question}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
