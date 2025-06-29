import { Container, Grid } from '@mui/material';
import styled from 'styled-components';
import {useNavigate, useParams} from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import serverIP from '../../config';

const H1 = styled.h1`
font-family: "General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
font-size : 40px;
font-weight : 700;
text-align : center;

@media screen and (max-width: 768px) {
    font-size: 16px; /* Adjust font size for screens smaller than 768px */
    line-height: 22px; /* Adjust line height accordingly */
}

@media screen and (max-width: 480px) {
    font-size: 15px; /* Adjust font size for screens smaller than 480px */
    line-height: 20px; /* Adjust line height accordingly */
}
`
const H3 = styled.p`
    font: 500 17px "General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    margin-bottom: 0;
    letter-spacing: 0.5px;
    line-height: 25px;

    @media screen and (max-width: 768px) {
        font-size: 16px; /* Adjust font size for screens smaller than 768px */
        line-height: 22px; /* Adjust line height accordingly */
    }

    @media screen and (max-width: 480px) {
        font-size: 15px; /* Adjust font size for screens smaller than 480px */
        line-height: 20px; /* Adjust line height accordingly */
    }

    /* Add more media queries and adjust font sizes as needed */
`;

export default function Verification() {

    const navigate = useNavigate()

    const[loading, setLoading] = React.useState(true)
    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        axios.defaults.withCredentials = true
        const getUserData = async () => {
            try {
                const response = await axios.post(`${serverIP.ip}/user/signin/verify`)
                console.log(response.data)
                setUser(response.data)
                setLoading(false)
            } catch (error) {
                navigate('../user/signin')
                console.log('errr')
                setLoading(false)
            }
        }
        getUserData()
    }, [])

    return (
        <>
            {!loading && <Container maxWidth='lg' disableGutters={true} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Container maxWidth='md'>
                    <H3>
                        <H1>Thank you for signing up!</H1>
                        We've sent a verification link to your email address <b>{user.email}</b>. Please check your inbox (and spam folder, just in case!) and click on the link to verify your account. Once verified, you'll be all set to access all the features of our platform. If you haven't received the email within a few minutes, please click the button below to resend the verification email.

                    </H3>
                </Container>
            </Container>}
        </>
    );
}