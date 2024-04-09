import InvoicingConverge, { T_Invoices } from "./components/InvoicingConverge";
import {
  Grid,
  Box
} from "@mui/material";
import { z } from 'zod';
import { fetchCurrency } from "./api";
import { invoiceDummyData, T_InvoicesData } from "./components/invoice-dummy-data";
import { invoiceInit } from "./components/init-values";
import ErrorBoundary from "../ErrorBoundary";

// preserve dummy data. remove proto chain.
const importedInvoices: T_InvoicesData = JSON.parse(JSON.stringify(invoiceDummyData));
// const importedInvoices: T_InvoicesData = { invoices: [] };

// TODO: use this when implementing the import/export feature
// check imported invoices against schema
const lineSchema = z.object({
  description: z.string(),
  currency: z.string(),
  amount: z.number(),
});

const invoiceSchema = z.object({
  currency: z.string(),
  date: z.string(),
  lines: z.array(lineSchema),
});

const invoicesSchema = z.object({
  invoices: z.array(invoiceSchema),
});

const result = invoicesSchema.safeParse(importedInvoices);

if (!result.success) {
  console.error('Zod validation failed ', result.error);
} else {
  console.log('Zod validation successful');
}

// note that id's not used for anything but tracking (invoice # will be derived from invoice id for convenience)
let invoices: T_Invoices;
if (importedInvoices.invoices.length > 0) {
  invoices = importedInvoices.invoices.map((invoice, index) => {
    return {
      id: index,
      baseCurrency: invoice.currency,
      totalAfterConversion: 0, // this will be calculated via the conversion API once loaded to invoices
      issueDate: invoice.date,
      lineItems: invoice.lines.map((lineItem, lineIndex) => ({ ...lineItem, id: lineIndex }))
    }
  }) as T_Invoices;
} else {
  invoices = invoiceInit as T_Invoices;
}

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
