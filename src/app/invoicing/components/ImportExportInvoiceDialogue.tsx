import {
    DialogContentText,
    DialogContent,
    DialogTitle,
    Dialog,
    Button,
    DialogActions,
    TextField
} from "@mui/material";
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
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}