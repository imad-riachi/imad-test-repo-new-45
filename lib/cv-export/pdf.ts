import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CvData } from '@/lib/cvDataExtractor';

/**
 * Creates a stylized HTML representation of the CV for PDF conversion
 * @param cv The CV data to convert
 * @returns A string containing HTML of the CV
 */
function createCvHtml(cv: CvData): string {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="font-size: 24px; color: #2563eb; margin-bottom: 5px;">${cv.personalInfo.name}</h1>
      
      <div style="margin-bottom: 20px;">
        <p style="margin: 2px 0;">${cv.personalInfo.email}</p>
        ${cv.personalInfo.phone ? `<p style="margin: 2px 0;">${cv.personalInfo.phone}</p>` : ''}
        ${cv.personalInfo.linkedIn ? `<p style="margin: 2px 0;">${cv.personalInfo.linkedIn}</p>` : ''}
        ${cv.personalInfo.portfolio ? `<p style="margin: 2px 0;">${cv.personalInfo.portfolio}</p>` : ''}
        ${cv.personalInfo.location ? `<p style="margin: 2px 0;">${cv.personalInfo.location}</p>` : ''}
      </div>
      
      ${
        cv.summary
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Professional Summary</h2>
          <p>${cv.summary}</p>
        </div>
      `
          : ''
      }
      
      ${
        cv.workExperience.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Work Experience</h2>
          ${cv.workExperience
            .map(
              (exp) => `
            <div style="margin-bottom: 15px;">
              <h3 style="font-size: 16px; margin-bottom: 0px;">${exp.position}</h3>
              <p style="font-style: italic; margin-top: 0;">${exp.company} | ${exp.startDate} - ${exp.endDate}</p>
              <p>${exp.description}</p>
              ${
                exp.achievements && exp.achievements.length > 0
                  ? `
                <ul style="margin-top: 5px;">
                  ${exp.achievements.map((achievement) => `<li>${achievement}</li>`).join('')}
                </ul>
              `
                  : ''
              }
            </div>
          `,
            )
            .join('')}
        </div>
      `
          : ''
      }
      
      ${
        cv.education.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Education</h2>
          ${cv.education
            .map(
              (edu) => `
            <div style="margin-bottom: 15px;">
              <h3 style="font-size: 16px; margin-bottom: 0px;">${edu.degree}</h3>
              <p style="font-style: italic; margin-top: 0;">${edu.institution} | ${edu.graduationDate}</p>
              ${edu.field ? `<p style="margin-top: 5px;">Field of Study: ${edu.field}</p>` : ''}
              ${edu.gpa ? `<p style="margin-top: 5px;">GPA: ${edu.gpa}</p>` : ''}
            </div>
          `,
            )
            .join('')}
        </div>
      `
          : ''
      }
      
      ${
        cv.skills && cv.skills.technical.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Technical Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 5px;">
            ${cv.skills.technical
              .map(
                (skill) => `
              <span style="background-color: #f3f4f6; padding: 5px 10px; border-radius: 15px; font-size: 14px;">
                ${skill}
              </span>
            `,
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      ${
        cv.skills && cv.skills.languages && cv.skills.languages.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Languages</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 5px;">
            ${cv.skills.languages
              .map(
                (lang) => `
              <span style="background-color: #f3f4f6; padding: 5px 10px; border-radius: 15px; font-size: 14px;">
                ${lang}
              </span>
            `,
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      ${
        cv.certifications && cv.certifications.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Certifications</h2>
          ${cv.certifications
            .map(
              (cert) => `
            <div style="margin-bottom: 15px;">
              <h3 style="font-size: 16px; margin-bottom: 0px;">${cert.name}</h3>
              <p style="font-style: italic; margin-top: 0;">${cert.issuer} | ${cert.date}</p>
            </div>
          `,
            )
            .join('')}
        </div>
      `
          : ''
      }
    </div>
  `;

  return html;
}

/**
 * Helper function to create a temporary HTML element for the CV
 * @param cv The CV data to convert
 * @returns The HTML element containing the styled CV
 */
function createTempCvElement(cv: CvData): HTMLDivElement {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = createCvHtml(cv);
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  document.body.appendChild(tempDiv);

  return tempDiv;
}

/**
 * Downloads CV data as a PDF file
 * Uses html2canvas and jsPDF to create a PDF of just the CV content
 */
export function downloadCvAsPdf(filename = 'cv.pdf'): void {
  try {
    // Find the CV content element
    const cvElement =
      document.querySelector('.cv-content') || document.querySelector('.card');

    if (!cvElement) {
      console.error('Could not find CV content element');
      throw new Error('CV content element not found');
    }

    // Set up configuration for html2canvas
    const options = {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
    };

    // Start loading state
    const loadingIndicator = document.createElement('div');
    loadingIndicator.innerText = 'Generating PDF...';
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '50%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translate(-50%, -50%)';
    loadingIndicator.style.padding = '10px 20px';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.borderRadius = '5px';
    loadingIndicator.style.zIndex = '9999';
    document.body.appendChild(loadingIndicator);

    // Use html2canvas to capture the CV content
    html2canvas(cvElement as HTMLElement, options).then((canvas) => {
      // Remove loading indicator
      document.body.removeChild(loadingIndicator);

      // Create PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(filename);
    });
  } catch (error) {
    console.error('Error downloading CV as PDF:', error);
    throw error;
  }
}
