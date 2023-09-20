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
    console.log(deductions)
    // Calculate the total amount before deductions
    const totalBeforeDeductions = loads.reduce(
      (total, load) => total + parseFloat(load.amount),
      0
    );

    let calculatedAmount;
    let deductionAmount = 0;
    let deductionDescription = "";
    let totalAfterDeductions = 0;
    const loadsAdded = loads.length;

    // Determine the scenario and calculate the calculatedAmount and deductionDescription
    if (isEightPercentChecked) {
      const subtractFifty = 50 * loadsAdded; // Minus $50 per load
      calculatedAmount = totalBeforeDeductions - subtractFifty;
      const eightPercDeduction = calculatedAmount * 0.08; // 8% deduction
      deductionDescription = '$50 deduction per load for 8% scenario';
      totalAfterDeductions =
        calculatedAmount - eightPercDeduction - insurance - cashAdvance;
        deductions.forEach((deduction) => {
          totalAfterDeductions -= parseFloat(deduction.amount);
        });
    } else if (isThirtyPercentChecked) {
      // Calculate deductions for the 30 percent scenario
      calculatedAmount = totalBeforeDeductions * 0.7; // 30% to driver
      deductions.forEach((deduction) => {
        totalAfterDeductions -= parseFloat(deduction.amount);
      }); 
    } else {
      return null;
    } 

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
      const fiftyDeductionText = `- $50 x ${loadsAdded.toFixed(2)} `;
      const eightPercDeductionText = ` ${calculatedAmount -
        eightPercDeduction.toFixed(2)}`;
      doc.text("$50 per load", { width: 200, align: "left" });
      doc.text(fiftyDeductionText, { width: 200, align: "left" });
      const calculatedAmountText = `$${calculatedAmount.toFixed(2)}`;
      doc.text(calculatedAmountText, {
        width: 200 + dollarSignWidth,
        align: "left",
      });
      doc.text("Payroll Deduction 8%", { width: 200, align: "left" });
      doc.text(`- $${eightPercDeduction.toFixed(2)}`, {
        width: 200,
        align: "left",
      });
    }
    if (isThirtyPercentChecked) {
      // Calculate the total amount before deductions
      const totalBeforeDeductions = loads.reduce(
        (total, load) => total + parseFloat(load.amount),
        0
      );
    
      // Calculate the amount given to the driver (30%)
      const amountToDriver = totalBeforeDeductions * 0.3; // 30% to driver
        console.log(amountToDriver)
      // Subtract cash advance and insurance from the amount given to the driver
      totalAfterDeductions = amountToDriver - cashAdvance - insurance;
        console.log(totalAfterDeductions)
    }
    if (deductions.length > 0) {
      doc.text("Deductions:", { width: 200, align: "left" });
    
      deductions.forEach((deduction) => {
        const deductionText = `- ${deduction.name}: $${deduction.amount.toFixed(2)}`;
        doc.text(deductionText, {
          width: 200 + dollarSignWidth,
          align: "left",
        });
      });
    }
    

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








