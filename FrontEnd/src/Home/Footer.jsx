import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Footer() {
  return (
    <MDBFooter className='text-center' color='white' bgColor='dark'>
      <MDBContainer className='p-4'>
        <section className='mb-4'>
          <h1 className='font'>Drive by connect</h1>
        </section>

        <section className=''>
          <MDBRow>
          
            <MDBCol lg='6' md='6' className='mb-4 mb-md-0'>
              <h5 className='font'>Contact us</h5>

              <ul className='list-unstyled mb-0'>
                <li>
                  <a href='#' className='text-white'>
                    <FacebookIcon fontSize='medium' color='primary'/>
                  </a>
                </li>
                <li>
                  <a href='#' className='text-white'>
                    <PhoneIcon fontSize='medium' color='white'/> +972 592748818
                  </a>
                </li>
              </ul>
            </MDBCol>

            <MDBCol lg='6' md='6' className='mb-4 mb-md-0'>
              <h5 className='font'>Quick links</h5>
              <ul className='list-unstyled mb-0'>
                <li>
                  <a href='/user/signin' className='font footer-a'>
                    Sign in
                  </a>
                </li>
                <li>
                  <a href='/user/signup' className='font footer-a'>
                    Sign up
                  </a>
                </li>
                <li>
                  <a href='/adds/new' className='font footer-a'>
                    Create and post advertisement
                  </a>
                </li>
                <li>
                  <a href='/adds/list' className='font footer-a'>
                    Search for car
                  </a>
                </li>
                <li>
                </li>
              </ul>
            </MDBCol>
          </MDBRow>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 Copyright:
        <a className='text-white' style={{paddingLeft : '10px'}} href='/'>
          DriveByConnect.com
        </a>
        <a style={{paddingLeft : '20px', borderLeft : 'soid white', color : 'green'}} href='/help'>
          Help
        </a>
      </div>
    </MDBFooter>
  );
}