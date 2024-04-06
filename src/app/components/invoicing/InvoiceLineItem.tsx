import { invoiceCurrencies } from "@/constants/invoice-currencies";
import {
    Button,
    TextField,
    Grid,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent
} from "@mui/material";
import { useEffect, useState } from "react";

export type T_InvoiceLineItem = {
    id: number;
    description: string;
    currency: string;
    amount: number;
}

export default function InvoiceLineItem({ lineItem, id, updateLineItems }: { lineItem: T_InvoiceLineItem, id: number, updateLineItems: Function }) {

    //id will be needed when remove is clicked
    const [description, setDesciption] = useState(lineItem.description || '');
    const [currency, setCurrency] = useState(lineItem.currency || 'NZD');
    const [amount, setAmount] = useState(lineItem.amount || 0);

    const handleDescriptionChange = (description: string) => {
        setDesciption(description);
    };

    const handleCurrencyChange = (event: SelectChangeEvent) => {
        setCurrency(event.target.value as string);
    };

    const handleAmountChange = (amount: string) => {
        setAmount(+amount);
    };

    useEffect(() => {
        const formValue = {
            id,
            description,
            currency,
            amount
        };

        updateLineItems(formValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description, currency, amount]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <FormControl>
                        <TextField
                            id="outlined-basic"
                            label="Description"
                            variant="outlined"
                            value={description}
                            onChange={(event) => handleDescriptionChange(event.target.value)} />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl style={{ width: '100%' }}>
                        <InputLabel id="base-currency-label-helper">Currency</InputLabel>
                        <Select
                            labelId="base-currency-label-helper"
                            id="base-currency-label"
                            label="Currency"
                            value={currency}
                            fullWidth
                            displayEmpty
                            onChange={handleCurrencyChange}
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
                    <FormControl>
                        <TextField
                            id="outlined-basic"
                            label="Amount"
                            variant="outlined"
                            value={amount}
                            onChange={(event) => { handleAmountChange(event.target.value) }} />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl>
                        <Button
                            variant="outlined"
                            color="error"
                            size="large"
                            sx={{ height: '56px' }}
                        >REMOVE</Button>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}