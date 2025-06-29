import Container from '@mui/material/Container';
import Form from './Form';
import { Fade, Icon } from '@mui/material';
import './Signin.css'
import { Alert } from '@mui/material'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
export default function Signin() {
  document.title = 'Sign in'
  const location = useLocation()

  const mainContainerProps = {
    sx: {
      paddingBottom: 2,
      position: 'absolute',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
     
    }
  }

  return (
    <>
      <Fade in={true} timeout={500} direction="down" mountOnEnter unmountOnExit>
        <Container {...mainContainerProps} maxWidth='sm'>

          {location.state &&
            <Alert variant="standard" severity='success' sx={{ margin: 1 }}>
              {`${location.state}`}
            </Alert>
          }
          <Form />
        </Container>
      </Fade>
    </>
  );
}