'use client';

import { useEffect, useMemo, useState } from "react";
import Invoice, { T_Invoice } from "./Invoice";
import {
  Grid,
  Box
} from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { boxTheme } from "@/constants/themes";
import { T_InvoicesData } from "./invoice_dummy_data";

export type T_Invoices = Array<T_Invoice>;

export default function InvoicingConverge({ invoices, onUpdateInvoicingConversions }: { invoices?: T_Invoices, onUpdateInvoicingConversions: Function }) {

  const boxThemeInvoices = {
    ...boxTheme,
    borderWidth: '2px',
    margin: '20px 10px'
  }

  // when invoices value is passed in as []
  const initInvoices = useMemo(() => [
    {
      id: 0,
      totalAfterConversion: 0,
      baseCurrency: 'NZD',
      issueDate: dayjs().format('YYYY-MM-DD'),
      lineItems: [
        { id: 0, description: "", currency: "NZD", amount: 0 }
      ]
    }
  ], []);

  const [updatedInvoices, setUpdatedInvoices] = useState<T_Invoices>(invoices || initInvoices);

  useEffect(() => {
    const _invoices: T_InvoicesData = {
      invoices: updatedInvoices.map((invoice) => {
        console.log('totalAfterConversion ', invoice.totalAfterConversion)
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
        // Only update the state if the new invoices are different from the current ones
        if (JSON.stringify(newInvoices) !== JSON.stringify(updatedInvoices)) {
          setUpdatedInvoices(newInvoices);
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedInvoices]);

  const onUpdateInvoiceConversion = (invoice: T_Invoice) => {
    const _invoices = [...updatedInvoices];
    _invoices[invoice.id] = invoice;
    setUpdatedInvoices(_invoices);
  }

  return (
    <main>
      {updatedInvoices.map((invoice, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item p={2} xs={12} sx={boxThemeInvoices}>
            <Invoice invoice={invoice} id={index} onUpdateInvoiceConversion={onUpdateInvoiceConversion} />
          </Grid>
        </Grid>
      ))}

      <Box>

      </Box>
    </main>
  );
}