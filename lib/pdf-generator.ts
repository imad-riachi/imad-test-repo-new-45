export const generatePDF = async (
  contentElement: HTMLElement,
  fileName: string = 'download.pdf',
) => {
  if (!contentElement) {
    throw new Error('No content element provided');
  }

  try {
    // Create a clone of the element to avoid modifying the original DOM
    const clone = contentElement.cloneNode(true) as HTMLElement;
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    // Fix: Process all elements with inline or computed styles to replace oklch colors
    const allElements = tempContainer.querySelectorAll('*');
    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const hasOklchColor =
        computedStyle.color.includes('oklch') ||
        computedStyle.backgroundColor.includes('oklch') ||
        computedStyle.borderColor.includes('oklch');

      if (hasOklchColor) {
        // Replace with websafe colors
        if (computedStyle.color.includes('oklch')) {
          (el as HTMLElement).style.color = '#333333';
        }
        if (computedStyle.backgroundColor.includes('oklch')) {
          (el as HTMLElement).style.backgroundColor = '#ffffff';
        }
        if (computedStyle.borderColor.includes('oklch')) {
          (el as HTMLElement).style.borderColor = '#dddddd';
        }
      }
    });

    // Dynamic import to ensure browser-only execution
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Create PDF with processed element
    const canvas = await html2canvas(clone, {
      scale: 2,
      logging: false,
      useCORS: true,
      removeContainer: false, // We'll handle cleanup ourselves
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(
      imgData,
      'PNG',
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
    );
    pdf.save(fileName);

    // Clean up the temporary elements
    document.body.removeChild(tempContainer);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
