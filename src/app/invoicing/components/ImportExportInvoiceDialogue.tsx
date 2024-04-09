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
import { z } from 'zod';

export default function ImportExportInvoiceDialogue({ onOpenImportExportInvoiceDialogue, onCloseImportExportInvoiceDialogue }: { onOpenImportExportInvoiceDialogue: boolean, onCloseImportExportInvoiceDialogue: (value: string) => void, }) {

    const [dialogueIsOpen, setDialogueIsOpen] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState<string>('');

    useEffect(() => {
        if (onOpenImportExportInvoiceDialogue) {
            setDialogueIsOpen(true);
        }
    }, [onOpenImportExportInvoiceDialogue]);

    const validateInput = useCallback((input: string) => {

        let parsedInput;
        try {
            parsedInput = JSON.parse(input);
        } catch (error) {
            console.error('Failed to parse JSON', error);
            throw new Error('Invalid JSON');
        }

        const lineSchema = z.object({
            description: z.string(),
            currency: z.string(),
            amount: z.number(),
        });

        const invoiceSchema = z.object({
            currency: z.string(),
            date: z.string(),
            lines: z.array(lineSchema),
        });

        const invoicesSchema = z.object({
            invoices: z.array(invoiceSchema),
        });

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
        onCloseImportExportInvoiceDialogue(textFieldValue);
    };

    const handleOK = () => {
        if (textFieldValue === '') return;

        if (validateInput(textFieldValue)) {
            handleClose();
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