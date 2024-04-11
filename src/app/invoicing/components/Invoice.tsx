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
import dayjs from 'dayjs';
import { isEqual, uniqWith } from "lodash";
import InvoiceLineItem, { T_InvoiceLineItem } from "./InvoiceLineItem";
import { useEffect, useRef, useState } from "react";
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
  const [duplicatesStatus, setDuplicatesStatus] = useState<T_Duplicates>([{ id: -1, duplicate: false }]);
  const prevInvoiceRef = useRef(updatedInvoice);

  useEffect(() => {
    setUpdatedInvoice(invoice);
  }, [invoice]);

  useEffect(() => {
    if (prevInvoiceRef.current.baseCurrency !== updatedInvoice.baseCurrency ||
      !isEqual(prevInvoiceRef.current.lineItems, updatedInvoice.lineItems)) {
      const formValue = {
        id,
        issueDate: updatedInvoice.issueDate,
        baseCurrency: updatedInvoice.baseCurrency,
        lineItems: uniqWith(updatedInvoice.lineItems, (a, b) => {
          return a.description === b.description &&
            a.currency === b.currency &&
            a.amount === b.amount;
        })
      };

      onUpdateInvoiceConversion(formValue);
    }
    prevInvoiceRef.current = updatedInvoice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedInvoice]);

  const checkForDuplicates = () => {
    const duplicates = updatedInvoice.lineItems.filter((item, index, self) =>
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
  }, [updatedInvoice.lineItems]);

  const onUpdateLineItem = (lineItem: T_InvoiceLineItem) => {
    setUpdatedInvoice(prevState => {
      const newLineItems = [...prevState.lineItems];
      newLineItems[lineItem.id] = lineItem;
  
      return {
        ...prevState,
        lineItems: newLineItems
      };
    });
  }
  
  const handleBaseCurrencyChange = (event: SelectChangeEvent) => {
    const invoice = {
      ...updatedInvoice,
      baseCurrency: event.target.value
    }
    setUpdatedInvoice(invoice);
  };

  const handleIssueDateChange = (date: dayjs.Dayjs) => {
    const invoice = {
      ...updatedInvoice,
      date
    }
    setUpdatedInvoice(invoice);
  };

  const handleRemoveLineItem = (id: number) => {
    const newLineItems = updatedInvoice.lineItems.filter((item, index) => index !== id);
    setUpdatedInvoice({ ...updatedInvoice, lineItems: newLineItems });
  };

  const handleAddLineItem = () => {
    const newLineItems = [...updatedInvoice.lineItems, {
      ...lineItemInit,
      id: updatedInvoice.lineItems.length
    }];
    setUpdatedInvoice({ ...updatedInvoice, lineItems: newLineItems });
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
                    value={dayjs(updatedInvoice.issueDate)}
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
                    value={updatedInvoice.baseCurrency}
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
              {updatedInvoice.lineItems?.map((lineItem, index) => (
                <Grid item xs={12} key={lineItem.id}>
                  <InvoiceLineItem
                    lineItem={lineItem}
                    id={index}
                    onUpdateLineItem={onUpdateLineItem}
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