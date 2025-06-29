import styled from "styled-components";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Tooltip, Select, FormControl, MenuItem, FormHelperText, InputLabel } from "@mui/material";
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
const menuItemProps = {
    sx: {
        '&:hover': {
            backgroundColor: 'green',
            color: 'white'
        }
    }
}

export default function MyFormSelect({ required = false, name, title, handleChange = null, handleBlur = null, MyErrors = null, list, value = null }) {

    return (
        <div id={name} style={{ width: '100%' }}>
            <FormControl fullWidth className="no-border-radius" >
                <StyledB>{required? (title + ' *') : title}</StyledB>
                <Tooltip title={title} placement='left'>
                    <Select fullWidth
                        id={title}
                        value={value}
                        required={required}
                        displayEmpty
                        name={name}
                        sx={{ backgroundColor: 'white' }}
                        error={required && MyErrors && MyErrors[title] && MyErrors[title] != ''}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur && handleBlur(e, title)}
                        endAdornment={required && MyErrors[title] && (<ErrorOutlineIcon sx={{ fontSize: 12, color: 'red', marginRight : 2 }} />)}

                    >
                        <MenuItem value="" selected >{title}</MenuItem>
                        {list.map((item) => (
                            <MenuItem key={item} value={item}  {...menuItemProps} >
                                {item}
                            </MenuItem>
                        ))}

                    </Select>
                </Tooltip>
            </FormControl>
            <div style={{ height: '20px', display: 'flex', alignItems: 'center' }}>
                {
                    required && MyErrors && MyErrors[title] && (<StyledBError>{MyErrors[title]}</StyledBError>)  
                }
            </div>
        </div >
    )
}
