import Invoices, { T_Invoices } from "./components/Invoices";
import {
  Grid,
  Box
} from "@mui/material";

import { fetchCurrency } from "./api";
import { invoiceDummyData, T_InvoicesData } from "./components/invoice_dummy_data";

let invoices: T_Invoices = [];

// preserve dummy data. remove proto chain.
const importedInvoices: T_InvoicesData = JSON.parse(JSON.stringify(invoiceDummyData));

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

async function onUpdateInvoicingConversions(invoicesToUpdate: T_InvoicesData) {
  'use server'

  const promises = invoicesToUpdate.invoices.map(invoice => {
    const linePromises = invoice.lines.map(line =>
      fetchCurrency(line.amount, line.currency, invoice.currency)
        .then(conversion => ({
          invoiceId: invoice.id,
          lineId: line.id,
          conversion
        }))
    );
    return Promise.all(linePromises);
  });

  Promise.all(promises.flat())
    .then(response => {
      const results = response.flat();
      invoices = invoicesToUpdate.invoices.map((invoice) => {
        return {
          id: invoice.id,
          baseCurrency: invoice.currency,
          issueDate: invoice.date,
          lineItems: invoice.lines.map((line, index) => {
            return {
              ...line,
              amount: results.find(result => result.invoiceId === invoice.id && result.lineId === index)!.conversion?.amount || 0
            }
          })
        }
      });

      console.log('invoices ', invoices);
    })
    .catch(error => {
      console.error(error);
    });
}

export default function Invoicing() {
  return (
    <main>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Invoices _invoices={invoices} onUpdateInvoicingConversions={onUpdateInvoicingConversions} />
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
