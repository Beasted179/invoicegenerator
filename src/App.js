import React, { useState } from 'react';
import Header from './components/Header';
import LoadForm from './components/LoadForm';
import InvoiceDisplay from './components/InvoiceDisplay.js';

const App = () => {
  const [invoiceAmount, setInvoiceAmount] = useState(0);

  // Function to calculate invoice amount based on input data
  const calculateInvoice = (data) => {
    // Calculate and update invoiceAmount
    setInvoiceAmount(/* calculated value */);
  };

  return (
    <div>
      <Header />
      <main>
        <LoadForm calculateInvoice={calculateInvoice} />
        <InvoiceDisplay invoiceAmount={invoiceAmount} />
      </main>
    </div>
  );
};

export default App;


