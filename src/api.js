// api.js
export async function generatePDF(deductionData) {
    try {
      const response = await fetch('/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deductionData),
      });
    
      if (response.ok) {
        return await response.blob();
      } else {
        throw new Error('Error generating PDF');
      }
    } catch (error) {
      throw new Error('Error generating PDF:', error);
    }
  }
  
  