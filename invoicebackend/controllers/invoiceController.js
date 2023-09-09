const fs = require("fs");
const PDFDocument = require("pdfkit-table");

const generateInvoice = async (req, res) => {
  try {
    const {dateCreated, driverName, loads, cashAdvance, insurance, isEightPercentChecked, isThirtyPercentChecked } = req.body;

    // Calculate the total amount before deductions
    const totalBeforeDeductions = loads.reduce((total, load) => total + parseFloat(load.amount), 0);

    // Initialize calculatedAmount
    let calculatedAmount;

    // Initialize deductionAmount
    let deductionAmount = 0;

    // Initialize deductionDescription
    let deductionDescription = '';

    let totalAfterDeductions = 0;

    let loadsAdded = loads.length

    let eightPercDeduction = 0;
    // Determine the scenario and calculate the calculatedAmount and deductionDescription
    if (isEightPercentChecked) {
    const subtractFifty = 50 * loads.length; // Minus $50 per load

      calculatedAmount = totalBeforeDeductions - subtractFifty

       eightPercDeduction = calculatedAmount * 0.08; // 8% deduction
       console.log("eight perc deduction",eightPercDeduction)
      
      
      deductionDescription = '$50 deduction per load for 8% scenario';
      
      totalAfterDeductions = calculatedAmount - eightPercDeduction - insurance - cashAdvance;
      console.log("calculated amount",calculatedAmount)  
      console.log("total after",totalAfterDeductions)
    } else if (isThirtyPercentChecked) {
      // Calculate deductions for the 30 percent scenario
      calculatedAmount = totalBeforeDeductions * 0.7; // 30% to driver
    } else {
      return null;
    }

    let doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    doc.pipe(res);

    // Add company name in large letters
    doc.font('Helvetica-Bold').fontSize(24).text('Interfreight Transport LLC', { align: 'center' });

    // Add company address and contact number
    doc.font('Helvetica').fontSize(12).text('20606 Rainstone CT', { align: 'center' });
    doc.text('Katy, Texas, 77449', { align: 'center' });
    doc.text('Phone: (323) 605-2680', { align: 'center' });
    doc.text(`${driverName}`, { align: 'left' });
    doc.text(`${dateCreated}`,{align: 'right'});
    // Create a table
    const table = {
      title: 'Invoice Details',
      headers: ['Broker Name', 'Date', 'Notes', 'Amount'],
      rows: loads.map(load => [
        load.brokerName,
        load.date,
        load.notes,
        `$${load.amount}`,
      ]),
    };

    await doc.table(table, { width: 500 }); // Adjust the width as needed

  
    
    // Calculate the width needed for the dollar sign
    const dollarSignWidth = doc.widthOfString('$');
    
    if (isEightPercentChecked) {
      const fiftyDeductionText = `- $50 x ${loadsAdded.toFixed(2)} `;
      const eightPercDeductionText = ` ${calculatedAmount - eightPercDeduction.toFixed(2)}`;
      doc.text("$50 per load", { width: 200, align: 'left' }); 
      doc.text(fiftyDeductionText, { width: 200, align: 'left' });
      const calculatedAmountText = `$${calculatedAmount.toFixed(2)}`;
      doc.text(calculatedAmountText, { width: 200 + dollarSignWidth, align: 'left' });
      doc.text("Payroll Deduction 8%", { width: 200, align: 'left' });  
      doc.text(`- $${eightPercDeduction}`, { width: 200, align: 'left' });
    }
    if(isThirtyPercentChecked) {
    const calculatedAmountText = `$${calculatedAmount.toFixed(2)}`;
    doc.text(calculatedAmountText, { width: 200 + dollarSignWidth, align: 'left' });
    }
    
    const cashAdvanceText = `- $${cashAdvance}`;
    doc.text(`Cash Advance:`, { width: 200, align: 'left' });
    doc.text(cashAdvanceText, { width: 200 + dollarSignWidth, align: 'left' }); // Adjust the width as needed
    
    const insuranceText = `- $${insurance}`;
    doc.text(`Insurance:`, { width: 200, align: 'left' });
    doc.text(insuranceText, { width: 200 + dollarSignWidth, align: 'left' }); // Adjust the width as needed
    
    // Total Amount after deductions
    const totalAfterDeductionsText = `$${totalAfterDeductions.toFixed(2)}`;
    doc.text(`Total Amount:`, { width: 200, align: 'left' });
    doc.text(totalAfterDeductionsText, { width: 200 + dollarSignWidth, align: 'left' }); // Adjust the width as needed
    
    doc.end();
    

    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};

module.exports = {
  generateInvoice,
};







