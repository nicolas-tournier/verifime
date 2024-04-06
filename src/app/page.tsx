import Invoices, { T_Invoices } from "./components/invoicing/Invoices";
import {
  Grid,
  Box
} from "@mui/material";

import { invoiceDummyData, T_InvoiceData } from "./components/invoicing/invoice_dummy_data";

let invoices: T_Invoices = [];

// preserve dummy data. remove proto chain.
const importedInvoices: T_InvoiceData = JSON.parse(JSON.stringify(invoiceDummyData));

if (importedInvoices.invoices) {
  invoices = importedInvoices.invoices.map((invoice, index) => {
    return {
      id: index,
      baseCurrency: invoice.currency,
      issueDate: invoice.date,
      lineItems: invoice.lines.map((lineItem, lineIndex) => ({ ...lineItem, id: lineIndex }))
    }
  });
}

async function onUpdateInvoices(invoices: T_InvoiceData) {
  'use server'
  // we could save the invoices to the server here but will not

  const promises = invoices.map(invoice => {
    // For each invoice, create a promise for each line item
    const linePromises = invoice.lines.map(line =>
      fetchCurrency(line.amount, line.currency, invoice.currency)
    );
    // Return the array of promises for the line items of this invoice
    return Promise.all(linePromises);
  });

  // Run all the promises in parallel
  Promise.all(promises.flat())
    .then(results => {
      console.log(results); // Logs the results of all the fetchCurrency calls
    })
    .catch(error => {
      console.error(error); // Logs any error that occurred
    });

  console.log('Invoices updated ', invoices);
}

export default function Home() {
  return (
    <main>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Invoices _invoices={invoices} onUpdateInvoices={onUpdateInvoices} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Content for the top right cell goes here */}
              </Grid>
              <Grid item xs={12}>
                {/* Content for the bottom right cell goes here */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
