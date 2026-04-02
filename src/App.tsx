import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Questionnaire from './components/Questionnaire';
import EmailCapture from './components/EmailCapture';
import Results from './components/Results';
import { supabase } from './lib/supabase';

type AppState = 'landing' | 'questionnaire' | 'email' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [responses, setResponses] = useState<boolean[]>([]);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(0);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setConfigError(true);
    }
  }, []);

  const handleStart = () => {
    setCurrentState('questionnaire');
  };

  const handleQuestionnaireComplete = (questionnaireResponses: boolean[]) => {
    setResponses(questionnaireResponses);
    setCurrentState('email');
  };

  const handleEmailSubmit = async (data: { name: string; organization: string; email: string }) => {
    setName(data.name);
    setOrganization(data.organization);
    setEmail(data.email);

    const yesCount = responses.filter(r => r).length;
    const calculatedScore = yesCount * 4;
    setScore(calculatedScore);

    try {
      const { error } = await supabase
        .from('assessments')
        .insert({
          name: data.name,
          organization: data.organization,
          email: data.email,
          responses: responses,
          score: calculatedScore
        });

      if (error) {
        console.error('Error saving assessment:', error);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }

    setCurrentState('results');
  };

  const handleRestart = () => {
    setCurrentState('landing');
    setResponses([]);
    setName('');
    setOrganization('');
    setEmail('');
    setScore(0);
  };

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
      {currentState === 'landing' && <Landing onStart={handleStart} />}
      {currentState === 'questionnaire' && (
        <Questionnaire onComplete={handleQuestionnaireComplete} />
      )}
      {currentState === 'email' && <EmailCapture onSubmit={handleEmailSubmit} />}
      {currentState === 'results' && (
        <Results
          score={score}
          responses={responses}
          name={name}
          organization={organization}
          email={email}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

export default App;
