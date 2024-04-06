'use client';

import { useState } from "react";
import Invoice, { T_Invoice } from "./Invoice";
import {
  Grid,
  Box
} from "@mui/material";
import { boxTheme } from "@/constants/themes";

export type T_Invoices = Array<T_Invoice>;

export default function Invoices({ _invoices }: { _invoices?: T_Invoices }) {

  const initialInvoices: T_Invoices = _invoices || []

  const boxThemeInvoices = {
    ...boxTheme,
    borderWidth: '2px',
    margin: '20px 10px'
  }

  const [invoices, setInvoices] = useState<T_Invoices>(initialInvoices);

  return (
    <main>
      {invoices.map((invoice, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item p={2} xs={12} sx={boxThemeInvoices}>
            <Invoice invoice={invoice} id={index} />
          </Grid>
        </Grid>
      ))}

      <Box>

      </Box>
    </main>
  );
}