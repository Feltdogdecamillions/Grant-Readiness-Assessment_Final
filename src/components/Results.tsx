import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RefreshCw, Download, TrendingUp, Share2, Mail, Copy, Check } from 'lucide-react';
import { questions, categories } from '../data/questions';
import ShareableCard from './ShareableCard';
import { PathwayRoute } from '../utils/routingLogic';

interface ResultsProps {
  score: number;
  responses: boolean[];
  name: string;
  organization: string;
  email: string;
  onRestart: () => void;
  pathway?: PathwayRoute | null;
}

export default function Results({ score, responses, name, organization, email, onRestart }: ResultsProps) {
  const getScoreLevel = (score: number) => {
    if (score >= 71) return { level: 'Grant Ready', color: 'emerald', description: 'Your organization is well-prepared for grant applications' };
    if (score >= 41) return { level: 'Partially Ready', color: 'amber', description: 'Your organization has a foundation but needs to strengthen several areas before pursuing grants' };
    return { level: 'Not Grant Ready', color: 'red', description: 'Significant preparation is needed before grant applications' };
  };

  const getCategoryScores = () => {
    const categoryData: { [key: string]: { yes: number; total: number } } = {};

    categories.forEach(cat => {
      categoryData[cat] = { yes: 0, total: 0 };
    });

    questions.forEach((q, index) => {
      categoryData[q.category].total++;
      if (responses[index]) {
        categoryData[q.category].yes++;
      }
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      score: data.yes * 4,
      points: data.yes * 4,
      maxPoints: data.total * 4,
      yes: data.yes,
      total: data.total
    }));
  };

  const getStrengths = () => {
    const strengths: string[] = [];
    questions.forEach((q, index) => {
      if (responses[index]) {
        strengths.push(q.text);
      }
    });
    return strengths;
  };

  const getImprovementAreas = () => {
    const improvements: { category: string; question: string }[] = [];
    questions.forEach((q, index) => {
      if (!responses[index]) {
        improvements.push({ category: q.category, question: q.text });
      }
    });
    return improvements;
  };

  const getRecommendations = () => {
    const categoryScores = getCategoryScores();
    const recommendations = [];

    const weakCategories = categoryScores.filter(cat => cat.score < 16).sort((a, b) => a.score - b.score);

    if (weakCategories.length > 0) {
      weakCategories.forEach(cat => {
        if (cat.category === 'Organizational Foundations') {
          recommendations.push('Strengthen your organizational foundation by ensuring you have 501(c)(3) status or fiscal sponsor, an active board, and current governance documents.');
        } else if (cat.category === 'Financial Readiness') {
          recommendations.push('Improve financial systems by establishing a budget, producing regular financial statements, and implementing internal controls.');
        } else if (cat.category === 'Program Design') {
          recommendations.push('Develop clearly defined programs that address documented community needs with specific, measurable goals and outcomes.');
        } else if (cat.category === 'Organizational Documentation') {
          recommendations.push('Build comprehensive documentation including strategic plans, organizational charts, staff bios, and community partnership letters.');
        } else if (cat.category === 'Grant Management Capacity') {
          recommendations.push('Establish grant management systems including dedicated staff, tracking calendars, budget monitoring, and compliance documentation.');
        }
      });
    }

    if (score >= 71) {
      recommendations.push('Your organization is ready to begin pursuing grant opportunities.');
      recommendations.push('Consider starting with local foundation grants that align with your mission.');
      recommendations.push('Develop a calendar of grant deadlines and application requirements.');
    } else if (score >= 41) {
      recommendations.push('Focus on strengthening your weakest areas before submitting major grant applications.');
      recommendations.push('Consider hiring a grant consultant to review your organizational readiness.');
      recommendations.push('Start with smaller capacity-building grants while you address gaps.');
    } else {
      recommendations.push('Work with a nonprofit consultant to develop a 6-12 month readiness plan.');
      recommendations.push('Prioritize building foundational capacity before pursuing major grants.');
      recommendations.push('Focus first on establishing basic organizational infrastructure and documentation.');
    }

    return recommendations;
  };

  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleDownloadPDF = () => {
    const categoryScores = getCategoryScores();
    const strengths = getStrengths();
    const improvements = getImprovementAreas();
    const recommendations = getRecommendations();
    const date = new Date().toLocaleDateString();

    const content = `
GRANT READINESS ASSESSMENT REPORT
Generated: ${date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTICIPANT INFORMATION
Name: ${name}
Organization: ${organization}
Email: ${email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERALL GRANT READINESS SCORE: ${score}/100
Status: ${scoreLevel.level}

${scoreLevel.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATEGORY BREAKDOWN

${categoryScores.map(cat => `${cat.category}: ${cat.points}/${cat.maxPoints} points (${cat.yes}/${cat.total} questions)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STRENGTHS (${strengths.length} areas)

${strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPROVEMENT AREAS (${improvements.length} areas)

${improvements.map((imp, i) => `${i + 1}. [${imp.category}] ${imp.question}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS

${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For personalized guidance and support in improving your grant readiness,
contact Grants Made Simple for a consultation.

This assessment was generated by Grants Made Simple Grant Readiness Assessment Tool.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grant-Readiness-Assessment-${organization.replace(/\s+/g, '-')}-${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopyShareableSummary = () => {
    const topStrengths = strengths.slice(0, 3);
    const topImprovements = improvements.slice(0, 3);

    const summary = `
${organization} - Grant Readiness Assessment Results

Overall Score: ${score}/100 - ${scoreLevel.level}
Assessment Date: ${new Date().toLocaleDateString()}

Top 3 Strengths:
${topStrengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Top 3 Priority Improvements:
${topImprovements.map((imp, i) => `${i + 1}. ${imp.question}`).join('\n')}

Next Steps: ${scoreLevel.description}

Generated by Grants Made Simple Grant Readiness Assessment Tool
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleEmailReport = async () => {
    setSendingEmail(true);
    setEmailSent(false);

    try {
      const categoryScores = getCategoryScores();
      const recommendations = getRecommendations();

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-assessment-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          name,
          organization,
          score,
          scoreLevel: scoreLevel.level,
          scoreDescription: scoreLevel.description,
          categoryScores,
          strengths: strengths.slice(0, 5),
          improvements: improvements.slice(0, 5),
          recommendations
        })
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSendingEmail(false);
    }
  };

  const scoreLevel = getScoreLevel(score);
  const categoryScores = getCategoryScores();
  const recommendations = getRecommendations();
  const strengths = getStrengths();
  const improvements = getImprovementAreas();
  const yesCount = responses.filter(r => r).length;
  const noCount = responses.filter(r => !r).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Grant Readiness Assessment Results
          </h1>
          <p className="text-slate-600 text-lg">{name} • {organization}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Grant Readiness Score</h2>
              <p className="text-slate-600">Assessment completed on {new Date().toLocaleDateString()}</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
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
                    stroke={`${scoreLevel.color === 'emerald' ? '#10b981' : scoreLevel.color === 'amber' ? '#f59e0b' : '#ef4444'}`}
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
              <h3 className={`text-3xl font-bold mb-2 ${scoreLevel.color === 'emerald' ? 'text-emerald-600' : scoreLevel.color === 'amber' ? 'text-amber-600' : 'text-red-600'}`}>
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
                  <h3 className="font-semibold text-slate-900">Yes Answers</h3>
                </div>
                <p className="text-4xl font-bold text-emerald-600">{yesCount}</p>
                <p className="text-sm text-slate-600">{yesCount * 4} points earned</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-6 h-6 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">No Answers</h3>
                </div>
                <p className="text-4xl font-bold text-slate-600">{noCount}</p>
                <p className="text-sm text-slate-600">Areas to develop</p>
              </div>
            </div>
          </div>

          <div className={`mt-6 p-6 rounded-xl border-2 ${
            score >= 71 ? 'bg-emerald-50 border-emerald-200' :
            score >= 41 ? 'bg-amber-50 border-amber-200' :
            'bg-red-50 border-red-200'
          }`}>
            <h4 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${
                score >= 71 ? 'text-emerald-600' :
                score >= 41 ? 'text-amber-600' :
                'text-red-600'
              }`} />
              Understanding Your Score
            </h4>
            <div className="space-y-3 text-slate-700">
              {score >= 71 ? (
                <>
                  <p className="font-semibold text-emerald-800">
                    71–100: Your organization appears grant ready and may be well positioned to compete for funding.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Organizations in this range typically have strong foundational elements in place, including proper legal structure, financial systems, documented programs, and grant management capacity. You are positioned to begin actively pursuing grant opportunities that align with your mission and organizational capacity.
                  </p>
                </>
              ) : score >= 41 ? (
                <>
                  <p className="font-semibold text-amber-800">
                    41–70: Your organization has some foundations in place but should strengthen key systems before aggressively pursuing grants.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Organizations in this range have made progress but still have important gaps to address. Focus on strengthening the areas identified in your improvement checklist. Consider starting with smaller capacity-building grants while you develop stronger organizational infrastructure. Strategic preparation now will significantly improve your success rate when applying for larger grants.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-red-800">
                    0–40: Your organization is not yet positioned to compete well for most grants.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Organizations in this range typically need to build fundamental capacity before pursuing competitive grant opportunities. This is not uncommon for newer or growing organizations. We recommend working with a nonprofit consultant to develop a 6-12 month readiness plan focusing on organizational foundations, financial systems, and program documentation. Building this capacity now will position you for long-term fundraising success.
                  </p>
                </>
              )}

              <div className="pt-3 border-t border-slate-300 mt-4">
                <p className="text-xs text-slate-600 italic">
                  Note: This assessment provides general guidance. Grant competitiveness also depends on factors including funder priorities, geographic focus, program alignment, and the competitive landscape for specific opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-6 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Here's What Your Score Means—And What To Do Next
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <p className="text-lg leading-relaxed text-blue-50">
                {score >= 71 ? (
                  <>
                    While your organization shows strong readiness, <span className="font-semibold text-white">even small gaps can cost you thousands in missed funding opportunities.</span> The difference between a good application and a funded application often comes down to details most nonprofits overlook.
                  </>
                ) : score >= 41 ? (
                  <>
                    Your organization has potential, but <span className="font-semibold text-white">the gaps you have are costing you real funding opportunities right now.</span> The good news? These gaps are fixable with the right strategy. Most organizations in your position can become grant-ready within 90 days with focused effort.
                  </>
                ) : (
                  <>
                    Here's the reality: <span className="font-semibold text-white">applying for grants before you're ready wastes time and damages your reputation with funders.</span> But the gaps you're facing are completely fixable. With the right roadmap, you can transform your readiness in 90-180 days and start competing for meaningful funding.
                  </>
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-slate-900">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Grant Readiness Audit — $97</h3>
                  <p className="text-slate-600 font-medium mb-4">Get your personalized action plan in 3 business days</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><span className="font-semibold">Detailed gap analysis</span> — We'll review your assessment and identify exactly what's holding you back</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><span className="font-semibold">Prioritized action plan</span> — Step-by-step roadmap ranked by impact and ease</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><span className="font-semibold">Grant opportunity matching</span> — 3-5 specific grants you could pursue once ready</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><span className="font-semibold">30-minute strategy call</span> — Talk through your plan with a grant specialist</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">Worth $497</span> — We're offering this at $97 because we want to help nonprofits like yours get funded faster. This is an investment that typically pays for itself 100x over in secured grant funding.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg"
                >
                  Get My Grant Readiness Game Plan
                </a>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-blue-100 text-sm">
                Prefer to talk through your options first?
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-white hover:text-blue-200 font-semibold transition-colors underline underline-offset-4"
              >
                Schedule a Free 15-Minute Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            Category Performance
          </h3>
          <div className="space-y-6">
            {categoryScores.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg">{cat.category}</h4>
                    <p className="text-sm text-slate-600">
                      {cat.yes} of {cat.total} criteria met
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{cat.points}</div>
                    <div className="text-sm text-slate-600">of {cat.maxPoints} points</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      cat.score >= 16 ? 'bg-emerald-600' :
                      cat.score >= 12 ? 'bg-blue-500' :
                      cat.score >= 8 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(cat.score / cat.maxPoints) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
              Improvement Checklist ({improvements.length} items)
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

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ArrowRight className="w-7 h-7 text-emerald-600" />
            Recommended Next Steps
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="bg-emerald-100 rounded-full p-2 mt-0.5 flex-shrink-0">
                  <div className="w-6 h-6 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <p className="text-slate-700 flex-1 pt-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Share Your Results</h3>

          <div className="mb-8">
            <ShareableCard
              organization={organization}
              score={score}
              scoreLevel={scoreLevel.level}
              scoreColor={scoreLevel.color}
              strengths={strengths}
              improvements={improvements}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF Report
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share Results
            </button>

            <button
              onClick={handleEmailReport}
              disabled={sendingEmail}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              <Mail className="w-5 h-5" />
              {sendingEmail ? 'Sending...' : emailSent ? 'Email Sent!' : 'Email to My Team'}
            </button>

            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Restart Assessment
            </button>
          </div>
        </div>

        <div className="text-center mt-8 p-8 bg-slate-50 rounded-2xl border-2 border-slate-200">
          <p className="text-slate-600 text-sm mb-4">
            Questions about your results or next steps?
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-slate-900 hover:text-emerald-600 font-semibold transition-colors"
          >
            Contact us for guidance
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Share Your Results</h3>

            <div className="space-y-4">
              <button
                onClick={() => {
                  handleCopyShareableSummary();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold px-6 py-4 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Summary to Clipboard'}
              </button>

              <p className="text-sm text-slate-600 text-center">
                Share this summary with your leadership team, board members, or staff to discuss your organization's grant readiness.
              </p>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="mt-6 w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
