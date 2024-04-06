import Invoices, { T_Invoices } from "./components/invoicing/Invoices";
import {
  Grid,
  Box
} from "@mui/material";

import { invoiceDummyData, T_InvoiceDummyData } from "./components/invoicing/invoice_dummy_data";

// preserve dummy data. remove proto chain.
const importedInvoices: T_InvoiceDummyData = JSON.parse(JSON.stringify(invoiceDummyData));

const invoices: T_Invoices = importedInvoices.invoices.map((invoice, index) => {
  return {
    id: index,
    baseCurrency: invoice.currency,
    issueDate: invoice.date,
    lineItems: invoice.lines.map((lineItem, lineIndex) => ({ ...lineItem, id: lineIndex }))
  }
});

export default function Home() {
  return (
    <main>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            {/* Content for the left column goes here */}
            <Invoices _invoices={invoices} />
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
