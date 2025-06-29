import styled from "styled-components";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Tooltip } from "@mui/material";
import './../../../react/node_modules/bootstrap/dist/css/bootstrap.min.css'
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

export default function MyTextareaInput({ name, value, requried, MyErrors = null, handleChange, handleBlur = null, title }) {
    return (
        <div id="">
            <StyledB>{title}</StyledB>
                <textarea
                    required={requried}
                    name={name}
                    onChange={handleChange}
                    title={title}
                    onBlur={handleBlur}
                    placeholder={title}
                    style={{ borderRadius: '0px', borderColor: MyErrors && MyErrors[title] ? 'red' : 'lightgray' }}
                    className="form-control"
                    rows={10}

                >
                    {value}
                </textarea>
            <div style={{ height: 'fit-content', alignItems: 'center' }}>
                {
                    MyErrors && MyErrors[title] && (<StyledBError>{MyErrors[title]}</StyledBError>)
                }
            </div>
        </div>
    )

}