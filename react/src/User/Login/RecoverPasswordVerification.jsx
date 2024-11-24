import React, { useEffect } from "react";
import MyFormInput from "../../static components/MyFormInput"
import axios from 'axios'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send';

export default function RecoverPasswordVerification() {

    const [code, setCode] = React.useState()
    const [response, setResponse] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
      if (!location.state) navigate('../user/forgot')
      console.log(location.state)
    },[])
    const handleChange = (e) => {
        setCode(e.target.value.trim())
    }

    const handleSubmit = async (e) => {

        e.preventDefault()
        setLoading(true)

        axios.defaults.withCredentials = true
        await axios.post('http://localhost:3000/user/signin/isValidCode', { token: code })
            .then(res => { 
              navigate('../user/recover', {state : res.data}) 
              console.log(res) })
            .catch(e => {
                if (e.response)
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

            <h2 style={{paddingTop : 30}}>{location.state.userName}</h2>

            <form  >
                We have been sent a code to your email <b>{location.state.email}</b>, please type the code below and confirm
                <MyFormInput required={true} name='code' type="text" title='Verification code' handleChange={handleChange} handleBlur={null} />
                {response != null && response.error &&
                    <Alert variant="standard" severity='error' sx={{ marginTop: 1 }}>
                        {`${response.message}`}
                    </Alert>
                }
                <LoadingButton fullWidth type="submit" loadingPosition="end" endIcon={<SendIcon/>}
                disabled={!code || code == ''}
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