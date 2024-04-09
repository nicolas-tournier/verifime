'use client';

import { useEffect, useState } from "react";
import Invoice, { T_Invoice } from "./Invoice";
import {
  Grid,
  Box,
  Button
} from "@mui/material";
import { boxTheme } from "@/constants/themes";
import { T_InvoicesData } from "./invoice-dummy-data";
import TotalsSummary from "./TotalsSummary";
import { invoiceInit } from "./init-values";
import ImportExportInvoiceDialogue from "./ImportExportInvoiceDialogue";


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
        throw new Error('Error updating invoice convergence');
        // wont show up in production.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedInvoices]);

  const onUpdateInvoiceConversion = (invoice: T_Invoice) => {
    const _invoices = [...updatedInvoices];
    _invoices[invoice.id] = invoice;
    setUpdatedInvoices(_invoices);
  }

  const [importExportInvoiceDialogueOpen, setImportExportInvoiceDialogueOpen] = useState(false);

  const handleClickOpenImportExportDialogue = () => {
    setImportExportInvoiceDialogueOpen(true);
  };

  const onCloseImportExportInvoiceDialogue = (importedInvoicesString: string) => {
    console.log('importedInvoices', importedInvoicesString);
    const importedInvoicesData: T_InvoicesData = JSON.parse(importedInvoicesString) as T_InvoicesData;
    let _invoices: T_Invoices = [];
    if (importedInvoicesData) {
      if (importedInvoicesData.invoices.length > 0) {
        _invoices = importedInvoicesData.invoices.map((invoice, index) => {
          return {
            id: index,
            baseCurrency: invoice.currency,
            totalAfterConversion: 0, // this will be calculated via the conversion API once loaded to invoices
            issueDate: invoice.date,
            lineItems: invoice.lines.map((lineItem, lineIndex) => ({ ...lineItem, id: lineIndex }))
          }
        }) as T_Invoices;
      }
      setUpdatedInvoices(_invoices as T_Invoices);
    }
    setImportExportInvoiceDialogueOpen(false);
  };

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
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpenImportExportDialogue}
                sx={{
                  margin: '-2rem 0.5rem 2rem 0'
                }}>
                IMPORT/EXPORT
              </Button>
            </Grid>
          </Grid>
          <TotalsSummary invoices={updatedInvoices} />
        </Grid>
      </Grid>
      <ImportExportInvoiceDialogue onOpenImportExportInvoiceDialogue={importExportInvoiceDialogueOpen} onCloseImportExportInvoiceDialogue={onCloseImportExportInvoiceDialogue} />
    </main>
  );
}