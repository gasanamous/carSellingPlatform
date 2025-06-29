import axios from 'axios'
import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import LoadingButton from '@mui/lab/LoadingButton'
import MyFormInput from "../static components/MyFormInput";
import SendIcon from '@mui/icons-material/Send';
import serverIP from '../config'

export default function Recover() {
    const navigate = useNavigate()
    const location = useLocation()
    const [response, setResponse] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [passwords, setPasswords] = React.useState()
    const [MyErrors, setMyErrors] = useState({})
    React.useEffect(() => {
        if (!location.state) navigate('../user/signin')
    }, [])

    const handleChange = (evt) => {
        setPasswords({ ...passwords, [evt.target.name]: evt.target.value })
    }
    const handleBlur = (evt, title) => {
        const { name, value } = evt.target
        if (value.trim() == '') {
            setMyErrors({ ...MyErrors, [title]: `${title} is required` })
            return
        }
        if (name == 'confirmPassword') {
            setMyErrors({ ...MyErrors, [title]: validationInput[name](value, passwords['password'], title) })
            return
        }
        if (name == 'password') {
            setMyErrors({ ...MyErrors, ['confirmPassword']: validationInput['confirmPassword'](passwords['confirmPassword'], passwords['password'], title) })
            return
        }
        setMyErrors({ ...MyErrors, [title]: null })
    }
    const handleSubmit = async (evt) => {
        evt.preventDefault()
        console.log(MyErrors)
        
        if (passwords['password'].length < 8 ) return
        if (passwords['password'] != passwords['confirmPassword']) return
        setLoading(true)

        axios.defaults.withCredentials = true
        await axios.post(`${serverIP.ip}/user/signin/reset`, { newPassword: passwords['password'] })
            .then(res => navigate('/user/signin'))
            .catch(e => {
                if (e.response && e.response.status == 401 || e.response.status == 500) {
                    setResponse({ error: true, message: e.response.data })
                    console.log(e.response)
                }
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
            backgroundColor: 'white',
            boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.1)'
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
        <Container {...mainContainerProps} >

            <form action="">

                <h2 style={{ paddingTop: 30 }}>Welcome back <b>{location.state.userName}</b> , Change your password</h2>
                <MyFormInput handleBlur={handleBlur} MyErrors={MyErrors} name='password' type='password' required={true} title='New Password' handleChange={handleChange} />
                <MyFormInput handleBlur={handleBlur} MyErrors={MyErrors} name='confirmPassword' type='password' required={true} title='Confirm new Password' handleChange={handleChange} />

                {response != null &&
                    <Alert variant="standard" severity={response.error ? 'error' : 'success'} sx={{ marginTop: 1 }}>
                        {`${response.message}`}
                    </Alert>
                }

                <LoadingButton fullWidth type="submit" endIcon={<SendIcon />} loadingPosition="end"
                    disabled={!passwords || passwords.password == '' || passwords.confirmPassword == ''}
                    loading={loading}
                    variant="contained"
                    {...loadingButtonProps}
                    onClick={handleSubmit}
                >
                    Save
                </LoadingButton>

            </form>

        </Container>
    );

}
const validationInput = {
    firstname: (name, placeholder) => /^[a-zA-Z]{3,}$/.test(name) ? null : `${placeholder} must has at least 3 characters. Digits,special characters are not allowed`,
    lastname: (name, placeholder) => /^[a-zA-Z]{3,}$/.test(name) ? null : `${placeholder}Name must has at least 3 characters. Digits,special characters are not allowed`,
    email: (email, placeholder) => /^[a-zA-Z][a-zA-Z0-9._%-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()) ? null : 'Invalid email address',
    phoneNumber: (phone, placeholder) => /^$|^\d+$/.test(phone.trim()) ? null : 'Invalid phone number',
    city: (city, placeholder) => /^([a-zA-Z]+)?$/.test(city.trim()) ? null : 'Invalid city name',
    password: (pass, placeholder) => pass.toLowerCase().replace(/\s/g, '').length > 8 ? null : 'Password length must be more that 8 characters',
    confirmPassword: (confPass, pass, placeholder) => confPass == pass ? null : 'Passwords does not matches',
}