import { Tooltip, IconButton, Container, Grid, Breadcrumbs, } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import Loader from './Loader'
import ImagesSlider from './ImagesSlider'
import tick from '../../../icons/add-icons/tick.png'
import notTick from '../../../icons/add-icons/not-tick.png'
import homeIcon from '../../../icons/home.png'
import ContactSellerForm from './ContactSellerForm';
import FavLoader from './FavLoader';
import styled from 'styled-components';
import serverIP from '../../config';
import Gallery from './Gallery';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AddCard from './AddCard';

const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
  font-size : 16px;
`;

export default function FullAddDetails() {

    const { addId } = useParams()
    const [add, setAdd] = useState()
    const [suggestedAdds, setSuggestedAdds] = useState()
    const [isFavourited, setIsFavourited] = useState(false)
    const [favResponse, setFavResponse] = useState([])
    const [favLoaded, setFavLoaded] = useState(true)
    const [Error, setError] = useState()
    const [fetched, setFetched] = useState()

    const [openGallery, setOpenGalley] = useState(false)

    const open = () => {
        setOpenGalley(true)
    }
    const close = () => {
        setOpenGalley(false)
    }

    useEffect(() => {
        const fetchAdd = async () => {
            setFetched(false)
            const DB_add_response = await axios.post(`${serverIP.ip}/adds/getById/${addId}`)
                .then(res => {
                    const data = res.data.data
                    document.title = data.add.carManufacturer + " " + data.add.carModel + " details"
                    setAdd(data.add)
                    setSuggestedAdds(data.suggestedAdds)
                    setIsFavourited(data.isFavourited)
                    setFetched(true)
                })
                .catch(e => {
                    setFetched(true)
                })

        }
        fetchAdd()

    }, [])

    const addToFavourite = async () => {
        axios.defaults.withCredentials = true
        setFavLoaded(false)
        await axios.post(`${serverIP.ip}/adds/addToFavourites`, { addId: addId, isFavourited: isFavourited })
            .then(res => {
                setFavResponse([res.data, 200]);
                res.data == 'Added' ? setIsFavourited(true) : setIsFavourited(false)
            })
            .catch(e => {
                if (e.code == 'ERR_NETWORK') {
                    swal({
                        icon: 'error',
                        text: 'Network error'
                    })
                }
                else if (e.response.status == 500) {
                    swal({
                        icon: 'error',
                        text: 'Network error'
                    })
                }
                else if (e.response.status == 401) {
                    swal({
                        icon: 'error',
                        text: 'You must be logged in'
                    })
                }
            })
        setFavLoaded(true)
    }

    const mainContainerProps = {
        sx: {
            paddingTop: 2,
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
        }
    }
    const contactIconProps = {
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
    return (
        <>
            <IconButton
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth', block: 'start' })}
                {...contactIconProps}>
                <ContactMailIcon />
            </IconButton >

            {
                !fetched && (<Loader />)
            }

            {
                fetched && <Container {...mainContainerProps}>
                    {fetched && add ?
                        (
                            <>
                                <Breadcrumbs separator="/" aria-label="breadcrumb">

                                    <a href={`/adds/list`}>

                                        <img src={homeIcon} height='20' alt="" />
                                        <StyledB style={{ cursor: 'pointer', marginLeft: 15 }} className='font'>
                                            Home
                                        </StyledB>
                                    </a>

                                    <a href={`/adds/list`}>
                                        <StyledB className='font' style={{ cursor: 'pointer' }}>
                                            List
                                        </StyledB>
                                    </a>

                                    <a href={`/adds/${add.carManufacturer}/list`}>
                                        <StyledB className='font' style={{ cursor: 'pointer' }}>
                                            {add.carManufacturer}
                                        </StyledB>
                                    </a>

                                    <StyledB className='font'>{`${add.productionYear} ${add.carManufacturer} ${add.carModel}`}</StyledB>

                                </Breadcrumbs>

                                <Grid container sx={{ backgroundColor: '#f8f9fa', padding: 2, marginTop: 2 }}>

                                    <Grid item xs={12} sm={12} md={12} lg={7} xl={7} sx={{}}>

                                        <div style={{ padding: 10 }}>

                                            <ImagesSlider images={add.carImages} />

                                            <Tooltip
                                                title='View images'
                                                placement="bottom">

                                                <IconButton onClick={open}>
                                                    <PlayCircleIcon fontSize='large' />
                                                </IconButton>

                                            </Tooltip>

                                            <Gallery
                                                open={openGallery}
                                                images={add.carImages}
                                                setClose={close}
                                                setOpen={open} />

                                        </div>

                                        <div style={{ padding: 10, position: 'relative' }}>

                                            <div className="icon-box">
                                                <p className='fav-icon-details' >

                                                    {favLoaded ?

                                                        <Tooltip title={isFavourited ? 'Remove from favourites' : 'Add to favourites'} placement="top">
                                                            <IconButton onClick={addToFavourite}>
                                                                {isFavourited ? <BookmarkIcon htmlColor="black" /> : <TurnedInNotIcon htmlColor="black" />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        :
                                                        <FavLoader />
                                                    }

                                                </p>
                                            </div>

                                            <div className="title">
                                                <h3>
                                                    {`${add.productionYear} ${add.carManufacturer} ${add.carModel} `}
                                                </h3>
                                            </div>

                                            <br></br>

                                            <div className="price">
                                                <h3 className='font'>
                                                    ${add.price.toLocaleString('en-US')}
                                                </h3>
                                            </div>

                                            <br></br>

                                            <div className='box-details'>
                                                <h3 className='font'>Key specs</h3>

                                                <div className='key-specs-details'>

                                                    <div id='fuelType' className='key-specs-child'>
                                                        <StyledB className='font'>{add.fuelType}</StyledB>
                                                        <StyledB className='font key-specs-child-attribute attribute-name'>
                                                            Fuel Type
                                                        </StyledB>
                                                    </div>

                                                    <div id='motorCapacity' className='key-specs-child'>

                                                        <StyledB className='font'>
                                                            {add.engineCapacity.toLocaleString('en-US')}
                                                            <StyledB className='font key-specs-child-attribute attribute-symb'>
                                                                Cc
                                                            </StyledB>
                                                        </StyledB>

                                                        <StyledB className='font key-specs-child-attribute attribute-name'>
                                                            Engine capacity
                                                        </StyledB>

                                                    </div>

                                                    <div id='transmision' className='key-specs-child'>
                                                        <StyledB className='font'>
                                                            {add.transmission}
                                                        </StyledB>
                                                        <StyledB className='font key-specs-child-attribute attribute-name'>
                                                            Transmission
                                                        </StyledB>
                                                    </div>

                                                    <div id='meilage' className='key-specs-child'>
                                                        <StyledB className='font'>

                                                            {add.mileage.toLocaleString('en-US')}
                                                            <StyledB className='font key-specs-child-attribute attribute-symb'>
                                                                Km
                                                            </StyledB>
                                                        </StyledB>

                                                        <StyledB className='font key-specs-child-attribute attribute-name'>
                                                            Mileage
                                                        </StyledB>
                                                    </div>

                                                    <div id='health' className='key-specs-child'>
                                                        {add.carHealth}
                                                        <StyledB className='font key-specs-child-attribute attribute-name'>
                                                            Health
                                                        </StyledB>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className='box-details'>

                                                <h3 className='font header-title'>Basics</h3>
                                                <table className=' font table-spec'>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td key='prevUse'>
                                                                <StyledB>
                                                                    Previous use
                                                                </StyledB>
                                                            </td>
                                                            <td key='prevUseVal'>
                                                                <StyledB className='font'>
                                                                    {add.previousUse}
                                                                </StyledB>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td key='outerColor'>
                                                                <StyledB>
                                                                    Outer color
                                                                </StyledB>
                                                            </td>
                                                            <td key='outerColorVal'>
                                                                <StyledB className='font'>
                                                                    {add.outerColor ? add.outerColor : '-'}
                                                                </StyledB>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td key='uphol'>
                                                                <StyledB>
                                                                    Upholstery
                                                                </StyledB>
                                                            </td>
                                                            <td key='upholVal'>
                                                                <StyledB className='font'>
                                                                    {add.upholstery ? add.upholstery : '-'}
                                                                </StyledB>
                                                            </td>
                                                        </tr>

                                                    </tbody>

                                                </table>
                                            </div>

                                            <div className="box-details">

                                                <h3 className='font header-title'>Engine Specs</h3>
                                                <table className=' font table-spec'>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td key='uphol'>
                                                                <StyledB>
                                                                    Engine cylinders
                                                                </StyledB>
                                                            </td>
                                                            <td key='upholVal'>
                                                                <StyledB>
                                                                    {add.engineCylinders}
                                                                </StyledB>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td key='drivePower'>
                                                                <StyledB>
                                                                    Drivetrain power
                                                                </StyledB>
                                                            </td>
                                                            <td key='drivePowerVal'>
                                                                <StyledB>
                                                                    {add.drivetrainPower}
                                                                </StyledB>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                </table>
                                            </div>

                                            <div className="box-details">

                                                <h3 className='font header-title'>Fuel</h3>
                                                <table className=' font table-spec'>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td key='fuelType'>
                                                                <StyledB>
                                                                    Fuel type
                                                                </StyledB>
                                                            </td>
                                                            <td key='fuelTypeVal'>
                                                                <StyledB >
                                                                    {add.fuelType}
                                                                </StyledB>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td key='fuelTank'>
                                                                <StyledB>
                                                                    Fuel tank capacity
                                                                </StyledB>
                                                            </td>
                                                            <td key='fuelTankVal'>
                                                                <StyledB>
                                                                    {add.fuelTankCapacity}
                                                                    Litre
                                                                </StyledB>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                </table>
                                            </div>

                                            <div className="box-details">

                                                <h3 className='font header-title'>Licence</h3>
                                                <table className=' font table-spec'>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr key='lic'>
                                                            <td key='lic-label'>
                                                                <StyledB>
                                                                    License expiary
                                                                </StyledB>
                                                            </td>
                                                            <td key='licVal'>
                                                                <StyledB>
                                                                    {add.licenseExpiry}
                                                                </StyledB>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="box-details">

                                                <h3 className='font header-title'>Extra notes</h3>
                                                <table className=' font table-spec'>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr key='lic'>
                                                            <td key='licVal'>
                                                                <StyledB>
                                                                    {add.notes}
                                                                </StyledB>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="box-details">

                                                <h3 className='font header-title'>Features</h3>
                                                <table className=' font table-spec'>
                                                    <thead>
                                                    </thead>
                                                    <tbody>
                                                        {GetFeatures(add.addons)}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={5} xl={5} sx={{ padding: 1 }}>

                                        <div className='box-details contact-seller'>
                                            <ContactSellerForm addId={add._id} />
                                        </div>

                                        <div className="box-details">
                                            <h3 className='font'>See also</h3>
                                            <SuggestedAdds suggestedAdds={suggestedAdds} />
                                            <a href={`/adds/${add.carManufacturer}/list`}><StyledB className='font' style={{ cursor: 'pointer' }} >{`See all related advertisements for ${add.carManufacturer}`}</StyledB></a>
                                        </div>

                                    </Grid>

                                </Grid>
                            </>
                        )
                        :
                        (
                            <div style={{ width: '100%' }}>
                                <Breadcrumbs separator="/" aria-label="breadcrumb">

                                    <a href={`/adds/list`}>
                                        <img src={homeIcon} height='20' alt="" />
                                        <StyledB
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Home
                                        </StyledB>
                                    </a>

                                    <a href={`/adds/list`}>
                                        <StyledB
                                            style={{ cursor: 'pointer' }}
                                        >
                                            List
                                        </StyledB>
                                    </a>
                                </Breadcrumbs>

                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <img
                                        src="https://static.thenounproject.com/png/1527904-200.png"
                                        alt="" />
                                </div>
                            </div>
                        )
                    }
                </Container>
            }
        </>
    );
}

const SuggestedAdds = ({ suggestedAdds }) => {
    const limitedAdds = suggestedAdds.slice(0, 10);
    return (
        <>
            {
                limitedAdds.map((add, index) => (
                    <Tooltip
                        key={(index + 1) + add._id}
                        title={`See ${add.carManufacturer} details`}
                        followCursor
                    >
                        <a
                            key={index + add._id}
                            href={`/adds/${add.carManufacturer}/${add._id}`}
                            className='a'
                        >
                            <div
                                key={(index + 1) + add._id}
                                className='box-sgts'
                                style={{ marginTop: index == 0 ? '0px' : '20px' }}
                            >

                                <StyledB
                                    key={(index + 2) + add._id}
                                    className='font'
                                    style={{ float: 'left', padding: '10px', cursor: 'pointer' }}
                                >
                                    {add.productionYear} {add.carManufacturer} {add.carModel}
                                    <br />
                                    <br />
                                    ${add.price}
                                </StyledB>
                                <img
                                    key={(index + 3) + add._id}
                                    src={add.carImages[0]}
                                    width='100' height='100'
                                    style={{ float: 'right', objectFit: 'cover' }}
                                    alt="Car images"
                                />
                            </div>
                        </a>
                    </Tooltip>

                ))
            }
        </>
    )
}

const GetFeatures = (feautures) => {
    const featuresList = [
        'Sensors',
        'Steering Control',
        'Screen',
        'Fuel Saving System',
        'Keyless Entry',
        'Electric Handbrake',
        'Power Folding Mirrors',
        'Seat Heating',
        'Parking Assistance',
        'Lane Departure Warning',
        'Tow Hook',
        'Cruise Control',
        'Sunroof',
        'Electric Seats',
        'Electric Trunk',
        'Steering Heating',
    ].sort();

    return (
        <>
            {
                featuresList.map(feature => (
                    <tr key={feature}>
                        <td key={feature}>
                            <img key={feature} height='25' src={feautures.includes(feature) ? tick : notTick} alt="" />
                            <StyledB className='font' style={{ marginLeft: 5 }}>{feature}</StyledB>
                        </td>
                    </tr>
                ))
            }

        </>

    )
}

