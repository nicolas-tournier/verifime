import InvoicingConverge, { T_Invoices } from "./components/InvoicingConverge";
import {
  Grid,
  Box
} from "@mui/material";

import { fetchCurrency } from "./api";
import { invoiceDummyData, T_InvoicesData } from "./components/invoice_dummy_data";

let invoices: T_Invoices = [];

// preserve dummy data. remove proto chain.
const importedInvoices: T_InvoicesData = JSON.parse(JSON.stringify(invoiceDummyData));

// if there are invoices in the dummy data, map them to the invoices array
// note that id's not used for anything but tracking (invoice # will be derived from invoice id for convenience)

if (importedInvoices.invoices) {
  invoices = importedInvoices.invoices.map((invoice, index) => {
    return {
      id: index,
      baseCurrency: invoice.currency,
      totalAfterConversion: 0, // this will be calculated via the conversion API once loaded to invoices
      issueDate: invoice.date,
      lineItems: invoice.lines.map((lineItem, lineIndex) => ({ ...lineItem, id: lineIndex }))
    }
  });
  console.log('invoices ', invoices);
}

async function onUpdateInvoicingConversions(invoicesToUpdate: T_InvoicesData): Promise<T_Invoices>{
  'use server'
  const promises = invoicesToUpdate.invoices.map(invoice => {
    const linePromises = invoice.lines.map(line => {
      return fetchCurrency(line.amount, line.currency, invoice.currency)
        .then(conversion => ({
          invoiceId: invoice.id,
          lineId: line.id,
          conversion
        }))
    }
    );
    return Promise.all(linePromises);
  });

  const updatedInvoices: Promise<T_Invoices> = Promise.all(promises.flat())
    .then(resp => {
      const response = resp.flat();
      return invoicesToUpdate.invoices.map((invoice) => {
        return {
          id: invoice.id,
          totalAfterConversion: invoice.lines.reduce((acc, line) => {
            return acc + (response.find(item => item.invoiceId === invoice.id && item.lineId === line.id)!.conversion?.amount || 0);
          }, 0),
          baseCurrency: invoice.currency,
          issueDate: invoice.date,
          lineItems: invoice.lines
        }
      }) as T_Invoices;
    })
    .catch(error => {
      console.error(error);
      return [] as T_Invoices;
    });

  return updatedInvoices;
}

export default function Invoicing() {
  return (
    <main>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <InvoicingConverge invoices={invoices} onUpdateInvoicingConversions={onUpdateInvoicingConversions} />
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
