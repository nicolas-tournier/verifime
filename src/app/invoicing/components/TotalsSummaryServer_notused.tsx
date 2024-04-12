'use server';

import {
    Box,
    Grid,
    Typography
} from "@mui/material";

import { boxTheme } from "@/constants/themes";
import { T_Invoices } from "./InvoicingConverge";
import { invoiceCurrencies } from "@/constants/invoice-currencies";

export default async function TotalsSummary({ invoices }: { invoices?: T_Invoices }) {

    const boxThemeInvoices = {
        ...boxTheme,
        borderWidth: '2px',
        margin: '20px 10px'
    }

    const currencyNames = invoiceCurrencies.reduce((acc, curr) => {
        acc[curr.code] = curr.name;
        return acc;
    }, {} as Record<string, string>);



    const totalsByCurrency: Record<string, number> = {};
    const totalsByLineItem: Record<string, number> = {};

    invoices?.forEach(invoice => {
        if (!totalsByCurrency[invoice.baseCurrency]) {
            totalsByCurrency[invoice.baseCurrency] = 0;
        }
        totalsByCurrency[invoice.baseCurrency] += invoice.totalAfterConversion;

        invoice.lineItems.forEach(line => {
            if (!totalsByLineItem[line.currency]) {
                totalsByLineItem[line.currency] = 0;
            }

            totalsByLineItem[line.currency] += line.amount;
        });
    });

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
                                    }}>{!isNaN(total) ? (Math.round(total * 100) / 100).toFixed(2) : ''}</Typography>
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
                                    }}>{!isNaN(total) ? (Math.round(total * 100) / 100).toFixed(2) : ''}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}