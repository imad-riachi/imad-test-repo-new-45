import { jsPDF } from 'jspdf';
import { CVData } from '@/components/cv-display';

/**
 * Generates a PDF document from CV data
 * @param cv The CV data to convert to PDF
 * @returns A PDF document as a Blob
 */
export function generatePDFFromCV(cv: CVData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = 20;
  const lineHeight = 7;

  // Set initial styles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);

  // Add title
  doc.text('Professional CV', margin, yPosition);
  yPosition += lineHeight * 2;

  // Summary section
  if (cv.summary) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Summary', margin, yPosition);
    yPosition += lineHeight;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(cv.summary, contentWidth);
    doc.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * lineHeight + lineHeight;
  }

  // Experience section
  if (cv.experience && cv.experience.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Professional Experience', margin, yPosition);
    yPosition += lineHeight * 1.5;

    // Loop through each experience entry
    cv.experience.forEach((exp) => {
      // Check for new page if needed
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`${exp.position} at ${exp.company}`, margin, yPosition);
      yPosition += lineHeight;

      if (exp.date) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(11);
        doc.text(exp.date, margin, yPosition);
        yPosition += lineHeight;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);

      exp.description.forEach((desc) => {
        // Check for new page if needed
        if (yPosition > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPosition = 20;
        }

        const bulletPoint = '• ';
        const descLines = doc.splitTextToSize(
          desc,
          contentWidth - doc.getTextWidth(bulletPoint),
        );

        doc.text(bulletPoint, margin, yPosition);
        doc.text(descLines, margin + doc.getTextWidth(bulletPoint), yPosition);
        yPosition += descLines.length * lineHeight;
      });

      if (exp.achievements && exp.achievements.length > 0) {
        // Check for new page if needed
        if (yPosition > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPosition = 20;
        }

        yPosition += lineHeight * 0.5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Achievements:', margin, yPosition);
        yPosition += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);

        exp.achievements.forEach((achievement) => {
          // Check for new page if needed
          if (yPosition > doc.internal.pageSize.getHeight() - 40) {
            doc.addPage();
            yPosition = 20;
          }

          const bulletPoint = '• ';
          const achievementLines = doc.splitTextToSize(
            achievement,
            contentWidth - doc.getTextWidth(bulletPoint),
          );

          doc.text(bulletPoint, margin, yPosition);
          doc.text(
            achievementLines,
            margin + doc.getTextWidth(bulletPoint),
            yPosition,
          );
          yPosition += achievementLines.length * lineHeight;
        });
      }

      yPosition += lineHeight * 1.5;
    });
  }

  // Skills section
  if (cv.skills && cv.skills.length > 0) {
    // Check for new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Skills', margin, yPosition);
    yPosition += lineHeight * 1.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    // Wrap skills with bullet points
    const bulletPoint = '• ';
    let currentLine = '';
    let lineWidth = 0;

    for (let index = 0; index < cv.skills.length; index++) {
      const skill = cv.skills[index];
      const skillWithBullet = `${bulletPoint}${skill}`;
      const skillWidth = doc.getTextWidth(skillWithBullet);

      if (lineWidth + skillWidth > contentWidth) {
        // Write the current line and start a new one
        doc.text(currentLine, margin, yPosition);
        yPosition += lineHeight;
        currentLine = skillWithBullet;
        lineWidth = skillWidth;
      } else if (index === 0) {
        currentLine = skillWithBullet;
        lineWidth = skillWidth;
      } else {
        currentLine += `    ${skillWithBullet}`;
        lineWidth += skillWidth + doc.getTextWidth('    ');
      }

      // Write the last line if we're at the end
      if (index === cv.skills.length - 1) {
        doc.text(currentLine, margin, yPosition);
        yPosition += lineHeight;
      }
    }

    yPosition += lineHeight;
  }

  // Education section
  if (cv.education && cv.education.length > 0) {
    // Check for new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Education', margin, yPosition);
    yPosition += lineHeight * 1.5;

    cv.education.forEach((edu) => {
      // Check for new page if needed
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(edu.degree, margin, yPosition);
      yPosition += lineHeight;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      let institutionText = edu.institution;
      if (edu.date) {
        institutionText += ` (${edu.date})`;
      }
      doc.text(institutionText, margin, yPosition);
      yPosition += lineHeight;

      if (edu.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const descLines = doc.splitTextToSize(edu.description, contentWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += descLines.length * lineHeight;
      }

      yPosition += lineHeight;
    });
  }

  // Projects section
  if (cv.projects && cv.projects.length > 0) {
    // Check for new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Projects', margin, yPosition);
    yPosition += lineHeight * 1.5;

    cv.projects.forEach((project) => {
      // Check for new page if needed
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(project.name, margin, yPosition);
      yPosition += lineHeight;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const descLines = doc.splitTextToSize(project.description, contentWidth);
      doc.text(descLines, margin, yPosition);
      yPosition += descLines.length * lineHeight;

      if (project.technologies && project.technologies.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Technologies:', margin, yPosition);
        yPosition += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const techText = project.technologies.join(', ');
        const techLines = doc.splitTextToSize(techText, contentWidth);
        doc.text(techLines, margin, yPosition);
        yPosition += techLines.length * lineHeight;
      }

      yPosition += lineHeight;
    });
  }

  // Convert the PDF to a blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}

/**
 * Triggers a download of the given PDF blob
 * @param pdfBlob The PDF blob to download
 * @param filename The name of the file to download
 */
export function downloadPDF(pdfBlob: Blob, filename: string = 'cv.pdf'): void {
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
