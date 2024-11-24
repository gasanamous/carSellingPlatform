import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login'
import Alert from '@mui/material/Alert';
import axios from 'axios';
import MyFormInput from '../../static components/MyFormInput';
import serverIP from '../../config';

import styled from 'styled-components';
const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
  font-size : 14px;
  cursor : pointer;
`;

export default function Form() {
    const navigate = useNavigate()

    const [MyErrors, setMyErrors] = useState({})
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState()
    axios.defaults.withCredentials = true

    useEffect(() => {
        const isLoggedin = async () => {
            try {
                const res = await axios.post(`${serverIP.ip}/user/userData`);
                navigate('../adds/list')
            } catch (error) {

            }
        }
        isLoggedin()
    }, [])
    const handleBlur = (evt, title) => {
        const { name, value, placeholder } = evt.target
        if (value.trim() == '') {
            setMyErrors({ ...MyErrors, [placeholder]: null })
            return
        }
        setMyErrors({ ...MyErrors, [placeholder]: null })
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setFormData({ ...formData, [name]: value })
    }

    const signin = async (evt) => {

        evt.preventDefault()

        const emptyFields = getEmptyFields(formData)

        if (emptyFields.length != 0) {
            setMyErrors(getEmptyError(emptyFields))
            return
        }

        setResponse(null)
        setLoading(true)
        await axios.post(`${serverIP.ip}/user/signin`, formData)
            .then((response) => {
                if (response.data.role == 'customer') {
                    window.location.href = `${serverIP.clientIP}/adds/list`
                }
                else
                    window.location.href = `${serverIP.clientIP}/administration/${response.data.name}`

            })
            .catch(err => {
                if (err.response && err.response.status == 423) {
                    navigate(`/user/signin/verify/${err.response.data}`)
                }
                else if (err.response && err.response.status == 500) {
                    setResponse({ error: true, message: 'Server error, try again' })
                }
                else if (err.response && err.response.status == 401) {
                    setResponse({ error: true, message: 'Incorrect email or password' })
                }
                else {
                    setResponse({ error: true, message: 'Login failed, try again' })
                }
                console.log(err)
            })
        setLoading(false)
    };

    const formProps = {
        style: {
            padding: 30,
            backgroundColor: 'white',
            boxShadow: '0px 10px 50px 0px rgba(0,0,0,0.1)'
        }
    }

    const loadingButtonProps = {
        sx: {
            backgroundColor: 'green',
            textTransform: 'none',
            padding: 1,
            ':hover': { backgroundColor: '#006400' },
            borderRadius: '25px',
            marginTop: 3
        }

    }

    return (
        <form {...formProps} className='signin-form'>
            <h2 style={{ textAlign: 'center' }}>Sign in</h2>
            <StyledB style={{ color: 'gray', textAlign: 'center', display : 'block', cursor:'initial' }}>Please type your email and password in the form to sign in</StyledB>
            <MyFormInput type='email' name='email' title='Email' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} startAdornment={<EmailIcon style={{ marginRight: '10px', color: 'rgba(0, 0, 0, 0.5)' }} />} />
            <MyFormInput type='password' name='password' title='Password' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} startAdornment={<LockIcon style={{ marginRight: '10px', color: 'rgba(0, 0, 0, 0.5)' }} />} />

            {response != null &&
                <Alert variant="standard" severity={response.error ? 'error' : 'success'} sx={{ marginTop: 1 }}>
                    {`${response.message}`}
                </Alert>
            }
            
            <a href="/user/forgot" title='recover your account' style={{textAlign : 'center', display : 'block'}}>
                <StyledB>forgot password?</StyledB>
            </a>
            <LoadingButton fullWidth type="submit" endIcon={<LoginIcon />} loadingPosition="end"
                loading={loading}
                variant="contained"
                {...loadingButtonProps}
                onClick={signin}
            >
                Sign in
            </LoadingButton>
        </form>
    );
}
const getEmptyFields = (formData) => {
    const fields = ['email', 'password'];

    const emptyField = []

    if (!formData['email'] || formData['email'] == '')
        emptyField.push('Email')
    if (!formData['password'] || formData['password'] == '')
        emptyField.push('Password')


    return emptyField
}

const getEmptyError = (emptyFields) => {
    const errors = {}
    emptyFields.map(field => errors[field] = `Please enter your ${field}`)

    return errors
}