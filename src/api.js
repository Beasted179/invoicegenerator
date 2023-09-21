const BASE_URL = 'https://invoicegenerator.onrender.com/'; // Adjust to your frontend URL


export async function generatePDF(invoiceData) {
    try {
      const response = await fetch(`${BASE_URL}api/generate-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });
  
      if (response.ok) {
        return await response.blob();
      } else {
        throw new Error('Error generating PDF');
      }
    } catch (error) {
      throw new Error(`Error generating PDF: ${error.message}`);
    }
}


  
  
  
  
  
  
  