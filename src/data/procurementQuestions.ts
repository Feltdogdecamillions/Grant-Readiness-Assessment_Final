export interface ProcurementQuestion {
  id: string;
  category: string;
  text: string;
  options: string[];
}

export const procurementCategories = [
  'Business Foundation',
  'SAM.gov Registration',
  'NAICS Codes',
  'Capability Statement',
  'Past Performance',
  'Certifications',
  'Financial Readiness',
  'Compliance & Risk',
  'Bid Readiness',
  'Pipeline Strategy'
];

export const procurementQuestions: ProcurementQuestion[] = [
  {
    id: 'business_registered',
    category: 'Business Foundation',
    text: 'Is your business legally registered?',
    options: ['Yes', 'No']
  },
  {
    id: 'has_ein',
    category: 'Business Foundation',
    text: 'Do you have an EIN?',
    options: ['Yes', 'No']
  },
  {
    id: 'business_bank_account',
    category: 'Business Foundation',
    text: 'Do you have a business bank account separate from personal funds?',
    options: ['Yes', 'No']
  },
  {
    id: 'professional_presence',
    category: 'Business Foundation',
    text: 'Do you have a professional business email and website?',
    options: ['Yes', 'Partially', 'No']
  },
  {
    id: 'sam_registration',
    category: 'SAM.gov Registration',
    text: 'Are you registered in SAM.gov?',
    options: ['Yes, active', 'Registered, but unsure if active', 'No']
  },
  {
    id: 'has_uei',
    category: 'SAM.gov Registration',
    text: 'Do you have a Unique Entity ID (UEI)?',
    options: ['Yes', 'Not sure', 'No']
  },
  {
    id: 'sam_certifications',
    category: 'SAM.gov Registration',
    text: 'Have you completed your SAM.gov representations and certifications?',
    options: ['Yes', 'Not sure', 'No']
  },
  {
    id: 'primary_naics',
    category: 'NAICS Codes',
    text: 'Have you identified your primary NAICS code?',
    options: ['Yes', 'Not sure', 'No']
  },
  {
    id: 'secondary_naics',
    category: 'NAICS Codes',
    text: 'Have you identified any secondary NAICS codes?',
    options: ['Yes', 'No']
  },
  {
    id: 'naics_alignment',
    category: 'NAICS Codes',
    text: 'Are your NAICS codes aligned with the services/products you actually offer?',
    options: ['Yes', 'Not sure', 'No']
  },
  {
    id: 'has_capability_statement',
    category: 'Capability Statement',
    text: 'Do you have a current capability statement?',
    options: ['Yes', 'No']
  },
  {
    id: 'capability_completeness',
    category: 'Capability Statement',
    text: 'Does it include core competencies, differentiators, company data, and contact info?',
    options: ['Yes', 'Partially', 'No']
  },
  {
    id: 'capability_ready',
    category: 'Capability Statement',
    text: 'Is it updated and ready to send to agencies or primes?',
    options: ['Yes', 'No']
  },
  {
    id: 'documented_performance',
    category: 'Past Performance',
    text: 'Do you have documented past performance examples?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'performance_metrics',
    category: 'Past Performance',
    text: 'Do you have client results, metrics, or testimonials that support your experience?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'project_examples',
    category: 'Past Performance',
    text: 'Can you describe at least 2 relevant projects or services you have completed?',
    options: ['Yes', 'No']
  },
  {
    id: 'business_certifications',
    category: 'Certifications',
    text: 'Do you currently hold any small business certifications?',
    options: ['8(a)', 'HUBZone', 'WOSB', 'MBE', 'Veteran-owned', 'None']
  },
  {
    id: 'reviewed_certifications',
    category: 'Certifications',
    text: 'Have you reviewed whether you qualify for any certifications?',
    options: ['Yes', 'No']
  },
  {
    id: 'financial_statements',
    category: 'Financial Readiness',
    text: 'Do you have organized business financial statements?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'cash_flow',
    category: 'Financial Readiness',
    text: 'Can your business float expenses while waiting for contract payment?',
    options: ['Yes', 'Not sure', 'No']
  },
  {
    id: 'pricing_structure',
    category: 'Financial Readiness',
    text: 'Do you have a pricing method or cost structure for bids?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'business_licenses',
    category: 'Compliance & Risk',
    text: 'Do you have all required business licenses?',
    options: ['Yes', 'Not sure', 'No']
  },
  {
    id: 'business_insurance',
    category: 'Compliance & Risk',
    text: 'Do you carry business insurance appropriate for your industry?',
    options: ['Yes', 'Not sure', 'No']
  },
  {
    id: 'compliance_issues',
    category: 'Compliance & Risk',
    text: 'Are there any unresolved legal, tax, or compliance issues?',
    options: ['No', 'Not sure', 'Yes']
  },
  {
    id: 'rfp_experience',
    category: 'Bid Readiness',
    text: 'Have you responded to an RFP, RFQ, or bid before?',
    options: ['Yes', 'No']
  },
  {
    id: 'bid_process',
    category: 'Bid Readiness',
    text: 'Do you have a proposal/bid submission process?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'find_opportunities',
    category: 'Bid Readiness',
    text: 'Do you know where to find procurement opportunities relevant to your business?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'meet_deadlines',
    category: 'Bid Readiness',
    text: 'Can you consistently meet submission deadlines?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'target_agencies',
    category: 'Pipeline Strategy',
    text: 'Have you identified target agencies or buyers?',
    options: ['Yes', 'No']
  },
  {
    id: 'outreach_process',
    category: 'Pipeline Strategy',
    text: 'Do you have a process for outreach and follow-up?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'tracking_system',
    category: 'Pipeline Strategy',
    text: 'Do you track bid opportunities in a calendar or CRM-style system?',
    options: ['Yes', 'No']
  }
];
