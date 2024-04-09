import InvoicingConverge, { T_Invoices } from "./components/InvoicingConverge";
import {
  Grid,
  Box
} from "@mui/material";

import { fetchCurrency } from "./api";
import { T_InvoicesData } from "./components/invoice-dummy-data";
import { invoiceInit } from "./components/init-values";
import ErrorBoundary from "../ErrorBoundary";

// note that id's not used for anything but tracking (invoice # will be derived from invoice id for convenience)
const invoices = invoiceInit as T_Invoices;

async function onUpdateInvoicingConversions(invoicesToUpdate: T_InvoicesData): Promise<T_Invoices> {
  'use server'
  const promises = invoicesToUpdate.invoices.map(invoice => {
    const linePromises = invoice.lines.map(line => {
      return fetchCurrency(line.amount, line.currency, invoice.currency)
        .then(conversion => ({
          invoiceId: invoice.id,
          lineId: line.id,
          conversion
        }));
    });
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
      console.error('Error updating invoices ', error);
      throw new Error('Error updating invoices.');
    });


  return updatedInvoices;
}

export default function Invoicing() {
  return (
    <main>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ErrorBoundary>
              <InvoicingConverge invoices={invoices} onUpdateInvoicingConversions={onUpdateInvoicingConversions} />
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
