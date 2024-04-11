import {
    DialogContentText,
    DialogContent,
    DialogTitle,
    Dialog,
    Button,
    DialogActions,
    TextField
} from "@mui/material";
import Check from '@mui/icons-material/Check';
import { useEffect, useState, useCallback } from "react";
import { optional, z } from 'zod';
import { T_InvoicesData } from "./invoice-dummy-data";

export type T_Dialogue = {
    isOpen: boolean;
    exportData: T_InvoicesData;
}

const lineSchema = z.object({
    description: z.string(),
    currency: z.string(),
    amount: z.number(),
});

const invoiceSchema = z.object({
    id: optional(z.number()),
    currency: z.string(),
    date: z.string(),
    lines: z.array(lineSchema),
});

const invoicesSchema = z.object({
    invoices: z.array(invoiceSchema),
});

export default function ImportExportInvoiceDialogue({
    importExportInvoiceDialogueOpen,
    onCloseImportExportInvoiceDialogue
}: {
    importExportInvoiceDialogueOpen: T_Dialogue,
    onCloseImportExportInvoiceDialogue: (value: T_InvoicesData) => void
}) {

    const [dialogueIsOpen, setDialogueIsOpen] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState<string>('');

    useEffect(() => {
        if (importExportInvoiceDialogueOpen.isOpen) {
            const dataString = JSON.stringify(importExportInvoiceDialogueOpen.exportData);
            validateInput(dataString);
            setTextFieldValue(dataString);
            setDialogueIsOpen(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [importExportInvoiceDialogueOpen]);

    const validateInput = useCallback((input: string) => {

        let parsedInput;
        try {
            parsedInput = JSON.parse(input);
        } catch (error) {
            console.error('Failed to parse JSON', error);
            throw new Error('Invalid JSON');
        }

        const result = invoicesSchema.safeParse(parsedInput);

        if (!result.success) {
            console.error('Zod validation failed ', result.error);
        } else {
            console.log('Zod validation successful');
            return true;
        }
    }, []);

    const handleClose = () => {
        setDialogueIsOpen(false);
    };

    const handleOK = () => {
        if (textFieldValue === '') return;
        if (validateInput(textFieldValue)) {
            setDialogueIsOpen(false);
            onCloseImportExportInvoiceDialogue(JSON.parse(textFieldValue) as T_InvoicesData);
        }
    };

    return (
        <Dialog open={dialogueIsOpen} fullWidth maxWidth="md">
            <DialogTitle>Import/Export</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the Invoice JSON here.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Invoice JSON"
                    type="text"
                    fullWidth
                    multiline
                    minRows={10}
                    onChange={(event) => setTextFieldValue(event.target.value)}
                    value={textFieldValue}
                    sx={{
                        overflow: 'auto'
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', marginBottom: '1rem' }}>
                <Button variant="contained" startIcon={<Check />} sx={{ width: '150px' }} onClick={handleOK} >OK</Button>
                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}