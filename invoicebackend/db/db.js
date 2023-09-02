const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  client,
};

// Fetch invoice data from the database
const fetchInvoiceData = async () => {
  try {
    // Implement the query to fetch invoice data from your database
    const queryResult = await client.query('SELECT * FROM invoices');
    return queryResult.rows;
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    throw error;
  }
};

module.exports.fetchInvoiceData = fetchInvoiceData;

