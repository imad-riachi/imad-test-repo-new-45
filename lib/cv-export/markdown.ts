import { CvData } from '@/lib/cvDataExtractor';

/**
 * Converts CV data to a markdown string
 * @param cv The CV data to convert
 * @returns Markdown representation of the CV
 */
export function convertCvToMarkdown(cv: CvData): string {
  let markdown = `# ${cv.personalInfo.name}

## Contact
- **Email:** ${cv.personalInfo.email}
- **Phone:** ${cv.personalInfo.phone}
- **Location:** ${cv.personalInfo.location}
`;

  if (cv.personalInfo.linkedIn) {
    markdown += `- **LinkedIn:** ${cv.personalInfo.linkedIn}\n`;
  }

  if (cv.personalInfo.portfolio) {
    markdown += `- **Portfolio:** ${cv.personalInfo.portfolio}\n`;
  }

  markdown += `\n## Summary
${cv.summary}

## Experience
`;

  cv.workExperience.forEach((job) => {
    markdown += `### ${job.position} at ${job.company}
**${job.startDate} - ${job.endDate}**

${job.description}

`;

    if (job.achievements && job.achievements.length > 0) {
      markdown += '**Key Achievements:**\n';
      job.achievements.forEach((achievement) => {
        markdown += `- ${achievement}\n`;
      });
      markdown += '\n';
    }
  });

  markdown += `## Education
`;

  cv.education.forEach((edu) => {
    markdown += `### ${edu.degree} in ${edu.field}
**${edu.institution}** | Graduated ${edu.graduationDate}
`;

    if (edu.gpa) {
      markdown += `GPA: ${edu.gpa}\n`;
    }

    markdown += '\n';
  });

  markdown += `## Skills
`;

  Object.entries(cv.skills).forEach(([category, skills]) => {
    const skillCategory = category.charAt(0).toUpperCase() + category.slice(1);
    markdown += `### ${skillCategory}
`;
    (skills as string[]).forEach((skill) => {
      markdown += `- ${skill}\n`;
    });
    markdown += '\n';
  });

  if (cv.certifications && cv.certifications.length > 0) {
    markdown += `## Certifications
`;
    cv.certifications.forEach((cert) => {
      markdown += `- **${cert.name}** - ${cert.issuer} (${cert.date})\n`;
    });
  }

  return markdown;
}

/**
 * Downloads CV data as a Markdown file
 */
export function downloadCvAsMarkdown(cv: CvData, filename = 'cv.md'): void {
  try {
    const markdown = convertCvToMarkdown(cv);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading CV as Markdown:', error);
    throw error;
  }
}
