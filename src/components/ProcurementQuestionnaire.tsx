import { useState } from 'react';
import { procurementQuestions, procurementCategories } from '../data/procurementQuestions';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface ProcurementQuestionnaireProps {
  onComplete: (responses: string[]) => void;
  displayNote?: string | null;
}

export default function ProcurementQuestionnaire({ onComplete, displayNote }: ProcurementQuestionnaireProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(string | null)[]>(
    new Array(procurementQuestions.length).fill(null)
  );

  const handleResponse = (answer: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = answer;
    setResponses(newResponses);

    if (currentQuestion < procurementQuestions.length - 1) {
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
    if (currentQuestion < procurementQuestions.length - 1 && responses[currentQuestion] !== null) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    const allAnswered = responses.every(r => r !== null);
    if (allAnswered) {
      onComplete(responses as string[]);
    }
  };

  const progress = ((currentQuestion + 1) / procurementQuestions.length) * 100;
  const answeredCount = responses.filter(r => r !== null).length;
  const allAnswered = responses.every(r => r !== null);
  const currentQuestionData = procurementQuestions[currentQuestion];

  const getCategoryProgress = () => {
    const categoryProgress: { [key: string]: { answered: number; total: number } } = {};

    procurementCategories.forEach(cat => {
      categoryProgress[cat] = { answered: 0, total: 0 };
    });

    procurementQuestions.forEach((q, index) => {
      categoryProgress[q.category].total++;
      if (responses[index] !== null) {
        categoryProgress[q.category].answered++;
      }
    });

    return categoryProgress;
  };

  const categoryProgress = getCategoryProgress();

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Let's Assess Your Funding Readiness
            </h2>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              This assessment will evaluate your organization's readiness to pursue grants, government contracts (procurement), or both.
            </p>

            <p className="text-base text-slate-700 leading-relaxed mb-8">
              You'll answer a series of questions about your structure, financial systems, documentation, and overall preparedness. Based on your responses, you'll receive a personalized readiness score along with clear recommendations on what to improve and where to focus.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">What to Expect:</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-1">•</span>
                  <span>Takes approximately 5–10 minutes to complete</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-1">•</span>
                  <span>Questions will adapt based on your organization type and funding goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-1">•</span>
                  <span>You'll receive a readiness score and tailored next steps at the end</span>
                </li>
              </ul>
            </div>

            {displayNote && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-900">{displayNote}</p>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowIntro(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Begin Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Procurement Readiness Assessment
            </h2>
            <span className="text-sm font-medium text-slate-600">
              {answeredCount} of {procurementQuestions.length} answered
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              {currentQuestionData.category}
            </span>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900 flex-1">
                Question {currentQuestion + 1} of {procurementQuestions.length}
              </h3>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              {currentQuestionData.text}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestionData.options.map((option) => {
              const isSelected = responses[currentQuestion] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleResponse(option)}
                  className={`w-full text-left py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {option}
                </button>
              );
            })}
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

            {currentQuestion === procurementQuestions.length - 1 && allAnswered ? (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Complete Assessment
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={
                  currentQuestion === procurementQuestions.length - 1 ||
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

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-4">Category Progress</h4>
          <div className="grid grid-cols-2 gap-3">
            {procurementCategories.map((category) => {
              const { answered, total } = categoryProgress[category];
              const isComplete = answered === total;
              const isCurrent = currentQuestionData.category === category;

              return (
                <div
                  key={category}
                  className={`text-xs p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-blue-100 border-2 border-blue-400'
                      : isComplete
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="font-medium text-slate-900 mb-1">{category}</div>
                  <div className="text-slate-600">
                    {answered}/{total} {answered === total ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {procurementQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                responses[index] !== null
                  ? 'bg-blue-600'
                  : 'bg-slate-200'
              } ${currentQuestion === index ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
