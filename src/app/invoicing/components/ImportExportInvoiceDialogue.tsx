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
import { useEffect, useState } from "react";

export default function ImportExportInvoiceDialogue({ onOpenImportExportInvoiceDialogue, onCloseImportExportInvoiceDialogue }: { onOpenImportExportInvoiceDialogue: boolean, onCloseImportExportInvoiceDialogue: Function }) {

    const [dialogueIsOpen, setDialogueIsOpen] = useState(false);

    useEffect(() => {
        if (onOpenImportExportInvoiceDialogue) {
            setDialogueIsOpen(true);
        }
    }, [onOpenImportExportInvoiceDialogue]);

    const handleClose = () => {
        setDialogueIsOpen(false);
        onCloseImportExportInvoiceDialogue();
    };

    const handleOK = () => {
        handleClose();
        //TODO: Implement the import/export logic
    }

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