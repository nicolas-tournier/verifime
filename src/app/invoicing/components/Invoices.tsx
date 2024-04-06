'use client';

import { useEffect, useState } from "react";
import Invoice, { T_Invoice } from "./Invoice";
import {
  Grid,
  Box
} from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { boxTheme } from "@/constants/themes";
import { T_InvoicesData } from "./invoice_dummy_data";

export type T_Invoices = Array<T_Invoice>;

export default function Invoices({ _invoices, onUpdateInvoicingConversions }: { _invoices?: T_Invoices, onUpdateInvoicingConversions: Function }) {

  const initialInvoices: T_Invoices = _invoices || [
    {
      id: 0,
      baseCurrency: 'NZD',
      issueDate: dayjs().format('YYYY-MM-DD'),
      lineItems: [
        { id: 0, description: "", currency: "NZD", amount: 0 }
      ]
    }
  ];

  const boxThemeInvoices = {
    ...boxTheme,
    borderWidth: '2px',
    margin: '20px 10px'
  }

  const [invoices, setInvoices] = useState<T_Invoices>(initialInvoices);

  const onUpdateInvoiceConversion = (invoice: T_Invoice) => {
    const _invoices = [...invoices];
    _invoices[invoice.id] = invoice;
    setInvoices(_invoices);
  }

  useEffect(() => {
    const _invoices: T_InvoicesData = {
      invoices: invoices.map((invoice) => {
        return {
          id: invoice.id,
          currency: invoice.baseCurrency,
          date: invoice.issueDate,
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
    onUpdateInvoicingConversions(serializedInvoices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices]);

  return (
    <main>
      {invoices.map((invoice, index) => (
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