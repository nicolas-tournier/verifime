import {
  Box,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Button
} from "@mui/material";

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { uniqWith } from "lodash";
import InvoiceLineItem, { T_InvoiceLineItem } from "./InvoiceLineItem";
import { useEffect, useState } from "react";
import { invoiceCurrencies } from "@/constants/invoice-currencies";
import { lineItemInit } from "./init-values";

export type T_Invoice = {
  id: number;
  totalAfterConversion: number;
  baseCurrency: string;
  issueDate: string;
  lineItems: Array<T_InvoiceLineItem>;
}

export type T_Duplicates = Array<{
  id: number;
  duplicate: boolean;
}>

export default function Invoice({ invoice, id, onUpdateInvoiceConversion }: { invoice: T_Invoice, id: number, onUpdateInvoiceConversion: Function }) {

  const [updatedInvoice, setUpdatedInvoice] = useState<T_Invoice>(invoice);
  const [issueDate, setIssueDate] = useState<Dayjs | null>(invoice.issueDate ? dayjs(invoice.issueDate) : dayjs());
  const [baseCurrency, setBaseCurrency] = useState(updatedInvoice.baseCurrency || 'NZD');
  const [lineItems, setLineItems] = useState(updatedInvoice.lineItems || []);
  const [duplicatesStatus, setDuplicatesStatus] = useState<T_Duplicates>([{ id: -1, duplicate: false }]);

  useEffect(() => {
    setUpdatedInvoice(invoice);
  }, [invoice]);

  useEffect(() => {
    const formValue = {
      id,
      issueDate,
      baseCurrency,
      lineItems: uniqWith(lineItems, (a, b) => {
        return a.description === b.description &&
          a.currency === b.currency &&
          a.amount === b.amount;
      })
    };

    onUpdateInvoiceConversion(formValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCurrency, lineItems, id]);

  const handleBaseCurrencyChange = (event: SelectChangeEvent) => {
    setBaseCurrency(event.target.value as string);
  };

  const handleIssueDateChange = (date: dayjs.Dayjs) => {
    setIssueDate(date);
  };

  const checkForDuplicates = () => {
    const duplicates = lineItems.filter((item, index, self) =>
      self.some((other, otherIndex) =>
        otherIndex !== index &&
        other.description === item.description &&
        other.currency === item.currency &&
        other.amount === item.amount
      )
    ).map(item => ({ id: item.id, duplicate: true }));
    
    setDuplicatesStatus(duplicates);
  };

  useEffect(() => {
    checkForDuplicates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineItems]);

  const onUpdateLineItemConversion = (lineItem: T_InvoiceLineItem) => {
    setLineItems(prevLineItems => {
      const updatedLineItems = [...prevLineItems];
      updatedLineItems[lineItem.id] = lineItem;
      return updatedLineItems;
    });
  }

  const handleRemoveLineItem = (id: number) => {
    setLineItems(lineItems.filter((item, index) => index !== id));
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, {
      ...lineItemInit,
      id: lineItems.length
    }]);
  };

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: '2rem'
        }}>INVOICE # {updatedInvoice.id + 1}</Typography>

      <form>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box>
            <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <DatePicker
                    label="Invoice Issue Date"
                    value={issueDate}
                    onAccept={(value) => handleIssueDateChange(value!)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ marginRight: '1rem' }}>
                <FormControl fullWidth>
                  <InputLabel id="base-currency-label-helper">Base Currency</InputLabel>
                  <Select
                    labelId="base-currency-label-helper"
                    id="base-currency-label"
                    label="Base Currency"
                    value={baseCurrency}
                    fullWidth
                    displayEmpty
                    onChange={handleBaseCurrencyChange}
                  >
                    {invoiceCurrencies.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    fontSize: 14,
                    fontWeight: 'semibold'
                  }}
                >
                  TOTAL
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                >
                  {updatedInvoice.totalAfterConversion ? (Math.round(updatedInvoice.totalAfterConversion * 100) / 100).toFixed(2) : ''}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    color: '#3846b6'
                  }}>LINE ITEMS</Typography>
              </Grid>
              {lineItems?.map((lineItem, index) => (
                <Grid item xs={12} key={lineItem.id}>
                  <InvoiceLineItem
                    lineItem={lineItem}
                    id={index}
                    onUpdateLineItemConversion={onUpdateLineItemConversion}
                    onRemoveLineItem={handleRemoveLineItem}
                    isDuplicate={duplicatesStatus.some((status) => status.id === lineItem.id && status.duplicate)} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" color="primary" onClick={handleAddLineItem}>ADD LINE ITEM</Button>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </form >
    </>
  );
}