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
import { on } from "events";
import { useEffect, useState } from "react";

export type T_InvoiceLineItem = {
    id: number;
    description: string;
    currency: string;
    amount: number;
}

export default function InvoiceLineItem({ lineItem, id, onUpdateLineItemConversion, onRemoveLineItem }: { lineItem: T_InvoiceLineItem, id: number, onUpdateLineItemConversion: Function, onRemoveLineItem: Function }) {

    //id will be needed when remove is clicked

    const [updatedLineItem, setUpdatedLineItem] = useState<T_InvoiceLineItem>(lineItem);
    const [description, setDesciption] = useState(updatedLineItem.description || '');
    const [currency, setCurrency] = useState(updatedLineItem.currency || 'NZD');
    const [amount, setAmount] = useState(updatedLineItem.amount || 0);
    const [error, setError] = useState(false);

    const handleDescriptionChange = (description: string) => {
        setDesciption(description);
    };

    const handleCurrencyChange = (event: SelectChangeEvent) => {
        setCurrency(event.target.value as string);
    };

    const handleAmountChange = (amount: string) => {
        if (!/^(\d+\.?\d{0,2}|\.\d{1,2})$/.test(amount) && amount !== "") {
            setError(true);
        } else {
            setError(false);
            +amount === 0 ? setAmount(.01) : setAmount(+amount);
        }
    };

    const onRemove = (id: number) => {
        onRemoveLineItem(id);
    }

    useEffect(() => {
        const formValue = {
            id,
            description,
            currency,
            amount
        };

        setUpdatedLineItem(formValue);
        onUpdateLineItemConversion(formValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, amount, id]); // this doesn't capture changes to description, as saving the invoice would be a separate API call

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
                            type="number"
                            InputProps={{
                                inputProps: {
                                    step: 1,
                                    min: 0.01
                                },
                            }}
                            error={error}
                            helperText={error ? 'Only numbers are allowed' : ''}
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
                            onClick={() => onRemove(id)}
                        >REMOVE</Button>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}