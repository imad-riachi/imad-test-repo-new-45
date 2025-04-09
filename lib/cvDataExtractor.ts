/**
 * CV data structure definition
 */
export interface CvData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  summary: string;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    languages?: string[];
    soft?: string[];
  };
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

/**
 * Extracts structured CV data from text content
 * @param text Raw text content from CV
 * @returns Structured CV data
 */
export async function extractCvData(text: string): Promise<CvData> {
  // This is a simplified implementation that would be enhanced with NLP/ML
  // In a real system, this would use more advanced algorithms, regex patterns,
  // or even call a third-party ML API

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  // Simple extraction based on section identification
  const result: CvData = {
    personalInfo: {
      name: extractName(lines),
      email: extractEmail(lines),
      phone: extractPhone(lines),
      location: extractLocation(lines),
    },
    summary: extractSummary(lines),
    workExperience: extractWorkExperience(lines),
    education: extractEducation(lines),
    skills: {
      technical: extractTechnicalSkills(lines),
    },
  };

  return result;
}

/**
 * Utility functions for extracting specific data points
 * These are simplified implementations and would be more robust in production
 */

function extractName(lines: string[]): string {
  // Typically the name is at the top of the CV
  return lines[0] || 'Not found';
}

function extractEmail(lines: string[]): string {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailLine = lines.find((line) => emailRegex.test(line));
  if (emailLine) {
    const match = emailLine.match(emailRegex);
    return match ? match[0] : 'Not found';
  }
  return 'Not found';
}

function extractPhone(lines: string[]): string {
  // Simple regex for phone numbers - would be more robust in production
  const phoneRegex = /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/;
  const phoneLine = lines.find((line) => phoneRegex.test(line));
  if (phoneLine) {
    const match = phoneLine.match(phoneRegex);
    return match ? match[0] : 'Not found';
  }
  return 'Not found';
}

function extractLocation(lines: string[]): string {
  // This is a simplification - location extraction would be more complex
  // Often the location is near contact information
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    if (lines[i].includes(',') && /[A-Z][a-z]+/.test(lines[i])) {
      return lines[i];
    }
  }
  return 'Not found';
}

function extractSummary(lines: string[]): string {
  // Look for summary section
  const summaryIndex = lines.findIndex((line) =>
    /^summary|^profile|^about me/i.test(line),
  );

  if (summaryIndex !== -1) {
    // Extract content until next section
    let summary = '';
    for (let i = summaryIndex + 1; i < lines.length; i++) {
      if (/^education|^experience|^skills/i.test(lines[i])) {
        break;
      }
      summary += lines[i] + ' ';
    }
    return summary.trim();
  }

  return 'No summary found';
}

function extractWorkExperience(lines: string[]): CvData['workExperience'] {
  const workExperience: CvData['workExperience'] = [];

  // Find work experience section
  const experienceIndex = lines.findIndex((line) =>
    /^work experience|^experience|^employment/i.test(line),
  );

  if (experienceIndex === -1) {
    return workExperience;
  }

  // Simple extraction logic - this would be much more sophisticated in production
  let companyStart = -1;
  let currentJob: Partial<CvData['workExperience'][0]> = {};

  for (let i = experienceIndex + 1; i < lines.length; i++) {
    // Check if we've reached the next section
    if (/^education|^skills|^projects|^certifications/i.test(lines[i])) {
      if (Object.keys(currentJob).length > 0) {
        workExperience.push(currentJob as CvData['workExperience'][0]);
      }
      break;
    }

    // Look for date patterns that often indicate job entries
    if (/\d{4}\s*[-–—to]\s*(\d{4}|present)/i.test(lines[i])) {
      // Save previous job if exists
      if (Object.keys(currentJob).length > 0) {
        workExperience.push(currentJob as CvData['workExperience'][0]);
      }

      // Start a new job entry
      const dateMatch = lines[i].match(/(\d{4})\s*[-–—to]\s*(\d{4}|present)/i);
      companyStart = i;
      currentJob = {
        company: 'Unknown',
        position: 'Unknown',
        startDate: dateMatch ? dateMatch[1] : '',
        endDate: dateMatch ? dateMatch[2] : '',
        description: '',
      };

      // Look for company and position in preceding line
      if (i > 0) {
        currentJob.company = lines[i - 1];
        if (i > 1) {
          currentJob.position = lines[i - 2];
        }
      }
    } else if (companyStart !== -1 && currentJob) {
      // Append to description
      currentJob.description = (currentJob.description || '') + ' ' + lines[i];
    }
  }

  // Add the last job if there is one
  if (Object.keys(currentJob).length > 0) {
    workExperience.push(currentJob as CvData['workExperience'][0]);
  }

  return workExperience;
}

function extractEducation(lines: string[]): CvData['education'] {
  const education: CvData['education'] = [];

  // Find education section
  const educationIndex = lines.findIndex((line) =>
    /^education|^academic background/i.test(line),
  );

  if (educationIndex === -1) {
    return education;
  }

  // Simple extraction logic
  let institutionStart = -1;
  let currentEducation: Partial<CvData['education'][0]> = {};

  for (let i = educationIndex + 1; i < lines.length; i++) {
    // Check if we've reached the next section
    if (/^skills|^experience|^projects|^certifications/i.test(lines[i])) {
      if (Object.keys(currentEducation).length > 0) {
        education.push(currentEducation as CvData['education'][0]);
      }
      break;
    }

    // Look for date patterns that often indicate education entries
    if (/\d{4}/.test(lines[i])) {
      // Save previous education if exists
      if (Object.keys(currentEducation).length > 0) {
        education.push(currentEducation as CvData['education'][0]);
      }

      // Start a new education entry
      institutionStart = i;
      currentEducation = {
        institution: 'Unknown',
        degree: 'Unknown',
        field: 'Unknown',
        graduationDate: lines[i].match(/\d{4}/)![0],
      };

      // Look for institution and degree in surrounding lines
      if (i > 0) {
        const possibleInstitution = lines[i - 1];
        if (
          possibleInstitution &&
          !/^bachelor|^master|^phd|^doctor/i.test(possibleInstitution)
        ) {
          currentEducation.institution = possibleInstitution;

          if (i > 1) {
            const possibleDegree = lines[i - 2];
            if (
              /bachelor|master|phd|doctor|bs|ba|ms|ma/i.test(possibleDegree)
            ) {
              currentEducation.degree = possibleDegree;

              // Try to extract field of study
              const degreeMatch = possibleDegree.match(/in\s+(.+)/i);
              if (degreeMatch) {
                currentEducation.field = degreeMatch[1];
              }
            }
          }
        } else {
          // The line might contain both degree and field
          currentEducation.degree = possibleInstitution;

          const fieldMatch = possibleInstitution.match(/in\s+(.+)/i);
          if (fieldMatch) {
            currentEducation.field = fieldMatch[1];
          }
        }
      }
    }
  }

  // Add the last education entry if there is one
  if (Object.keys(currentEducation).length > 0) {
    education.push(currentEducation as CvData['education'][0]);
  }

  return education;
}

function extractTechnicalSkills(lines: string[]): string[] {
  // Find skills section
  const skillsIndex = lines.findIndex((line) =>
    /^skills|^technical skills/i.test(line),
  );

  if (skillsIndex === -1) {
    return [];
  }

  const skills: string[] = [];

  // Extract skills until next section
  for (let i = skillsIndex + 1; i < lines.length; i++) {
    if (/^education|^experience|^projects|^certifications/i.test(lines[i])) {
      break;
    }

    // Split by commas, colons, or other common separators
    const lineSkills = lines[i]
      .split(/[,;:|•]/)
      .map((skill) => skill.trim())
      .filter(Boolean);

    skills.push(...lineSkills);
  }

  return skills;
}
