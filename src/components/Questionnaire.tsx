import { useState } from 'react';
import { questions } from '../data/questions';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (responses: boolean[]) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(boolean | null)[]>(
    new Array(questions.length).fill(null)
  );

  const handleResponse = (answer: boolean) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = answer;
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1 && responses[currentQuestion] !== null) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    const allAnswered = responses.every(r => r !== null);
    if (allAnswered) {
      onComplete(responses as boolean[]);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = responses.filter(r => r !== null).length;
  const allAnswered = responses.every(r => r !== null);
  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Grant Readiness Assessment
            </h2>
            <span className="text-sm font-medium text-slate-600">
              {answeredCount} of {questions.length} answered
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full mb-4">
              {currentQuestionData.category}
            </span>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900 flex-1">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              {currentQuestionData.text}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleResponse(true)}
              className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                responses[currentQuestion] === true
                  ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleResponse(false)}
              className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                responses[currentQuestion] === false
                  ? 'bg-slate-600 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              No
            </button>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 && allAnswered ? (
              <button
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Complete Assessment
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={
                  currentQuestion === questions.length - 1 ||
                  responses[currentQuestion] === null
                }
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                responses[index] === true
                  ? 'bg-emerald-600'
                  : responses[index] === false
                  ? 'bg-slate-400'
                  : 'bg-slate-200'
              } ${currentQuestion === index ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
