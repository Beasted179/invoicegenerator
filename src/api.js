// api.js

const generatePDF = async (data) => {
    try {
      const response = await fetch(`/generate-pdf?loads=${data.loads}&calculatedAmount=${data.calculatedAmount}&cashAdvance=${data.cashAdvance}&insurance=${data.insurance}`);
      const pdfDataUri = await response.text();
      return pdfDataUri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };
  
export default generatePDF
  