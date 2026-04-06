export interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  stripePriceId: string;
  successUrl: string;
  featured?: boolean;
  mostPopular?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'action-plan',
    name: 'Quick Start Action Plan',
    price: 27,
    description: 'Get a detailed breakdown of your readiness and a clear set of next steps to improve your ability to secure funding.',
    features: [
      'Detailed gap analysis',
      'Prioritized action steps',
      'Funding path recommendation (Grants, Procurement, or Both)'
    ],
    cta: 'Get My Action Plan',
    stripePriceId: 'price_action_plan_27',
    successUrl: '/upsell',
    featured: false
  },
  {
    id: 'strategy-audit',
    name: 'Grant Readiness Audit',
    price: 97,
    description: 'Get a deeper analysis of your organization\'s funding readiness along with targeted opportunities and strategic direction.',
    features: [
      'Everything in the Action Plan',
      'Grant opportunity matching',
      'Procurement direction (if applicable)',
      'Personalized funding strategy recommendations'
    ],
    cta: 'Get Full Strategy Audit',
    stripePriceId: 'price_strategy_audit_97',
    successUrl: '/detailed-results',
    mostPopular: true
  },
  {
    id: 'strategy-session',
    name: 'Audit + Strategy Session',
    price: 197,
    description: 'Work directly with an expert to map out your funding strategy and next steps.',
    features: [
      'Everything in the Funding Strategy Audit',
      '30-minute 1:1 strategy call',
      'Custom roadmap and implementation guidance'
    ],
    cta: 'Work With Me 1:1',
    stripePriceId: 'price_strategy_session_197',
    successUrl: '/schedule-session',
    featured: false
  }
];
