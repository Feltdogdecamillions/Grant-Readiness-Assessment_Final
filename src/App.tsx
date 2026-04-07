import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import FundingPathwayIntake, { IntakeResponses } from './components/FundingPathwayIntake';
import Questionnaire from './components/Questionnaire';
import ProcurementQuestionnaire from './components/ProcurementQuestionnaire';
import EmailCapture from './components/EmailCapture';
import Results from './components/Results';
import AdminDashboard from './components/AdminDashboard';
import UpsellPage from './components/UpsellPage';
import DetailedResults from './components/DetailedResults';
import ScheduleSession from './components/ScheduleSession';
import PurchaseConfirmation from './components/PurchaseConfirmation';
import { supabase } from './lib/supabase';
import { determinePathway, PathwayRoute } from './utils/routingLogic';
import { procurementQuestions, categoryWeights } from './data/procurementQuestions';
import { pricingTiers, bookPreOrder } from './config/pricing';

type AppState = 'landing' | 'intake' | 'questionnaire' | 'procurement' | 'email' | 'results' | 'admin' | 'upsell' | 'detailed-results' | 'schedule-session' | 'purchase-confirmation';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [intakeResponses, setIntakeResponses] = useState<IntakeResponses | null>(null);
  const [pathway, setPathway] = useState<PathwayRoute | null>(null);
  const [responses, setResponses] = useState<boolean[]>([]);
  const [procurementResponses, setProcurementResponses] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(0);
  const [procurementScore, setProcurementScore] = useState(0);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setConfigError(true);
    }
  }, []);

  const handleStart = () => {
    setCurrentState('intake');
  };

  const handleIntakeComplete = (intake: IntakeResponses) => {
    setIntakeResponses(intake);
    const route = determinePathway(intake);
    setPathway(route);

    if (route.includeGrantAssessment) {
      setCurrentState('questionnaire');
    } else if (route.includeProcurementAssessment) {
      setCurrentState('procurement');
    }
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
  };

  const handleQuestionnaireComplete = (questionnaireResponses: boolean[]) => {
    setResponses(questionnaireResponses);

    if (pathway?.includeProcurementAssessment) {
      setCurrentState('procurement');
    } else {
      setCurrentState('email');
    }
  };

  const handleProcurementComplete = (procurementResponses: string[]) => {
    setProcurementResponses(procurementResponses);
    setCurrentState('email');
  };

  const handleEmailSubmit = async (data: { name: string; organization: string; email: string }) => {
    setName(data.name);
    setOrganization(data.organization);
    setEmail(data.email);

    const yesCount = responses.filter(r => r).length;
    const calculatedScore = yesCount * 4;
    setScore(calculatedScore);

    const calculatedProcurementScore = calculateProcurementScore(procurementResponses);
    setProcurementScore(calculatedProcurementScore);

    try {
      const { error } = await supabase
        .from('assessments')
        .insert({
          name: data.name,
          organization: data.organization,
          email: data.email,
          responses: responses.length > 0 ? responses : null,
          score: calculatedScore,
          intake_responses: intakeResponses,
          procurement_responses: procurementResponses.length > 0 ? procurementResponses : null,
          procurement_score: calculatedProcurementScore
        });

      if (error) {
        console.error('Error saving assessment:', error);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }

    setCurrentState('results');
  };

  const calculateProcurementScore = (responses: string[]): number => {
    if (responses.length === 0) return 0;

    const categoryScores: { [key: string]: { earned: number; possible: number } } = {};

    Object.keys(categoryWeights).forEach(cat => {
      categoryScores[cat] = { earned: 0, possible: 0 };
    });

    procurementQuestions.forEach((question, index) => {
      const response = responses[index];
      const category = question.category;
      const questionsInCategory = procurementQuestions.filter(q => q.category === category).length;
      const pointsPerQuestion = categoryWeights[category] / questionsInCategory;

      categoryScores[category].possible += pointsPerQuestion;

      if (index === 16) {
        if (response !== 'None') {
          categoryScores[category].earned += pointsPerQuestion;
        }
      } else if (index === 23) {
        if (response === 'No') {
          categoryScores[category].earned += pointsPerQuestion;
        } else if (response === 'Not sure') {
          categoryScores[category].earned += pointsPerQuestion / 2;
        }
      } else if (response === 'Yes' || response === 'Yes, active') {
        categoryScores[category].earned += pointsPerQuestion;
      } else if (response === 'Partially' || response === 'Somewhat' || response === 'Not sure' || response === 'Registered, but unsure if active') {
        categoryScores[category].earned += pointsPerQuestion / 2;
      }
    });

    const totalEarned = Object.values(categoryScores).reduce((sum, cat) => sum + cat.earned, 0);
    return Math.round(totalEarned);
  };

  const handleRestart = () => {
    setCurrentState('landing');
    setIntakeResponses(null);
    setPathway(null);
    setResponses([]);
    setProcurementResponses([]);
    setName('');
    setOrganization('');
    setEmail('');
    setScore(0);
    setProcurementScore(0);
  };

  const handleAdminAccess = () => {
    setCurrentState('admin');
  };

  const handleBackFromAdmin = () => {
    setCurrentState('landing');
  };

  const handleUpsellUpgrade = async (tierId: string, includeBook?: boolean) => {
    const tier = pricingTiers.find(t => t.id === tierId);
    if (!tier) return;

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
          cancelUrl: '/upsell',
          customerEmail: email,
          metadata: {
            name,
            organization,
            score: score.toString(),
            tierId: tier.id,
            includesBook: includeBook ? 'true' : 'false'
          }
        })
      });

      if (response.ok) {
        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleUpsellContinue = () => {
    setCurrentState('results');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    if (path === '/upsell') {
      setCurrentState('upsell');
    } else if (path === '/detailed-results') {
      setCurrentState('detailed-results');
    } else if (path === '/schedule-session') {
      setCurrentState('schedule-session');
    } else if (path === '/purchase-confirmation') {
      setCurrentState('purchase-confirmation');
    }
  }, []);

  if (configError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">
            The application is missing required environment variables. Please configure:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="text-sm text-gray-500">
            Contact your administrator to set up these variables in your hosting environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentState === 'landing' && <Landing onStart={handleStart} onAdminClick={handleAdminAccess} />}
      {currentState === 'intake' && (
        <FundingPathwayIntake onComplete={handleIntakeComplete} onBack={handleBackToLanding} />
      )}
      {currentState === 'questionnaire' && (
        <Questionnaire
          onComplete={handleQuestionnaireComplete}
          displayNote={pathway?.displayNote || null}
        />
      )}
      {currentState === 'procurement' && (
        <ProcurementQuestionnaire
          onComplete={handleProcurementComplete}
          displayNote={pathway?.displayNote || null}
        />
      )}
      {currentState === 'email' && <EmailCapture onSubmit={handleEmailSubmit} />}
      {currentState === 'results' && (
        <Results
          score={score}
          responses={responses}
          procurementScore={procurementScore}
          procurementResponses={procurementResponses}
          name={name}
          organization={organization}
          email={email}
          onRestart={handleRestart}
          pathway={pathway}
          intakeResponses={intakeResponses || undefined}
        />
      )}
      {currentState === 'admin' && <AdminDashboard onBack={handleBackFromAdmin} />}
      {currentState === 'upsell' && (
        <UpsellPage onUpgrade={handleUpsellUpgrade} onContinue={handleUpsellContinue} />
      )}
      {currentState === 'detailed-results' && <DetailedResults />}
      {currentState === 'schedule-session' && <ScheduleSession />}
      {currentState === 'purchase-confirmation' && <PurchaseConfirmation />}
    </>
  );
}

export default App;
