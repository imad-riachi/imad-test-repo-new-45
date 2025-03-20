export interface ResumeSchema {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    summary: string;
    location: {
      address: string;
      city: string;
      countryCode: string;
      region: string;
    };
  };
  work: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    summary: string;
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  interests: Array<{
    name: string;
    keywords: string[];
  }>;
}
