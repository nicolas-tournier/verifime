'use client';

import { useEffect, useState } from "react";
import Invoice, { T_Invoice } from "./Invoice";
import {
  Grid,
  Box,
  Button
} from "@mui/material";
import { debounce } from 'lodash';
import { boxTheme } from "@/constants/themes";
import { T_InvoicesData } from "./invoice-dummy-data";
import TotalsSummary from "./TotalsSummary";
import { invoiceInit } from "./init-values";


export type T_Invoices = Array<T_Invoice>;

// const ProblemChild = () => {
//   throw new Error('Error thrown from problem child');
//   return <div>Error</div>;
// };

export default function InvoicingConverge({ invoices, onUpdateInvoicingConversions }: { invoices?: T_Invoices, onUpdateInvoicingConversions: Function }) {

  const boxThemeInvoices = {
    ...boxTheme,
    borderWidth: '2px',
    margin: '20px 10px'
  }

  const [updatedInvoices, setUpdatedInvoices] = useState<T_Invoices>(invoices!);

  useEffect(() => {
    const _invoices: T_InvoicesData = {
      invoices: updatedInvoices.map((invoice) => {
        return {
          id: invoice.id,
          currency: invoice.baseCurrency,
          date: invoice.issueDate,
          totalAfterConversion: invoice.totalAfterConversion,
          lines: invoice.lineItems.map((lineItem) => ({
            id: lineItem.id,
            description: lineItem.description,
            currency: lineItem.currency,
            amount: lineItem.amount
          }))
        }
      })
    };

    const serializedInvoices = JSON.parse(JSON.stringify(_invoices));
    onUpdateInvoicingConversions(serializedInvoices)
      .then((newInvoices: T_Invoices) => {
        // only update the state if the new invoices are different from the current ones
        if (JSON.stringify(newInvoices) !== JSON.stringify(updatedInvoices)) {
          setUpdatedInvoices(newInvoices);
        }
      })
      .catch((error: any) => {
        console.error(error);
        throw new Error('Error updating invoice convergence');
        // wont show up in peoduction.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedInvoices]);

  const debouncedSetUpdatedInvoices = debounce(setUpdatedInvoices, 300);

  const onUpdateInvoiceConversion = (invoice: T_Invoice) => {
    const _invoices = [...updatedInvoices];
    _invoices[invoice.id] = invoice;
    debouncedSetUpdatedInvoices(_invoices);
  }

  return (
    <main>
      {/* <ProblemChild /> */}
      <Grid container spacing={2}>
        <Grid item p={2} xs={12} sm={9}>
          {updatedInvoices.map((invoice, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} sx={boxThemeInvoices}>
                <Invoice invoice={invoice} id={index} onUpdateInvoiceConversion={onUpdateInvoiceConversion} />
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const _invoices = [...updatedInvoices];
                _invoices.push(invoiceInit[0]);
                setUpdatedInvoices(_invoices);
              }}
            >+ ADD INVOICE</Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TotalsSummary invoices={updatedInvoices} />
        </Grid>
      </Grid>
    </main>
  );
}