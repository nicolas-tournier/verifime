import { invoiceCurrencies } from "@/constants/invoice-currencies";
import {
    Button,
    TextField,
    Grid,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent,
    FormHelperText,
    Box
} from "@mui/material";
import { useEffect, useState } from "react";

export type T_InvoiceLineItem = {
    id: number;
    description: string;
    currency: string;
    amount: number;
}

export default function InvoiceLineItem({
    lineItem,
    id,
    onUpdateLineItemConversion,
    onRemoveLineItem,
    isDuplicate
}: {
    lineItem: T_InvoiceLineItem,
    id: number,
    onUpdateLineItemConversion: Function,
    onRemoveLineItem: Function,
    isDuplicate: boolean
}) {

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
    }, [description, currency, amount, id]);
    // this currently captures changes to description
    // but api data caching doesn't include this param and so the conversion not refetched

    return (
        <>
            <Box sx={{
                border: isDuplicate ? "2px solid lightcoral" : "none",
                padding: isDuplicate ? "15px 0px 10px 10px" : "0px",
                borderRadius: isDuplicate ? "5px" : "0px",
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
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
                        <FormControl fullWidth>
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
                {isDuplicate && <FormHelperText>This line item is a duplicate.</FormHelperText>}
            </Box>
        </>
    );
}