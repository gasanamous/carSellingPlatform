import styled from "styled-components";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { TextField, Tooltip, Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';

const StyledB = styled.label`
    @media (width <= 768px) {
        font-size: 12px; 
    }
    font-size : 14px; 
    font-weight : 400;
}`;
const StyledBError = styled.span`
    @media (width <= 768px) {
        font-size: 10px; 
    }
    font-size : 11px; 
    color : red;
    margin-left : 2px;
}`;

export default function MyUploadInput({ multiple, required = null, name, title, handleChange = null, handleBlur = null, MyErrors = null, startAdornment = null, value = null }) {
    return (
        <div id={name} style={{ width: '100%' }}>
            <StyledB>{title + (required ? ' *' : '')}</StyledB>
            <input
                id={title}
                type="file"
                name={name}
                title={title}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ display: 'none' }}
                multiple={multiple}
                accept="images/*"
            />
            <Tooltip title={title} placement='left'>
                <Button fullWidth variant="outlined" color={MyErrors && MyErrors[title] ? 'error' : 'success'} sx={{ textTransform: 'none', mt: 1, display: 'block' }} onClick={() => document.getElementById(title).click()}>
                    Upload your car images {<UploadIcon sx={{ display: 'inline' }} />}
                </Button>
            </Tooltip>
            <div style={{ height: '20px', display: 'flex', alignItems: 'center' }}>
                {
                    MyErrors && MyErrors[title] && (<StyledBError>Please upload at least one of your car images</StyledBError>)
                }
            </div>
        </div>
    )
}
