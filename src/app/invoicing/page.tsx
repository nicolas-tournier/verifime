import InvoicingConverge, { T_Invoices } from "./components/InvoicingConverge";
import {
  Grid,
  Box
} from "@mui/material";

import { fetchCurrency, fetchCurrencyExchangeRates } from "./api";
import { T_InvoicesData } from "./components/invoice-dummy-data";
import { invoiceInit } from "./components/init-values";
import ErrorBoundary from "../ErrorBoundary";

// note that id's not used for anything but tracking (invoice # will be derived from invoice id for convenience)
const invoices = invoiceInit as T_Invoices;

async function onUpdateInvoicingConversions(invoicesToUpdate: T_InvoicesData): Promise<T_Invoices> {
  'use server'

  let calculationMethod = 'rates';
  
  if (calculationMethod === 'convert') {
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
        console.error('Error updating invoices', error);
        throw new Error('Error updating invoices.');
      });


    return updatedInvoices;
  } else {
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
          const invoiceAfterConversion = {
            id: invoice.id,
            totalAfterConversion: invoice.lines.reduce((acc, line) => {
              const rate = (Math.round(response.find(item => item.invoiceId === invoice.id)!.rates[line.currency] * 10000) / 10000);
              const converted = line.amount / rate;
              const accum = acc + converted;
              return accum;
            }, 0),
            baseCurrency: invoice.currency,
            issueDate: invoice.date,
            lineItems: invoice.lines
          }
          return invoiceAfterConversion;
        }) as T_Invoices;
      })
      .catch(error => {
        console.error('Error updating invoices ', error);
        throw new Error('Error updating invoices.');
      });

    return updatedInvoices;
  }
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
