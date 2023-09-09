const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Your /generate-invoice route handler (assuming you have an invoiceController)
const invoiceController = require('./controllers/invoiceController');
app.post('/api/generate-invoice', invoiceController.generateInvoice);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


