import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Container,
  Paper,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import InvoiceDisplay from './InvoiceDisplay';
import DeleteIcon from '@mui/icons-material/Delete';
import generatePDFContent from './generatePdfContent';

const LoadRow = ({ load, index, handleInputChange, deleteLoadRow }) => {
  return (
    <Grid container spacing={3} key={index}>
      <Grid item xs={3}>
        <TextField
          fullWidth
          variant="outlined"
          type="text"
          label="Broker Name"
          value={load.brokerName}
          name="brokerName"
          onChange={(event) => handleInputChange(event, index)}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          variant="outlined"
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={load.date}
          name="date"
          onChange={(event) => handleInputChange(event, index)}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          variant="outlined"
          type="text"
          label="Notes"
          value={load.notes}
          name="notes"
          onChange={(event) => handleInputChange(event, index)}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          variant="outlined"
          type="number"
          label="Amount"
          value={load.amount}
          name="amount"
          onChange={(event) => handleInputChange(event, index)}
        />
      </Grid>
      <Grid item xs={1}>
        <DeleteIcon
          color="secondary"
          onClick={() => deleteLoadRow(index)}
          style={{ margin: '8px' }}
        />
      </Grid>
    </Grid>
  );
};

const LoadForm = () => {
  const [loads, setLoads] = useState([]);
  const [isEightPercentChecked, setIsEightPercentChecked] = useState(false);
  const [isThirtyPercentChecked, setIsThirtyPercentChecked] = useState(false);
  const [cashAdvance, setCashAdvance] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);  
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const handleInputChange = (event, index) => {
    const { name, value, checked } = event.target;
    const updatedLoads = loads.map((load, i) =>
      i === index ? { ...load, [name]: name === 'isThirtyPercent' ? checked : value } : load
    );
    setLoads(updatedLoads);
  };

  const addLoadRow = () => {
    setLoads([
      ...loads,
      {
        brokerName: '',
        date: '',
        notes: '',
        amount: '',
      },
    ]);
  };
  const handleDownloadPDF = () => {
    // Generate the PDF content here using the input data (loads, calculatedAmount, cashAdvance, insurance)
    const pdfContent = generatePDFContent({
      loads,
      calculatedAmount,
      cashAdvance,
      insurance,
    });
  
    // Create a Blob from the PDF content
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
  
    // Create a download URL for the Blob
    const downloadUrl = URL.createObjectURL(blob);
  
    // Create a link element and simulate a click to trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'invoice.pdf'; // Provide the desired filename here
    document.body.appendChild(link);
  
    // Log the size of the Blob
    console.log('Blob Size:', blob.size);
  
    // Log the link properties before clicking
    console.log('Link Properties Before Click:', {
      href: link.href,
      download: link.download,
    });
  
    link.click();
  
    // Clean up by revoking the download URL
    URL.revokeObjectURL(downloadUrl);
  };
  
  
  
  
  const deleteLoadRow = (index) => {
    const updatedLoads = [...loads];
    updatedLoads.splice(index, 1);
    setLoads(updatedLoads);
  };

  const handleSubmit = async () => {
    if (!isEightPercentChecked && !isThirtyPercentChecked) {
      alert('Please select at least one percentage option.');
      return;
    }

    const deductionData = {
      isEightPercentChecked,
      isThirtyPercentChecked,
      loads,
      cashAdvance,
      insurance,
    };

    try {
      const pdfBlob = await generatePDF(deductionData);

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'invoice.pdf';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '100px' }}>
        {loads.map((load, index) => (
          <LoadRow
            key={index}
            index={index}
            load={load}
            handleInputChange={handleInputChange}
            deleteLoadRow={() => deleteLoadRow(index)}
          />
        ))}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addLoadRow}>
              Add Load
            </Button>
          </Grid>
          <Grid item xs={2}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEightPercentChecked}
                    onChange={() => setIsEightPercentChecked(!isEightPercentChecked)}
                  />
                }
                label="8%"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isThirtyPercentChecked}
                    onChange={() => setIsThirtyPercentChecked(!isThirtyPercentChecked)}
                  />
                }
                label="30%"
              />
              
            </div>
          </Grid>
          <Grid item xs={2}>
  <TextField
    fullWidth
    variant="outlined"
    type="number"
    label="Cash Advance"
    value={cashAdvance}
    onChange={(event) => setCashAdvance(parseFloat(event.target.value))}
  />
</Grid>
<Grid item xs={2}>
  <TextField
    fullWidth
    variant="outlined"
    type="number"
    label="Insurance"
    value={insurance}
    onChange={(event) => setInsurance(parseFloat(event.target.value))}
  />
</Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
        {showPDFPreview && formSubmitted && (
  <>
    <InvoiceDisplay
      loads={loads}
      calculatedAmount={calculatedAmount}
      cashAdvance={cashAdvance}
      insurance={insurance}
    />
    <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
      Download PDF
    </Button>
  </>
)}

      </Paper>
    </Container>
  );
};

export default LoadForm;












