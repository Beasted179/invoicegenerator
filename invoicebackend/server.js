const express = require('express');
const jsPDF = require('jspdf');
const app = express();

app.get('/generate-pdf', (req, res) => {
    console.log(req)
  const { loads, calculatedAmount, cashAdvance, insurance } = req.query;

  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Add content to the PDF
  let yOffset = 30;
  loads.forEach((load, index) => {
    doc.text(`Load ${index + 1}:`, 10, yOffset);
    doc.text(`Broker Name: ${load.brokerName}`, 15, yOffset + 10);
    doc.text(`Date: ${load.date}`, 15, yOffset + 20);
    doc.text(`Notes: ${load.notes}`, 15, yOffset + 30);
    doc.text(`Amount: $${load.amount}`, 15, yOffset + 40);
    yOffset += 50;
  });

  doc.text(`Calculated Amount: $${calculatedAmount}`, 10, yOffset);
  doc.text(`Cash Advance: $${cashAdvance}`, 10, yOffset + 10);
  doc.text(`Insurance: $${insurance}`, 10, yOffset + 20);

  // Save the PDF and send it as a response
  const pdfContent = doc.output('datauristring');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  res.send(pdfContent);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

