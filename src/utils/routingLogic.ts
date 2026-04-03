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
      displayNote: 'Note: As a for-profit entity, you may have more limited grant opportunities. Many grants are nonprofit-specific, though some corporate and research grants may be available.',
    };
  }

  if (organizationType === 'For-profit' && fundingType === 'Both') {
    return {
      includeGrantAssessment: true,
      includeProcurementAssessment: true,
      displayNote: 'Note: You will complete both the grant readiness and procurement assessments.',
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
