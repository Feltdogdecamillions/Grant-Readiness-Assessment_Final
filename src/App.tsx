import { useState } from 'react';
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
