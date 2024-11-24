import React, { useState, useEffect } from "react";
import MyFormInput from "../static components/MyFormInput";
import { useParams, useNavigate } from 'react-router-dom'

import axios from 'axios'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send';
import serverIP from "../config";

export default function Forgot() {
    const [email, setEmail] = React.useState()
    const [userInfo, setUserInfo] = React.useState()
    const [response, setResponse] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setEmail(e.target.value.trim())
    }
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
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        axios.defaults.withCredentials = true
        await axios.post(`${serverIP.ip}/user/signin/forgot_my_password`, { email: email })
            .then(res => { 
                navigate('../user/RecoverPasswordVerification', {state : res.data})
             })
            .catch(e => {
                if (e.response && e.response.status == 401 || e.response.status == 500)
                    setResponse({ error: true, message: e.response.data })
                else
                    setResponse({ error: true, message: 'Error with connection with server' })
            })
        setLoading(false)
    }
    const mainContainerProps = {
        sx: {
            paddingBottom: 2,
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor : 'white',
            boxShadow : '0px 0px 12px 0px rgba(0,0,0,0.1)'
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
        <Container {...mainContainerProps}>
            <h2>Reset your account password</h2>

            <form style={{padding : 30, backgroundColor : 'white'}}>
                Please enter your email
                <MyFormInput  required={true} name='email' type="email" title='Email' handleChange={handleChange} handleBlur={null} />
                {response != null && response.error &&
                    <Alert variant="standard" severity='error' sx={{ marginTop: 1 }}>
                        {`${response.message}`}
                    </Alert>
                }
                <LoadingButton fullWidth type="submit" loadingPosition="end" endIcon={<SendIcon/>}
                disabled={!email || email == ''}
                    loading={loading}
                    variant="contained"
                    {...loadingButtonProps}
                    onClick={handleSubmit}
                >
                    Reset my password
                </LoadingButton>

            </form>

        </Container>
    );
}