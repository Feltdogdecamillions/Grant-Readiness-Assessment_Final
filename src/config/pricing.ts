export interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'action-plan',
    name: 'Funding Readiness Action Plan',
    price: 27,
    description: 'Get a detailed breakdown of your readiness and a clear set of next steps to improve your ability to secure funding.',
    features: [
      'Detailed gap analysis',
      'Prioritized action steps',
      'Funding path recommendation (Grants, Procurement, or Both)'
    ],
    cta: 'Get My Action Plan',
    featured: true
  },
  {
    id: 'strategy-audit',
    name: 'Funding Strategy Audit',
    price: 97,
    description: 'Get a deeper analysis of your organization\'s funding readiness along with targeted opportunities and strategic direction.',
    features: [
      'Everything in the Action Plan',
      'Grant opportunity matching',
      'Procurement direction (if applicable)',
      'Personalized funding strategy recommendations'
    ],
    cta: 'Get Full Strategy Audit'
  },
  {
    id: 'strategy-session',
    name: 'Funding Strategy Session',
    price: 197,
    description: 'Work directly with an expert to map out your funding strategy and next steps.',
    features: [
      'Everything in the Funding Strategy Audit',
      '30-minute 1:1 strategy call',
      'Custom roadmap and implementation guidance'
    ],
    cta: 'Work With Me 1:1'
  }
];
