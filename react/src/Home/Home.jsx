import React from "react";
import { Container, Grid, Button, Box } from '@mui/material';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import './Home.css'
import { Fade, Slide } from "@mui/material";
import Footer from "./Footer";
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
const Image = styled.img`
  width: auto;
  max-width: 100%;
  display: block; 

  @media (max-width: 991px) {
    display: none; 
  }
`;

const paraProps = {
    width: 'fit-content',
    margin: 0,
    fontWeight: 300,
    fontSize: 18
}

const headerProps = {
    width: 'fit-content',
    margin: 0,
    marginBottom: 7,
    fontSize: 28
}

export default function Home() {
    document.title = 'Home'
    const containerRef = React.useRef(null);

    return (
        <>
            <Container maxWidth='xlg' sx={{ marginTop: 7, height: '100vh' }} disableGutters={true}>

                <Container maxWidth='xlg' className="home-bg" disableGutters={true} >

                    <div className="logo-box-parent">
                        <Slide in ref={containerRef} direction="up" timeout={300}>
                            <div className="logo-box-child" ref={containerRef}>
                                <Fade in={true} timeout={1000}>
                                    <div className="logo-box-child">
                                        <h1 className="font logoHeader-h1">
                                            Drive By Connect
                                        </h1>
                                        <h3 className='font logoHeader-h3'>
                                            Your car can be sold fast, easily and in a reliable way
                                        </h3>
                                        <div>
                                        <a href="/adds/new" style={{ textDecoration: 'none', marginRight : '20px'}}>
                                            <Button variant="outlined" size="large" endIcon={<ArrowOutwardIcon />}
                                                sx={{
                                                    marginTop: '20px',
                                                    borderColor: 'white',
                                                    color: 'black',
                                                    backgroundColor : 'white',
                                                    '&:hover': {
                                                        bgcolor: 'white',
                                                        color: 'black',
                                                        borderColor: 'white'
                                                    },
                                                }}
                                            >
                                                Sell your car
                                            </Button>
                                        </a>
                                        <a href="/adds/list" style={{ textDecoration: 'none' }}>
                                            <Button variant="outlined" size="large" endIcon={<SearchIcon />}
                                                sx={{
                                                    marginTop: '20px',
                                                    borderColor: 'white',
                                                    color: 'white',
                                                    
                                                    '&:hover': {
                                                        bgcolor: 'white',
                                                        color: 'black',
                                                        borderColor: 'white'
                                                    },
                                                }}
                                            >
                                                Search for car
                                            </Button>
                                        </a>
                                        </div>
                                     
                                    </div>
                                </Fade>
                            </div>
                        </Slide>
                    </div>
                </Container>

                <Container sx={{ marginTop: 5, padding: 2 }} maxWidth='xlg' >
                    <div id='aboutus'>
                        <h1 className="font h1-home-paragraph" {...headerProps}>
                            About our site
                        </h1>
                        <p className="font home-paragraph" {...paraProps}>
                            We provide an online platform facilitating users to create a free advertisements for
                            selling their vehicles. Posting advertisements necessitates user authentication
                            through a login process. Unregistered visitors can utilize the site for browsing and
                            searching for specific vehicles available for purchase or rental.
                        </p>
                        <p className="font home-paragraph" {...paraProps}>
                            To express interest or make inquiries, users can contact the advertisement owner directly via contacting seller
                        </p>
                    </div>
                    <div id='features'>
                        <h1 className="font h1-home-paragraph" {...headerProps}>
                            Key Features
                        </h1>
                        <p className="font home-paragraph" {...paraProps}>
                            - Start selling your car hassle-free with our platform! Create a <a href="/user/signup">free account</a> to get started. Once registered, easily <a href="/adds/new">post advertisements</a> to showcase your vehicle to potential buyers.
                        </p>
                        <p className="font home-paragraph" {...paraProps}>
                            - Users can utilize our intuitive <a href="/adds/list">search functionality</a> to find their dream car without the need to sign up or log in.
                        </p>
                        <p className="font home-paragraph" {...paraProps}>

                            - Keep track of your favorite listings by adding them to your personal favorites. This feature makes it convenient to revisit listings you're interested in.</p>
                        <p className="font home-paragraph" {...paraProps}>
                            - Interested in a car? Reach out to the seller directly using the contact information provided in the advertisement.
                        </p>
                    </div>
                </Container>

                <Footer />
            </Container>
        </>
    );
}