import {
  Box,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent
} from "@mui/material";

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import InvoiceLineItem, { T_InvoiceLineItem } from "./InvoiceLineItem";
import { useEffect, useState } from "react";
import { invoiceCurrencies } from "@/constants/invoice-currencies";

export type T_Invoice = {
  id: number;
  baseCurrency: string;
  issueDate: string;
  lineItems: Array<T_InvoiceLineItem>;
}

export default function Invoice({ invoice, id }: { invoice: T_Invoice, id: number }) {

  const [issueDate, setIssueDate] = useState<Dayjs | null>(invoice.issueDate ? dayjs(invoice.issueDate) : dayjs());
  const [baseCurrency, setBaseCurrency] = useState(invoice.baseCurrency || 'NZD');
  const [lineItems, setLineItems] = useState(invoice.lineItems || []);

  const handleBaseCurrencyChange = (event: SelectChangeEvent) => {
    setBaseCurrency(event.target.value as string);
  };

  const handleIssueDateChange = (date: dayjs.Dayjs) => {
    setIssueDate(date);
  };

  const updateLineItem = (lineItem: T_InvoiceLineItem) => {
    const _lineItems = [...lineItems];
    _lineItems[lineItem.id] = lineItem;
    setLineItems(_lineItems);
  }

  useEffect(() => {
    const formValue = {
      id,
      issueDate,
      baseCurrency,
      lineItems: lineItems
    };

    console.log('Form submitted ', formValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueDate, baseCurrency, lineItems]);


  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: '2rem'
        }}>INVOICE # {id}</Typography>

      <form>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box>
            <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
              <Grid item xs={12} sm={4}>
                <FormControl>
                  <DatePicker
                    label="Invoice Issue Date"
                    value={issueDate}
                    onAccept={(value) => handleIssueDateChange(value!)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl style={{ width: '100%' }}>
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
              <Grid item xs={12} sm={4}>
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
                  {600} {/* Replace with the dynamic number */}
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
                <Grid item xs={12} key={index}>
                  <InvoiceLineItem lineItem={lineItem} id={index} updateLineItems={updateLineItem} />
                </Grid>
              ))
              }
            </Grid>
          </Box>
        </LocalizationProvider>
      </form >
    </>
  );
}