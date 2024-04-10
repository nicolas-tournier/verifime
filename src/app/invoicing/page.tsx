import InvoicingConverge, { T_Invoices } from "./components/InvoicingConverge";
import {
  Grid,
  Box
} from "@mui/material";
import { z } from 'zod';
import { fetchCurrencyExchangeRates } from "./api";
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
console.log('importedInvoices', result);

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

  const result = invoicesToUpdate.invoices.map(invoice => {
    const apiData = {
      id: invoice.id,
      date: invoice.date,
      base: invoice.currency,
      to: invoice.lines.map(line => line.currency)
    };

    return apiData;
  });

  const ratesByInvoice = result.map(invoice => {
    return fetchCurrencyExchangeRates(invoice.date, invoice.base, invoice.to)
      .then(resp => ({
        invoiceId: invoice.id,
        date: resp.date,
        base: resp.base,
        rates: resp.rates,
      }));
  });

  const updatedInvoices: Promise<T_Invoices> = Promise.all(ratesByInvoice)
    .then(response => {
      return invoicesToUpdate.invoices.map((invoice) => {
        console.log('-------------------------------------')
        const invoiceAfterConversion = {
          id: invoice.id,
          totalAfterConversion: invoice.lines.reduce((acc, line) => {
            const rate = (Math.round(response.find(item => item.invoiceId === invoice.id)!.rates[line.currency] * 10000) / 10000);
            console.log('currency', line.currency);
            console.log('line.amount', line.amount);
            console.log('rate', rate);
            const converted = rate * line.amount;
            console.log('converted', converted);
            const accum = acc + converted;
            console.log('accum', accum);
            return accum;
          }, 0),
          baseCurrency: invoice.currency,
          issueDate: invoice.date,
          lineItems: invoice.lines
        }
        console.log('invoiceAfterConversion', invoiceAfterConversion);
        return invoiceAfterConversion;
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
