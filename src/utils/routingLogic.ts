import { IntakeResponses } from '../components/FundingPathwayIntake';

export interface PathwayRoute {
  includeGrantAssessment: boolean;
  includeProcurementAssessment: boolean;
  displayNote: string | null;
}

export function determinePathway(intake: IntakeResponses): PathwayRoute {
  const { organizationType, fundingType } = intake;

  if (organizationType === 'Nonprofit' && fundingType === 'Grants') {
    return {
      includeGrantAssessment: true,
      includeProcurementAssessment: false,
      displayNote: null,
    };
  }

  if (organizationType === 'For-profit' && fundingType === 'Procurement / Government Contracts') {
    return {
      includeGrantAssessment: false,
      includeProcurementAssessment: true,
      displayNote: null,
    };
  }

  if (organizationType === 'For-profit' && fundingType === 'Grants') {
    return {
      includeGrantAssessment: true,
      includeProcurementAssessment: false,
      displayNote: 'For-profit organizations may be eligible for certain grant opportunities, but eligibility is often more limited and may depend on industry, innovation, partnerships, or public benefit.',
    };
  }

  if (organizationType === 'For-profit' && fundingType === 'Both') {
    return {
      includeGrantAssessment: true,
      includeProcurementAssessment: true,
      displayNote: 'For-profit organizations may be eligible for certain grant opportunities, but eligibility is often more limited and may depend on industry, innovation, partnerships, or public benefit.',
    };
  }

  if (organizationType === 'Government/Public Agency' || organizationType === 'Other') {
    return {
      includeGrantAssessment: true,
      includeProcurementAssessment: false,
      displayNote: 'Note: Some assessment items may not apply to your organization type. Please answer based on what is relevant to your situation.',
    };
  }

  return {
    includeGrantAssessment: true,
    includeProcurementAssessment: false,
    displayNote: null,
  };
}
