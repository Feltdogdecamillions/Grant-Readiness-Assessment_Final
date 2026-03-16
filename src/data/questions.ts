export interface Question {
  id: number;
  category: string;
  text: string;
}

export const questions: Question[] = [
  {
    id: 1,
    category: "Organizational Foundations",
    text: "Does your organization have 501(c)(3) nonprofit status or a fiscal sponsor?"
  },
  {
    id: 2,
    category: "Organizational Foundations",
    text: "Do you have an active board of directors with at least three members?"
  },
  {
    id: 3,
    category: "Organizational Foundations",
    text: "Does your organization have a clear written mission statement?"
  },
  {
    id: 4,
    category: "Organizational Foundations",
    text: "Does your organization maintain bylaws or governance documents?"
  },
  {
    id: 5,
    category: "Organizational Foundations",
    text: "Has your organization been operating for at least one year?"
  },
  {
    id: 6,
    category: "Financial Readiness",
    text: "Does your organization maintain an annual operating budget?"
  },
  {
    id: 7,
    category: "Financial Readiness",
    text: "Do you produce regular financial statements such as income statements or balance sheets?"
  },
  {
    id: 8,
    category: "Financial Readiness",
    text: "Do you have financial policies and internal controls in place?"
  },
  {
    id: 9,
    category: "Financial Readiness",
    text: "Does your organization maintain separate accounts or tracking for grant funds?"
  },
  {
    id: 10,
    category: "Financial Readiness",
    text: "Have your financial statements been reviewed or audited within the past two years?"
  },
  {
    id: 11,
    category: "Program Design",
    text: "Do you have a clearly defined program or project you are seeking funding for?"
  },
  {
    id: 12,
    category: "Program Design",
    text: "Does the program address a documented community need?"
  },
  {
    id: 13,
    category: "Program Design",
    text: "Have you identified specific goals for the program?"
  },
  {
    id: 14,
    category: "Program Design",
    text: "Do you track measurable outcomes or performance indicators?"
  },
  {
    id: 15,
    category: "Program Design",
    text: "Do you collect data to demonstrate program impact?"
  },
  {
    id: 16,
    category: "Organizational Documentation",
    text: "Do you have a strategic plan or organizational plan?"
  },
  {
    id: 17,
    category: "Organizational Documentation",
    text: "Do you maintain an organizational chart or staff structure?"
  },
  {
    id: 18,
    category: "Organizational Documentation",
    text: "Do you have resumes or bios for leadership staff?"
  },
  {
    id: 19,
    category: "Organizational Documentation",
    text: "Do you maintain written program descriptions or manuals?"
  },
  {
    id: 20,
    category: "Organizational Documentation",
    text: "Do you have letters of support or formal community partnerships?"
  },
  {
    id: 21,
    category: "Grant Management Capacity",
    text: "Does your organization have someone responsible for grant writing or fundraising?"
  },
  {
    id: 22,
    category: "Grant Management Capacity",
    text: "Do you track grant deadlines using a grant calendar or tracking system?"
  },
  {
    id: 23,
    category: "Grant Management Capacity",
    text: "Do you have a system for tracking grant budgets and expenditures?"
  },
  {
    id: 24,
    category: "Grant Management Capacity",
    text: "Do you have experience managing grant reporting requirements?"
  },
  {
    id: 25,
    category: "Grant Management Capacity",
    text: "Do you maintain documentation for grant compliance and monitoring?"
  }
];

export const categories = [
  "Organizational Foundations",
  "Financial Readiness",
  "Program Design",
  "Organizational Documentation",
  "Grant Management Capacity"
];
