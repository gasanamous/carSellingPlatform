import styled from "styled-components";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { TextField, Tooltip, FormControl } from "@mui/material";
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

export default function MyFormInput({ required = null, type = 'text', name, title, handleChange = null, handleBlur = null, MyErrors = null, startAdornment = null, value = null }) {
    return (
        <div id={name} style={{ width: '100%' }}>
            <StyledB>{title + (required? ' *' : '')}</StyledB>
            <FormControl fullWidth>
                <Tooltip title={title} placement='left'>
                    <TextField
                        id={title}
                        value={value}
                        fullWidth
                        required={required}
                        InputLabelProps={{ shrink: true }}
                        type={type} 
                        name={name}
                        onChange={handleChange}
                        onBlur={(evt) => handleBlur && handleBlur(evt, title)}
                        placeholder={title}
                        sx={{ backgroundColor: 'white'}}
                        InputProps={{
                            startAdornment: startAdornment,
                            endAdornment :  MyErrors && MyErrors[title]  && (<ErrorOutlineIcon sx={{ fontSize: 12, color: 'red' }} />)
                        }}
                        className="no-border-radius"
                        error={MyErrors && MyErrors[title] && MyErrors[title] != '' ? true : false}
                    />
                </Tooltip>
            </FormControl>
            <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}> 
                {
                    MyErrors && MyErrors[title] && (<StyledBError>{MyErrors[title]}</StyledBError>)
                }
            </div>
        </div>
    )
}
