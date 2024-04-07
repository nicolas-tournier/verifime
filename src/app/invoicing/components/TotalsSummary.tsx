'use client';

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

import { boxTheme } from "@/constants/themes";
import { T_Invoices } from "./InvoicingConverge";
import { useEffect, useMemo, useState } from "react";
import { invoiceCurrencies } from "@/constants/invoice-currencies";

export default function TotalsSummary({ invoices }: { invoices?: T_Invoices }) {

    const boxThemeInvoices = {
        ...boxTheme,
        borderWidth: '2px',
        margin: '20px 10px'
    }

    const currencyNames = useMemo(() => {
        return invoiceCurrencies.reduce((acc, curr) => {
            acc[curr.code] = curr.name;
            return acc;
        }, {} as Record<string, string>);
    }, []);

    const [totalsByCurrency, setTotalsByCurrency] = useState<Record<string, number>>({});
    const [totalsByLineItem, setTotalsByLineItem] = useState<Record<string, number>>({});

    useEffect(() => {
        const newTotalsByCurrency: Record<string, number> = {};
        const newTotalsByLineItem: Record<string, number> = {};

        invoices!.forEach(invoice => {
            if (!newTotalsByCurrency[invoice.baseCurrency]) {
                newTotalsByCurrency[invoice.baseCurrency] = 0;
            }
            newTotalsByCurrency[invoice.baseCurrency] += invoice.totalAfterConversion;

            invoice.lineItems.forEach(line => {
                if (!newTotalsByLineItem[line.currency]) {
                    newTotalsByLineItem[line.currency] = 0;
                }

                newTotalsByLineItem[line.currency] += line.amount;
            });
        });

        setTotalsByCurrency(newTotalsByCurrency);
        setTotalsByLineItem(newTotalsByLineItem);
    }, [invoices]);

    return (
        <>
            <Typography
                variant="h2"
                sx={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    marginTop: '0.5rem'
                }}>TOTALS</Typography>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={boxThemeInvoices}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                color: '#3846b6'
                            }}>INVOICE TOTALS</Typography>
                        {Object.entries(totalsByCurrency).map(([currency, total], index) => (
                            <Grid container justifyContent="space-between" key={index}>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 'semibold',
                                        marginBottom: '1rem',
                                    }}>{currencyNames[currency]}</Typography>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        marginBottom: '1rem',
                                    }}>{!isNaN(total) ? total.toFixed(2) : ''}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={boxThemeInvoices}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                color: '#3846b6'
                            }}>LINE TOTALS</Typography>
                        {Object.entries(totalsByLineItem).map(([currency, total], index) => (
                            <Grid container justifyContent="space-between" key={index}>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 'semibold',
                                        marginBottom: '1rem',
                                    }}>{currencyNames[currency]}</Typography>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        marginBottom: '1rem',
                                    }}>{!isNaN(total) ? total.toFixed(2) : ''}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}