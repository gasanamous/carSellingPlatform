import Container from '@mui/material/Container';
import Form from './Form';
import { Fade } from '@mui/material';
import serverIP from '../../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Send from '@mui/icons-material/Send';
export default function Register() {
  document.title = 'Sign up'
  const [pageLoading, setPageLoading] = useState(true)
  useEffect(() => {
    const getUserData = async () => {
      try {
        setPageLoading(true)
        const res = await axios.post(`${serverIP.ip}/user/userData`)
        window.location.href = `${serverIP.clientIP}/adds/list`
        setPageLoading(false)
      } catch (error) {
        setPageLoading(false)
      }
    }
    getUserData()
  }, [])




  const mainContainerProps = {
    disableGutters: false,
    sx: {
      paddingBottom: 2,
      position: 'absolute',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      border: 'solid 1px',
    }
  }
  const url = `${serverIP.ip}/user/signup`
  const nextUrl = `${serverIP.clientIP}/user/signin`

  const initialData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    city: ''
  }

  return (
    <>
      <Fade in={true} timeout={500} direction="down" mountOnEnter unmountOnExit>
        <Container {...mainContainerProps} maxWidth='sm'>
          <Form
            initialData={initialData}
            url={url}
            nextUrl={nextUrl}
            submitButtonLabel='Sign up'
            submitButtonEndIcon={<Send />}
            headerDescription="Please fill out the form with a valid information to create a new account"
          />

        </Container>
      </Fade>
    </>

  );

}
