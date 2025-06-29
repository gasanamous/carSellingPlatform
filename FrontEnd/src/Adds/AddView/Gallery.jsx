import { useState } from "react";
import { IconButton } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import './Gallery.css'
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';


export default function Gallery({ open, images, setOpen, setClose }) {
    const [index, setIndex] = useState(0)

    const nextImage = () => {
        setIndex(prevIndex => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
    };

    return (
                <Dialog
                    id="dialog"
                    open={open}
                    onClose={close}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullScreen
                >
                    <DialogContent  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f8f9fa', position : 'relative' }}>
                        <IconButton onClick={setClose} id='close-btn'>
                            <CloseIcon fontSize="large" sx={{ color: 'black' }} />
                        </IconButton>
                        <IconButton id="next-btn" onClick={nextImage}>
                            <NavigateBeforeIcon fontSize="large" sx={{color : 'black'}} />
                        </IconButton>
                        <IconButton id="prev-btn" onClick={prevImage}>
                            <NavigateNextIcon  fontSize="large"  sx={{color : 'black'}}/>
                        </IconButton>
                        <img src={images[index]} alt="" style={{ maxWidth: '100%', maxHeight: '90%' }} />
                    </DialogContent>
                </Dialog>
    )
}