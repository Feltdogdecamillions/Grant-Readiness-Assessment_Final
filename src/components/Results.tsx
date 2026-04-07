import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RefreshCw, Download, TrendingUp, Share2, Mail, Copy, Check, BookOpen } from 'lucide-react';
import { questions, categories } from '../data/questions';
import { procurementQuestions, procurementCategories, categoryWeights } from '../data/procurementQuestions';
import ShareableCard from './ShareableCard';
import { PathwayRoute } from '../utils/routingLogic';
import { pricingTiers, bookPreOrder } from '../config/pricing';

interface ResultsProps {
  score: number;
  responses: boolean[];
  procurementScore: number;
  procurementResponses: string[];
  name: string;
  organization: string;
  email: string;
  onRestart: () => void;
  pathway?: PathwayRoute | null;
  intakeResponses?: {
    organizationType: string;
    fundingType: string;
    yearsInOperation: string;
    annualRevenue: string;
    pastPerformance: string;
  };
}

export default function Results({ score, responses, procurementScore, procurementResponses, name, organization, email, onRestart, intakeResponses }: ResultsProps) {
  const hasGrantAssessment = responses.length > 0;
  const hasProcurementAssessment = procurementResponses.length > 0;
  const isForProfit = intakeResponses?.organizationType === 'For-profit';
  const fundingType = intakeResponses?.fundingType || '';
  const getScoreLevel = (score: number) => {
    if (score >= 71) return { level: 'Grant Ready', color: 'emerald', description: 'Your organization appears grant ready and may be well positioned to compete for funding' };
    if (score >= 41) return { level: 'Emerging / Competitive', color: 'amber', description: 'Your organization shows progress, but several readiness gaps still need attention' };
    return { level: 'Not Grant Ready', color: 'red', description: 'You should focus on foundational setup before pursuing funding aggressively' };
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

    if (score >= 71) {
      recommendations.push('You appear funding-ready in several areas and should begin focusing on targeted opportunities and submission strategy.');
      recommendations.push('Consider starting with local foundation grants that align with your mission.');
      recommendations.push('Develop a calendar of grant deadlines and application requirements.');
    } else if (score >= 41) {
      recommendations.push('Your organization shows progress, but several readiness gaps still need attention.');
      recommendations.push('Focus on strengthening your weakest areas before submitting major grant applications.');
      recommendations.push('Consider hiring a grant consultant to review your organizational readiness.');
      recommendations.push('Start with smaller capacity-building grants while you address gaps.');
    } else {
      recommendations.push('You should focus on foundational setup before pursuing funding aggressively.');
      recommendations.push('Work with a nonprofit consultant to develop a 6-12 month readiness plan.');
      recommendations.push('Prioritize building foundational capacity before pursuing major grants.');
      recommendations.push('Focus first on establishing basic organizational infrastructure and documentation.');
    }

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

    return recommendations;
  };

  const getProcurementScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Procurement Ready', color: 'emerald', description: 'Your business is well-positioned to pursue government contracts' };
    if (score >= 60) return { level: 'Emerging/Competitive', color: 'blue', description: 'Your business is competitive but should strengthen key areas' };
    if (score >= 40) return { level: 'Early Stage', color: 'amber', description: 'Your business has started but needs significant development' };
    return { level: 'Not Procurement Ready', color: 'red', description: 'Build your foundation before actively pursuing contracts' };
  };

  const getProcurementCategoryScores = () => {
    const categoryData: { [key: string]: { points: number; total: number } } = {};

    procurementCategories.forEach(cat => {
      categoryData[cat] = { points: 0, total: categoryWeights[cat] };
    });

    procurementQuestions.forEach((q, index) => {
      const response = procurementResponses[index];
      const category = q.category;
      const questionsInCategory = procurementQuestions.filter(question => question.category === category).length;
      const pointsPerQuestion = categoryWeights[category] / questionsInCategory;

      if (index === 16) {
        if (response !== 'None') {
          categoryData[category].points += pointsPerQuestion;
        }
      } else if (index === 23) {
        if (response === 'No') {
          categoryData[category].points += pointsPerQuestion;
        } else if (response === 'Not sure') {
          categoryData[category].points += pointsPerQuestion / 2;
        }
      } else if (response === 'Yes' || response === 'Yes, active') {
        categoryData[category].points += pointsPerQuestion;
      } else if (response === 'Partially' || response === 'Somewhat' || response === 'Not sure' || response === 'Registered, but unsure if active') {
        categoryData[category].points += pointsPerQuestion / 2;
      }
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      points: Math.round(data.points * 10) / 10,
      maxPoints: data.total
    }));
  };

  const getProcurementStrengths = () => {
    const strengths: string[] = [];
    procurementQuestions.forEach((q, index) => {
      const response = procurementResponses[index];
      if (response === 'Yes' || response === 'Yes, active' || (index === 16 && response !== 'None')) {
        strengths.push(q.text);
      }
    });
    return strengths;
  };

  const getProcurementImprovementAreas = () => {
    const improvements: { category: string; question: string }[] = [];
    procurementQuestions.forEach((q, index) => {
      const response = procurementResponses[index];
      if (response === 'No' || response === 'Not sure' || (index === 16 && response === 'None') || (index === 23 && response === 'Yes')) {
        improvements.push({ category: q.category, question: q.text });
      }
    });
    return improvements;
  };

  const getProcurementRecommendations = () => {
    const categoryScores = getProcurementCategoryScores();
    const recommendations = [];

    const weakCategories = categoryScores
      .filter(cat => (cat.points / cat.maxPoints) < 0.6)
      .sort((a, b) => (a.points / a.maxPoints) - (b.points / b.maxPoints));

    if (procurementScore >= 80) {
      recommendations.push('You appear procurement-ready and should begin targeting agencies, primes, or contract opportunities aligned with your services.');
      recommendations.push('Focus on identifying contract opportunities that align with your NAICS codes and capabilities.');
      recommendations.push('Build relationships with contracting officers and attend agency outreach events.');
      recommendations.push('Continue monitoring SAM.gov for relevant solicitations and maintain your registrations.');
    } else if (procurementScore >= 60) {
      recommendations.push('You appear moderately prepared and should strengthen the areas below to improve competitiveness.');
      recommendations.push('Prioritize completing your SAM.gov registration and ensuring all certifications are current.');
      recommendations.push('Develop or refine your capability statement to showcase your strengths and past performance.');
      recommendations.push('Consider starting with subcontracting opportunities while strengthening your foundation.');
    } else if (procurementScore >= 40) {
      recommendations.push('Your organization shows progress, but several readiness gaps still need attention.');
      recommendations.push('Strengthen your SAM.gov registration, capability statement, and bid response process before pursuing contracts.');
      recommendations.push('Complete SAM.gov registration as your first priority, as this is required for federal contracts.');
      recommendations.push('Work on developing a professional capability statement that highlights your business strengths.');
      recommendations.push('Build past performance through smaller contracts or subcontracting relationships.');
    } else {
      recommendations.push('You should focus on foundational setup before pursuing funding aggressively.');
      recommendations.push('Focus on identifying NAICS codes, documenting past performance, and building a repeatable pipeline strategy.');
      recommendations.push('Start with business registration, obtaining an EIN, and setting up a separate business bank account.');
      recommendations.push('Register in SAM.gov and ensure all business information is accurate and current.');
      recommendations.push('Consider working with a PTAC (Procurement Technical Assistance Center) for guidance on getting started.');
    }

    if (weakCategories.length > 0) {
      weakCategories.slice(0, 3).forEach(cat => {
        if (cat.category === 'Business Foundation') {
          recommendations.push('Strengthen your business foundation by ensuring proper registration, EIN, and separate business banking.');
        } else if (cat.category === 'SAM.gov Registration') {
          recommendations.push('Complete and maintain active SAM.gov registration with all required documentation and certifications.');
        } else if (cat.category === 'Capability Statement') {
          recommendations.push('Develop a comprehensive capability statement showcasing your experience, capabilities, and differentiators.');
        } else if (cat.category === 'Past Performance') {
          recommendations.push('Build past performance documentation through contracts, subcontracts, or similar commercial work.');
        } else if (cat.category === 'Financial Readiness') {
          recommendations.push('Improve financial capacity with accounting systems, lines of credit, and bonding capability if needed.');
        }
      });
    }

    return recommendations;
  };

  const getProcurementTopStrengths = () => {
    const categoryScores = getProcurementCategoryScores();
    return categoryScores
      .filter(cat => (cat.points / cat.maxPoints) >= 0.7)
      .sort((a, b) => (b.points / b.maxPoints) - (a.points / a.maxPoints))
      .slice(0, 3)
      .map(cat => cat.category);
  };

  const getProcurementTopGaps = () => {
    const categoryScores = getProcurementCategoryScores();
    return categoryScores
      .filter(cat => (cat.points / cat.maxPoints) < 0.5)
      .sort((a, b) => (a.points / a.maxPoints) - (b.points / b.maxPoints))
      .slice(0, 3)
      .map(cat => cat.category);
  };

  const getSuggestedFundingPath = () => {
    if (procurementScore >= 80) {
      return 'Prime contractor opportunities with federal agencies';
    } else if (procurementScore >= 60) {
      return 'Subcontracting and smaller direct contracts';
    } else if (procurementScore >= 40) {
      return 'Subcontracting while building capability';
    } else {
      return 'Focus on preparation before pursuing contracts';
    }
  };

  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [includeBook, setIncludeBook] = useState(false);

  const handleDownloadPDF = () => {
    if (!hasGrantAssessment || !scoreLevel) return;

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
    if (!hasGrantAssessment || !scoreLevel) return;

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
    if (!hasGrantAssessment || !scoreLevel) return;

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

  const handleCheckout = async (tier: typeof pricingTiers[0]) => {
    setCheckoutLoading(tier.id);

    try {
      const lineItems = [tier.stripePriceId];

      if (includeBook) {
        lineItems.push(bookPreOrder.stripePriceId);
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tier.stripePriceId,
          lineItems,
          successUrl: tier.successUrl,
          cancelUrl: '/',
          customerEmail: email,
          metadata: {
            name,
            organization,
            score: score.toString(),
            tierId: tier.id,
            includesBook: includeBook.toString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again or contact support.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const scoreLevel = hasGrantAssessment ? getScoreLevel(score) : null;
  const categoryScores = hasGrantAssessment ? getCategoryScores() : [];
  const recommendations = hasGrantAssessment ? getRecommendations() : [];
  const strengths = hasGrantAssessment ? getStrengths() : [];
  const improvements = hasGrantAssessment ? getImprovementAreas() : [];
  const yesCount = hasGrantAssessment ? responses.filter(r => r).length : 0;
  const noCount = hasGrantAssessment ? responses.filter(r => !r).length : 0;

  const procurementScoreLevel = hasProcurementAssessment ? getProcurementScoreLevel(procurementScore) : null;
  const procurementCategoryScores = hasProcurementAssessment ? getProcurementCategoryScores() : [];
  const procurementStrengths = hasProcurementAssessment ? getProcurementStrengths() : [];
  const procurementImprovements = hasProcurementAssessment ? getProcurementImprovementAreas() : [];
  const procurementRecommendations = hasProcurementAssessment ? getProcurementRecommendations() : [];
  const procurementTopStrengths = hasProcurementAssessment ? getProcurementTopStrengths() : [];
  const procurementTopGaps = hasProcurementAssessment ? getProcurementTopGaps() : [];
  const suggestedFundingPath = hasProcurementAssessment ? getSuggestedFundingPath() : '';

  const getPrimaryFocus = () => {
    if (!hasGrantAssessment || !hasProcurementAssessment) return null;

    const grantGaps = improvements.length;
    const procurementGaps = procurementImprovements.length;

    if (score > procurementScore + 10) {
      return {
        recommendation: 'Focus on Grant Readiness First',
        reason: 'Your grant readiness foundation is stronger. Build on this momentum while addressing procurement gaps in parallel.'
      };
    } else if (procurementScore > score + 10) {
      return {
        recommendation: 'Focus on Procurement Readiness First',
        reason: 'Your procurement readiness is ahead. Capitalize on this strength while developing grant capabilities.'
      };
    } else if (grantGaps < procurementGaps) {
      return {
        recommendation: 'Focus on Grant Readiness First',
        reason: 'You have fewer critical gaps in grant readiness. Completing these improvements could position you for funding opportunities sooner.'
      };
    } else if (procurementGaps < grantGaps) {
      return {
        recommendation: 'Focus on Procurement Readiness First',
        reason: 'You have fewer critical gaps in procurement readiness. Addressing these could open contract opportunities faster.'
      };
    } else {
      return {
        recommendation: 'Pursue Both Paths Strategically',
        reason: 'Your readiness levels are similar across both pathways. Consider pursuing opportunities in both areas while systematically addressing gaps.'
      };
    }
  };

  const primaryFocus = getPrimaryFocus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Your Funding Readiness Results
          </h1>
          <p className="text-slate-600 text-lg mb-4">{name} • {organization}</p>
          <p className="text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Based on your responses, this assessment evaluated your organization's readiness to pursue grants, government contracts (procurement), or both. Your results highlight your current strengths, gaps, and the next steps that can help you become more competitive for funding opportunities.
          </p>
        </div>

        {isForProfit && (fundingType === 'Grants' || fundingType === 'Both') && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Note for For-Profit Organizations</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  For-profit organizations may be eligible for certain grant opportunities, but eligibility is often narrower and may depend on industry, innovation, partnerships, public benefit, or specific grant requirements.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasGrantAssessment && hasProcurementAssessment && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-emerald-600" />
              Combined Funding Readiness Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Grant Readiness</h4>
                <p className="text-4xl font-bold text-emerald-700 mb-2">{score}/100</p>
                <p className="text-sm text-slate-700">{scoreLevel?.level}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Procurement Readiness</h4>
                <p className="text-4xl font-bold text-blue-700 mb-2">{procurementScore}/100</p>
                <p className="text-sm text-slate-700">{procurementScoreLevel?.level}</p>
              </div>
            </div>
            {primaryFocus && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-emerald-600" />
                  Suggested Primary Focus
                </h4>
                <p className="text-lg font-bold text-emerald-700 mb-2">{primaryFocus.recommendation}</p>
                <p className="text-slate-700 leading-relaxed">{primaryFocus.reason}</p>
              </div>
            )}
          </div>
        )}

        {hasGrantAssessment && scoreLevel && (
        <>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Grant Readiness Score</h2>
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
          <div className="max-w-5xl mx-auto">
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

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {pricingTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden text-slate-900 transition-all hover:scale-105 ${
                    tier.mostPopular ? 'ring-4 ring-emerald-400' : ''
                  }`}
                >
                  {tier.mostPopular && (
                    <div className="bg-emerald-600 text-white text-center py-2 px-4 text-sm font-bold">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">${tier.price}</span>
                        {includeBook && (
                          <span className="text-sm text-slate-600">+ ${bookPreOrder.price}</span>
                        )}
                      </div>
                      {includeBook && (
                        <p className="text-sm font-semibold text-emerald-700 mt-1">
                          Total: ${tier.price + bookPreOrder.price}
                        </p>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed min-h-[4rem]">
                      {tier.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-700 text-sm">{feature}</p>
                        </div>
                      ))}
                    </div>

                    {tier.id === 'strategy-audit' && (
                      <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4">
                        <p className="text-xs font-bold text-amber-900 text-center">
                          ⚠️ Only 10 free strategy sessions available each week. Once spots are filled, the bonus will be unavailable until the following week.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleCheckout(tier)}
                      disabled={checkoutLoading === tier.id}
                      className={`block w-full text-center font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-50 ${
                        tier.mostPopular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                          : index === 2
                          ? 'bg-slate-700 hover:bg-slate-800 text-white'
                          : 'bg-slate-600 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {checkoutLoading === tier.id ? 'Processing...' : tier.cta}
                    </button>

                    {tier.id === 'strategy-audit' && (
                      <p className="text-xs text-slate-600 text-center mt-2 font-medium">
                        Limited weekly availability — secure your spot now.
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
              Key Strengths ({strengths.length})
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
              Key Gaps ({improvements.length} items)
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
        </>
        )}

        {hasProcurementAssessment && procurementScoreLevel && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Procurement Readiness Score</h2>
                  <p className="text-slate-600">Assessment completed on {new Date().toLocaleDateString()}</p>
                </div>
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
                        stroke={`${
                          procurementScoreLevel.color === 'emerald' ? '#10b981' :
                          procurementScoreLevel.color === 'blue' ? '#3b82f6' :
                          procurementScoreLevel.color === 'amber' ? '#f59e0b' : '#ef4444'
                        }`}
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 100}`}
                        strokeDashoffset={`${2 * Math.PI * 100 * (1 - procurementScore / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-6xl font-bold text-slate-900">{procurementScore}</div>
                        <div className="text-sm text-slate-600">out of 100</div>
                      </div>
                    </div>
                  </div>
                  <h3 className={`text-3xl font-bold mb-2 ${
                    procurementScoreLevel.color === 'emerald' ? 'text-emerald-600' :
                    procurementScoreLevel.color === 'blue' ? 'text-blue-600' :
                    procurementScoreLevel.color === 'amber' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {procurementScoreLevel.level}
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    {procurementScoreLevel.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <h3 className="font-semibold text-slate-900">Strong Areas</h3>
                    </div>
                    <p className="text-4xl font-bold text-emerald-600">{procurementStrengths.length}</p>
                    <p className="text-sm text-slate-600">Areas where you excel</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                      <h3 className="font-semibold text-slate-900">Growth Areas</h3>
                    </div>
                    <p className="text-4xl font-bold text-amber-600">{procurementImprovements.length}</p>
                    <p className="text-sm text-slate-600">Areas to develop</p>
                  </div>
                </div>
              </div>

              <div className={`mt-6 p-6 rounded-xl border-2 ${
                procurementScore >= 80 ? 'bg-emerald-50 border-emerald-200' :
                procurementScore >= 60 ? 'bg-blue-50 border-blue-200' :
                procurementScore >= 40 ? 'bg-amber-50 border-amber-200' :
                'bg-red-50 border-red-200'
              }`}>
                <h4 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                  <AlertCircle className={`w-5 h-5 ${
                    procurementScore >= 80 ? 'text-emerald-600' :
                    procurementScore >= 60 ? 'text-blue-600' :
                    procurementScore >= 40 ? 'text-amber-600' :
                    'text-red-600'
                  }`} />
                  Understanding Your Score
                </h4>
                <div className="space-y-3 text-slate-700">
                  {procurementScore >= 80 ? (
                    <>
                      <p className="font-semibold text-emerald-800">
                        80–100: Procurement Ready
                      </p>
                      <p className="text-sm leading-relaxed">
                        Your business has strong foundational infrastructure, proper registration, comprehensive documentation, and operational capacity. You can actively pursue government contract opportunities that match your capabilities and certifications.
                      </p>
                    </>
                  ) : procurementScore >= 60 ? (
                    <>
                      <p className="font-semibold text-blue-800">
                        60–79: Emerging/Competitive
                      </p>
                      <p className="text-sm leading-relaxed">
                        Your business is competitive but should strengthen key areas before aggressively pursuing large contracts. Focus on completing any missing SAM.gov elements, refining your capability statement, and building documentation. Consider subcontracting opportunities while addressing gaps.
                      </p>
                    </>
                  ) : procurementScore >= 40 ? (
                    <>
                      <p className="font-semibold text-amber-800">
                        40–59: Early Stage
                      </p>
                      <p className="text-sm leading-relaxed">
                        Your business has made initial progress but needs significant development before pursuing competitive contracts. Prioritize SAM.gov registration completion, developing a professional capability statement, and building past performance through smaller opportunities or subcontracts.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-red-800">
                        0–39: Not Procurement Ready
                      </p>
                      <p className="text-sm leading-relaxed">
                        Your business needs to establish core infrastructure before pursuing government contracts. Focus first on business registration, SAM.gov setup, financial readiness, and basic documentation. This is a normal starting point for businesses new to procurement.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {procurementTopStrengths.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    Key Strengths
                  </h3>
                  <div className="space-y-3">
                    {procurementTopStrengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-700 font-medium">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {procurementTopGaps.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-7 h-7 text-amber-600" />
                    Key Gaps
                  </h3>
                  <div className="space-y-3">
                    {procurementTopGaps.map((gap, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-700 font-medium">{gap}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ArrowRight className="w-7 h-7 text-blue-600" />
                Recommended Next Steps
              </h3>
              <div className="space-y-4">
                {procurementRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-4 p-5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="bg-blue-100 rounded-full p-2 mt-0.5 flex-shrink-0">
                      <div className="w-6 h-6 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-slate-700 flex-1 pt-1">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Category Breakdown</h3>
              <div className="space-y-4">
                {procurementCategoryScores.map((cat, index) => {
                  const percentage = (cat.points / cat.maxPoints) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-900">{cat.category}</span>
                        <span className="text-sm text-slate-600">{cat.points}/{cat.maxPoints} points</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            percentage >= 70 ? 'bg-emerald-500' :
                            percentage >= 50 ? 'bg-blue-500' :
                            percentage >= 30 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

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
