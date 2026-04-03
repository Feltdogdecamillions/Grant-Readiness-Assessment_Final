import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export interface IntakeResponses {
  organizationType: string;
  fundingType: string;
  yearsInOperation: string;
  annualRevenue: string;
  pastPerformance: string;
}

interface FundingPathwayIntakeProps {
  onComplete: (responses: IntakeResponses) => void;
  onBack: () => void;
}

export default function FundingPathwayIntake({ onComplete, onBack }: FundingPathwayIntakeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<IntakeResponses>({
    organizationType: '',
    fundingType: '',
    yearsInOperation: '',
    annualRevenue: '',
    pastPerformance: '',
  });

  const questions = [
    {
      id: 'organizationType',
      question: 'What type of organization are you?',
      options: [
        'Nonprofit',
        'For-profit',
        'Government/Public Agency',
        'Other',
      ],
    },
    {
      id: 'fundingType',
      question: 'What type of funding are you seeking?',
      options: [
        'Grants',
        'Procurement / Government Contracts',
        'Both',
      ],
    },
    {
      id: 'yearsInOperation',
      question: 'How many years have you been in operation?',
      options: [
        'Less than 1 year',
        '1–2 years',
        '3–5 years',
        '5+ years',
      ],
    },
    {
      id: 'annualRevenue',
      question: 'What is your approximate annual revenue?',
      options: [
        'Pre-revenue',
        'Under $50,000',
        '$50,000–$250,000',
        '$250,000+',
      ],
    },
    {
      id: 'pastPerformance',
      question: 'Do you currently have past performance or prior funded/project experience?',
      options: [
        'Yes',
        'No',
        'Somewhat',
      ],
    },
  ];

  const handleOptionSelect = (value: string) => {
    const questionId = questions[currentQuestion].id as keyof IntakeResponses;
    const newResponses = {
      ...responses,
      [questionId]: value,
    };
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      setTimeout(() => {
        onComplete(newResponses);
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Funding Pathway Intake</span>
                <span>{currentQuestion + 1} of {questions.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => {
              const questionId = questions[currentQuestion].id as keyof IntakeResponses;
              const isSelected = responses[questionId] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 shadow-md'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-medium">{option}</span>
                    {isSelected && (
                      <ArrowRight className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            This information helps us tailor recommendations to your specific situation
          </div>
        </div>
      </div>
    </div>
  );
}
