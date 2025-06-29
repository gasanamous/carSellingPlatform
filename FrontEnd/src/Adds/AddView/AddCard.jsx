import { Grid, Slide, Divider, Tooltip, Button, Snackbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useRef, useState } from "react";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import locationIcon from '../../../icons/add-icons/location.png';
import mileageIcon from '../../../icons/add-icons/mileage.png';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import FavLoader from "./FavLoader";
import styled from 'styled-components';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import './CardStyle.css'
import ShareIcon from '@mui/icons-material/Share';
import swal from "sweetalert";
import Gallery from "./Gallery";
import serverIP from "../../config";
const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 13px;
  }
  font-size: 16px;
`;

export default function AddCard(props) {
    const { add, user } = props
    let userId = null;
    if (user) userId = user.user.id

    const [isFavourited, setIsFavourited] = useState(add.favoutires_users.includes(userId))
    const [favLoaded, setFavLoaded] = useState(true)
    const [openGallery, setOpenGalley] = useState(false)

    const open = () => {
        setOpenGalley(true)
    }
    const close = () => {
        setOpenGalley(false)
    }

    const addToFavourite = async () => {
        axios.defaults.withCredentials = true
        setFavLoaded(false)
        await axios.post(`${serverIP.ip}/adds/addToFavourites`, { addId: add._id, isFavourited: isFavourited })
            .then(res => {
                res.data == 'Added' ? setIsFavourited(true) : setIsFavourited(false)
            })
            .catch(e => {
                if (e.code == 'ERR_NETWORK') {
                    swal({
                        text: 'Sorry, failed to save advert',
                        icon: 'error'
                    })
                }
                else if (e.response.status == 500) {
                    console.log(e.response.data)
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

    const handleShare = async (id, add) => {
        try {
            const shareData = {
                title: `${year} ${company} ${model} advertisement`,
                text: "Advert",
                url: `${serverIP.clientIP}/adds/${add.carManufacturer}/${id}`
            }
            await navigator.share(shareData)

        } catch (err) {
            swal(
                {
                    icon: 'error',
                    text: 'Sharing error, try again'
                }
            )
        }
    }

    return (
        <Grid className="card" container colums={12}
            sx={{
                marginBottom: 2,
                padding: 2,
                position: 'relative',
                backgroundColor: 'white'
            }}>

            <Grid id='cardCarImg'
                item
                xs={12}
                md={5}
                lg={5}
                xl={5}
                xxl={5}
                position='relative'>

                <a
                    href={`/adds/${add.carManufacturer}/${add._id}`}
                    target="_parent">
                    <img src={add.carImages[0]} className="card-car-img" alt="" />
                </a>

                <Tooltip
                    placement="bottom"
                    title='View images'>
                    <IconButton
                        sx={{ position: 'absolute', top: 1, left: 1 }}
                        onClick={open}>
                        <PlayCircleIcon />
                    </IconButton>
                </Tooltip>

                <Gallery
                    open={openGallery}
                    images={add.carImages}
                    setClose={close}
                    setOpen={open} />

            </Grid>

            <Grid item id='breif-info-car'
                xs={12}
                md={7}
                lg={7}
                xl={7}
                xxl={7}
                sx={{
                    padding: 3,
                    paddingTop: { sm: 1, xs: 1, md: 1, lg: 0, xl: 0, xxl: 0 },
                    position: 'relative'
                }} >

                <div className="font"
                    style={{
                        padding: '2px',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        textAlign: 'right',
                        color: 'gray',
                        fontWeight: 300,
                        fontSize: '0.9rem'
                    }}>
                    Posted on {add.post_date}
                </div>

                <div className="font info-car">
                    <a href={`/adds/${add.carManufacturer}/${add._id}`}>
                        {`${add.productionYear} ${add.carManufacturer} ${add.carModel}`}
                    </a>
                </div>

                <div className="font info-car">
                    <img className="location-icon" src={locationIcon} alt="Location" />
                    {add.location}
                </div>

                <Divider style={{ backgroundColor: 'gray', margin: '5px 0px' }}></Divider>

                <div className="font info-car ">
                    <img className="mileage-icon" src={mileageIcon} alt="Mileage" />
                    {`${add.mileage.toLocaleString('en-US')} Km`}
                </div>

                <div className="font info-car">
                    ${`${Math.round(add.price).toLocaleString('en-US')}`}
                </div>

                <div className="fav-icon">
                    {favLoaded ?
                        <Tooltip
                            title={isFavourited ? 'Remove from favourites' : 'Add to favourites'} placement="top">
                            <IconButton onClick={addToFavourite}>
                                {isFavourited ? <BookmarkIcon htmlColor="black" /> : <TurnedInNotIcon htmlColor="black" />}
                            </IconButton>
                        </Tooltip>
                        : <FavLoader />
                    }

                    <Tooltip title='share' placement="top" >
                        <IconButton onClick={() => handleShare(add._id, add)}>
                            <ShareIcon htmlColor="black" />
                        </IconButton>
                    </Tooltip>
                </div>
            </Grid>

        </Grid>
    );
}
