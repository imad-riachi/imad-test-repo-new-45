import { CVData } from '@/components/cv-display';

/**
 * Converts CV data to markdown format
 * @param cv The CV data to convert
 * @returns A string containing the CV in markdown format
 */
export function convertCVToMarkdown(cv: CVData): string {
  let markdown = '# Professional CV\n\n';

  if (cv.summary) {
    markdown += `## Summary\n${cv.summary}\n\n`;
  }

  if (cv.experience && cv.experience.length > 0) {
    markdown += '## Professional Experience\n\n';
    cv.experience.forEach((exp) => {
      markdown += `### ${exp.position} at ${exp.company}\n`;
      if (exp.date) markdown += `${exp.date}\n\n`;

      exp.description.forEach((desc) => {
        markdown += `- ${desc}\n`;
      });

      if (exp.achievements && exp.achievements.length > 0) {
        markdown += '\n**Achievements:**\n';
        exp.achievements.forEach((achievement) => {
          markdown += `- ${achievement}\n`;
        });
      }
      markdown += '\n';
    });
  }

  if (cv.skills && cv.skills.length > 0) {
    markdown += '## Skills\n\n';
    cv.skills.forEach((skill) => {
      markdown += `- ${skill}\n`;
    });
    markdown += '\n';
  }

  if (cv.education && cv.education.length > 0) {
    markdown += '## Education\n\n';
    cv.education.forEach((edu) => {
      markdown += `### ${edu.degree}\n`;
      markdown += `${edu.institution}`;
      if (edu.date) markdown += ` (${edu.date})`;
      markdown += '\n\n';
      if (edu.description) markdown += `${edu.description}\n\n`;
    });
  }

  if (cv.projects && cv.projects.length > 0) {
    markdown += '## Projects\n\n';
    cv.projects.forEach((project) => {
      markdown += `### ${project.name}\n\n`;
      markdown += `${project.description}\n\n`;

      if (project.technologies && project.technologies.length > 0) {
        markdown += `**Technologies:** ${project.technologies.join(', ')}\n\n`;
      }
    });
  }

  return markdown;
}

/**
 * Triggers a download of the given content as a markdown file
 * @param content The markdown content to download
 * @param filename The name of the file to download
 */
export function downloadMarkdown(
  content: string,
  filename: string = 'cv.md',
): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
