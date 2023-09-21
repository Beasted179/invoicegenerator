const fs = require("fs");
const PDFDocument = require("pdfkit-table");

const generateInvoice = async (req, res) => {
  try {
    const {
      dateCreated,
      driverName,
      loads,
      cashAdvance,
      insurance,
      isEightPercentChecked,
      isThirtyPercentChecked,
      deductions,
      overAllNote
    } = req.body;

    const totalBeforeDeductions = loads.reduce(
      (total, load) => total + parseFloat(load.amount),
      0
    );

    let calculatedAmount;
    let deductionDescription = "";
    let totalAfterDeductions = 0;
    const loadsAdded = loads.length;

    // Calculate deductions
    let totalDeductions = 0;
    deductions.forEach((deduction) => {
      const deductionAmount = parseFloat(deduction.amount);
      totalDeductions += deductionAmount;
    });

    let doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename=invoice.pdf'
    );
    doc.pipe(res);

    // Add company name in large letters
    doc.font("Helvetica-Bold").fontSize(24).text("Interfreight Transport LLC", {
      align: "center",
    });

    // Add company address and contact number
    doc.font("Helvetica").fontSize(12).text("20606 Rainstone CT", {
      align: "center",
    });
    doc.text("Katy, Texas, 77449", { align: "center" });
    doc.text("Phone: (323) 605-2680", { align: "center" });
    doc.text(`${driverName}`, { align: "left" });
    doc.text(`${dateCreated}`, { align: "right" });

    // Create a table
    const table = {
      title: "Invoice Details",
      headers: ["Broker Name", "Date", "Notes", "Amount"],
      rows: loads.map((load) => [
        load.brokerName,
        load.date,
        load.notes,
        `$${load.amount}`,
      ]),
    };

    await doc.table(table, { width: 500 }); // Adjust the width as needed

    // Calculate the width needed for the dollar sign
    const dollarSignWidth = doc.widthOfString("$");

    if (isEightPercentChecked) {
      const fiftyDeductionText = `- $50 x ${loadsAdded.toFixed(0)}`; // Fixed to 0 decimal places
doc.text("$50 per load", { width: 200, align: "left" });
doc.text(fiftyDeductionText, { width: 200, align: "left" });
      let totalDeductionAmount = 0; // Total deduction amount
    
      if (deductions.length > 0) {
        doc.text("Deductions:", { width: 200, align: "left" });
        deductions.forEach((deduction) => {
          const deductionAmount = parseFloat(deduction.amount);
          const deductionText = `- ${deduction.name}: $${deductionAmount.toFixed(2)}`;
          doc.text(deductionText, {
            width: 200 + dollarSignWidth,
            align: "left",
          });
          totalDeductionAmount += deductionAmount; // Add deductionAmount to the total
        });
      }
    
      // 8% Scenario Calculations
      const subtractFifty = 50 * loadsAdded; // Minus $50 per load
      calculatedAmount = totalBeforeDeductions - subtractFifty;
      const eightPercDeduction = calculatedAmount * 0.08; // 8% deduction
      deductionDescription = '$50 deduction per load for 8% scenario';
    
      console.log('Total Before Deductions:', totalBeforeDeductions);
      console.log('Subtract Fifty:', subtractFifty);
      console.log('Calculated Amount:', calculatedAmount);
      console.log('8% Deduction Amount:', eightPercDeduction);
      console.log('Total Deduction Amount:', totalDeductionAmount);
      
      // Correct order of subtraction
      totalAfterDeductions =
        calculatedAmount - eightPercDeduction - totalDeductionAmount - insurance - cashAdvance;
    
      console.log('Total After Deductions:', totalAfterDeductions);
    }
    
     else if (isThirtyPercentChecked) {
      // 30% Scenario Calculations
      const totalBeforeDeductions = loads.reduce(
        (total, load) => total + parseFloat(load.amount),
        0
      );
    
      // Calculate the amount given to the driver (30%)
      const amountToDriver = totalBeforeDeductions * 0.3; // 30% to driver

      // Deductions for 30% Scenario
      let totalDeductionAmount = 0; // Total deduction amount
      if (deductions.length > 0) {
        doc.text("Deductions:", { width: 200, align: "left" });
        deductions.forEach((deduction) => {
          const deductionAmount = parseFloat(deduction.amount);
          const deductionText = `- ${deduction.name}: $${deductionAmount.toFixed(2)}`;
          doc.text(deductionText, {
            width: 200 + dollarSignWidth,
            align: "left",
          });
          totalDeductionAmount += deductionAmount; // Add deductionAmount to the total
        });
      }
    
      // Subtract cash advance, insurance, and total deductions from the amount given to the driver
      totalAfterDeductions = amountToDriver - cashAdvance - insurance - totalDeductionAmount;
    } else {
      return res.status(400).send('Invalid scenario');
    }

    // Continue with the rest of the code for both scenarios...
    
    // Cash Advance and Insurance
    const cashAdvanceText = `- $${cashAdvance}`;
    doc.text(`Cash Advance:`, { width: 200, align: "left" });
    doc.text(cashAdvanceText, {
      width: 200 + dollarSignWidth,
      align: "left",
    }); 

    const insuranceText = `- $${insurance}`;
    doc.text(`Insurance:`, { width: 200, align: "left" });
    doc.text(insuranceText, {
      width: 200 + dollarSignWidth,
      align: "left",
    }); 

    // Total Amount after deductions
    const totalAfterDeductionsText = `$${totalAfterDeductions.toFixed(2)}`;
    doc.text(`Total Amount:`, { width: 200, align: "left" });
    doc.text(totalAfterDeductionsText, {
      width: 200 + dollarSignWidth,
      align: "left",
    }); 
    if (overAllNote) {
      doc.text("Note:", { width: 200, align: "left" });
      doc.text(overAllNote, {
        width: 500, // Adjust the width as needed
        align: "left",
      });
    }
    
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};

module.exports = {
  generateInvoice,
};









