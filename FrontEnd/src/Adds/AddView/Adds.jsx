
import { Container, Grid, IconButton, Breadcrumbs, Button } from '@mui/material';
import axios from "axios";
import React, { useState } from "react";
import styled from 'styled-components';
import AddCard from "./AddCard.jsx";
import SeachBox from './SearchBox.jsx'
import Loader from './Loader.jsx';
import homeIcon from '../../../icons/home.png'
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import serverIP from '../../config.js';
const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px;
  }
  font-size: 16px;
`;

export default function Adds() {
    document.title = 'Search for car'
    const { carManufacturer } = useParams()
    const [allAdds, setAllAdds] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [user, setUser] = React.useState()
    const [currentPage, setCurrentPage] = React.useState(1)
    const [addsPerPage, setAddsPerPage] = React.useState(3)
    const [searchFormData, setSearchFormData] = useState({
        carManufacturer: '',
        fuelType: '',
        transmission: '',
        productionYear: '',
        minPrice: '',
        maxPrice: ''
    })

    React.useEffect(() => {
        const fetchAdvertisements = async (url) => {
            axios.defaults.withCredentials = true
            const response = await axios.post(url)
                .then(res => setAllAdds(res.data))
                .catch(e => setAllAdds([]))
            setLoading(false)
        }

        const fetchUserData = async () => {
            await axios.post(`${serverIP.ip}/user/userData`)
                .then(res => setUser(res.data))
                .catch(() => setUser(null))
        }
        const searchParams = new URLSearchParams(window.location.search);

        searchParams.size != 0 ?
            fetchAdvertisements(`${serverIP.ip}/adds/list${window.location.search}`)
            :
            (
                carManufacturer ? fetchAdvertisements(`${serverIP.ip}/adds/${carManufacturer}/list`) : fetchAdvertisements(`${serverIP.ip}/adds/list`)

            )
        fetchUserData()

    }, [])


    const handleChange = (evt) => {
        const { name, value } = evt.target
        if (evt.target.type == 'number') {
            setSearchFormData({ ...searchFormData, [name]: Number(value) })
            return
        }
        setSearchFormData({ ...searchFormData, [name]: value })
    }

    const handleSearch = async (evt) => {
        evt.preventDefault()
        console.log(searchFormData)

        axios.defaults.withCredentials = true
        setLoading(true)
        try {
            const response = await axios.post(`${serverIP.ip}/adds/search`, { searchFormData: searchFormData })
            setAllAdds(response.data)
            const url = new URL(window.location.href);
            url.search = ''
            Object.entries(searchFormData).map(([key, value]) => {
                if (value) {
                    url.searchParams.set(key, value)
                }
            })

            window.history.pushState(null, '', url.toString());
            setLoading(false)

        } catch (error) {
            setAllAdds([])
            setLoading(false)
            console.log(error.message)
        }
    }


    const handlePageChange = (event, value) => {

        const url = new URL(window.location.href);
        url.searchParams.set('p', value)
        window.history.pushState(null, '', url.toString());
        setCurrentPage(value)
        document.getElementById('top-list').scrollIntoView({ behavior: 'smooth', block: 'center' })

    }

    const mainContainerProps = {
        sx: {
            paddingTop: 2,
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
        },
    }

    const searchIconProps = {
        sx: {
            display: { lg: 'none', xl: 'none' },
            padding: 2,
            top: '70px',
            right: 0,
            borderRadius: 0,
            backgroundColor: 'green',
            position: 'fixed',
            ':hover': { backgroundColor: 'green' },
            height: '50px',
            width: '50px',
            zIndex: 1
        }
    }

    const indexOfLastAd = currentPage * addsPerPage;
    const indexOfFirstAd = indexOfLastAd - addsPerPage;
    const currentAdds = allAdds.slice(indexOfFirstAd, indexOfLastAd)
    return (
        <>
            <IconButton
                {...searchIconProps}
                onClick={() => document.getElementById('search').scrollIntoView({ behavior: 'smooth', block: 'center' })} >
                <SearchIcon />
            </IconButton>

            {loading == true && <Loader />}
            {
                !loading &&
                <Container
                    disableGutters={true}
                    {...mainContainerProps}>
                    <Breadcrumbs separator="/" aria-label="breadcrumb" id='top-list'
                        sx={{ width: '100%', padding: 1 }}>

                        <a href={`/adds/list`}>
                            <img src={homeIcon} height='20' alt="Home" />
                            <StyledB style={{ cursor: 'pointer', marginLeft : 10 }} className='font'>
                                Home
                            </StyledB>
                        </a>

                        <a href={`/adds/list`} >
                            <StyledB style={{ cursor: 'pointer' }} className='font'>
                                List
                            </StyledB>
                        </a>

                        {carManufacturer && <a href={`/adds/${carManufacturer}/list`}>
                            <StyledB style={{ cursor: 'pointer' }} className='font'>
                                {carManufacturer}
                            </StyledB>
                        </a>}

                        <StyledB style={{ cursor: 'initial' }} className='font'>
                            List all ({allAdds.length} founded)
                        </StyledB>

                    </Breadcrumbs>

                    <Grid container
                        colums={12}
                        sx={{ padding: 3, backgroundColor: '#f8f9fa' }}>
                        <Grid id='addsGrid' item
                            xs={12}
                            lg={8}
                            md={12}
                            sm={12}
                            xl={8}
                            sx={{
                                padding: allAdds.length == 0 && 3,
                            }} >
                            {
                                allAdds.length > 0 ? (
                                    currentAdds.map((add, index) => (
                                        <AddCard
                                            add={add}
                                            key={add._id}
                                            index={index}
                                            id={add._id}
                                            user={user} />
                                    ))
                                ) : (
                                    <h2>
                                        <SearchIcon fontSize='large' />No advertisements founded : 0
                                    </h2>
                                )
                            }

                        </Grid>

                        <Grid item id='search' xs={12} md={12} lg={4} xl={4} sm={12}
                            sx={{
                                paddingLeft: { xs: 0, lg: 3, xl: 3, md: 0, sm: 0 },
                                paddingTop: { xs: '20px', sm: '20px', lg: 0, xl: 0 },
                            }}>
                            {!loading &&
                                <SeachBox
                                    handleChange={handleChange}
                                    handleSearch={handleSearch}
                                    searchFormData={searchFormData} />
                            }
                        </Grid>

                    </Grid>
                    <div
                        style={{
                            margin: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: 5
                        }}>

                        <Stack
                            spacing={2}
                            sx={{ width: 'fit-content' }}>
                            <Pagination defaultPage={1}
                                onChange={handlePageChange}
                                count={Math.ceil(allAdds.length / addsPerPage)}
                                color='success'
                                page={currentPage}
                                variant="outlined" shape="rounded" />
                        </Stack>

                    </div>
                </Container>

            }
        </>

    );
}

