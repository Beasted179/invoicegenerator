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
import DeleteIcon from '@mui/icons-material/Delete';
import { generatePDF } from '../api';

const LoadRow = ({ load, index, handleInputChange, deleteLoadRow }) => {
  return (
    <Grid container spacing={2} key={index} sx={{ marginTop: '20px' }}>
      <Grid item xs={12} sm={3}>
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
      <Grid item xs={12} sm={3}>
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
      <Grid item xs={12} sm={3}>
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
      <Grid item xs={12} sm={3}>
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
      <Grid item xs={12}>
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
  const [generatedPDF, setGeneratedPDF] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [dateCreated, setDateCreated] = useState('');

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
    if (generatedPDF) {
      const blobUrl = URL.createObjectURL(generatedPDF);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'invoice.pdf';
      link.click();
      URL.revokeObjectURL(blobUrl);
    }
  };

  const deleteLoadRow = (index) => {
    const updatedLoads = [...loads];
    updatedLoads.splice(index, 1);
    setLoads(updatedLoads);
  };

  const handleSubmit = async () => {
    const invoiceData = {
      loads: loads,
      cashAdvance: cashAdvance,
      insurance: insurance,
      isEightPercentChecked: isEightPercentChecked,
      isThirtyPercentChecked: isThirtyPercentChecked,
      driverName: driverName,
      dateCreated: dateCreated,
    };

    try {
      const pdfBlob = await generatePDF(invoiceData);
      console.log(pdfBlob);
      // Set showPDFPreview to true after successful submission
      setGeneratedPDF(pdfBlob);
      setShowPDFPreview(true);
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              label="Driver Name"
              value={driverName}
              onChange={(event) => setDriverName(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              label="Date Created"
              InputLabelProps={{ shrink: true }}
              value={dateCreated}
              onChange={(event) => setDateCreated(event.target.value)}
            />
          </Grid>
        </Grid>
        {loads.map((load, index) => (
          <LoadRow
            key={index}
            index={index}
            load={load}
            handleInputChange={handleInputChange}
            deleteLoadRow={() => deleteLoadRow(index)}
          />
        ))}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addLoadRow}>
              Add Load
            </Button>
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Cash Advance"
              value={cashAdvance}
              onChange={(event) => setCashAdvance(parseFloat(event.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Insurance"
              value={insurance}
              onChange={(event) => setInsurance(parseFloat(event.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
        {showPDFPreview && formSubmitted && (
  <>
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












