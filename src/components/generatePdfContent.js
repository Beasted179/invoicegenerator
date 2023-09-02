import jsPDF from 'jspdf';

const generatePDFContent = ({ loads, calculatedAmount, cashAdvance, insurance }) => {
  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Set up custom font (you need to provide the font file)
  const customFont = 'https://fonts.gstatic.com/s/opensans/v23/mem8YaGs126MiZpBA-UFW50e.ttf';
  doc.addFont(customFont, 'custom', 'normal');
  doc.setFont('custom'); // Set the custom font

  // Set the title for the PDF
  doc.setFontSize(24);
  doc.text('Invoice', 20, 20);

  // Add content to the PDF
  let yOffset = 40;
  doc.setFontSize(12);
  loads.forEach((load, index) => {
    doc.text(`Load ${index + 1}:`, 20, yOffset);
    doc.text(`Broker Name: ${load.brokerName}`, 25, yOffset + 10);
    doc.text(`Date: ${load.date}`, 25, yOffset + 20);
    doc.text(`Notes: ${load.notes}`, 25, yOffset + 30);
    doc.text(`Amount: $${load.amount}`, 25, yOffset + 40);
    yOffset += 60;
  });

  doc.setFontSize(14);
  doc.text(`Calculated Amount: $${calculatedAmount}`, 20, yOffset);
  doc.text(`Cash Advance: $${cashAdvance}`, 20, yOffset + 15);
  doc.text(`Insurance: $${insurance}`, 20, yOffset + 30);

  // Save the PDF and return its content as a string
  const pdfContent = doc.output('datauristring');

  console.log('Generated PDF Content:', pdfContent); // Log the generated PDF content

  return pdfContent;
};

export default generatePDFContent;


