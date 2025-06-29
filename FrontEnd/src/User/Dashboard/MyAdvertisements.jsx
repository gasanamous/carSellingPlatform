import React, { useState } from 'react'
import { Container, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios'
import AddCard from '../../Adds/AddView/AddCard';
import swal from '@sweetalert/with-react';
import Loader from '../../Adds/AddView/Loader';
import EditAdvertForm from './EditAdvert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import serverIP from '../../config';
import CreateAddForm from '../../Adds/Create Advert/CreateAddForm';

const StyledB = styled.label`

  @media (width <= 768px) {
    font-size: 12px; 
  }
  font-size : 16px;
`;
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function MyAdvertisements() {

    const [myAdds, setMyAdds] = React.useState([])
    const [favs, setMyFavs] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [user, setUser] = React.useState()
    const [value, setValue] = React.useState(0)

    const [openDialogId, setOpenDialogId] = useState(null);

    const handleClickOpen = (addId) => {
        setOpenDialogId(addId);
    };

    const handleClose = () => {
        setOpenDialogId(null);
    };


    const navigate = useNavigate()

    React.useEffect(() => {
        const fetchMyAdverts = async () => {
            axios.defaults.withCredentials = true

            try {
                const response = await axios.post(`${serverIP.ip}/adds/user/my`)
                setMyAdds(prev => (response.data[0]))
                setMyFavs(prev => (response.data[1]))
                setLoading(false)
            } catch (error) {
                if (error.response && error.response.status == 401) {
                    window.location.href = `${serverIP.clientIP}/user/signin`
                }
                setUser(null)
                setLoading(false)
            }
        }
        const fetchUserData = async () => {
            await axios.post(`${serverIP.ip}/user/userData`)
                .then(res => setUser(prev => (res.data)))
                .catch(() => setUser(null))
        }
        fetchMyAdverts()
        fetchUserData()

    }, [])

    const deleteAdd = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete this advert?',
            icon: 'warning',
            dangerMode: true,
            buttons: {
                cancel: true,
                confirm: {
                    text: 'Delete',
                    value: 'delete',
                    className: 'error-button',
                },
            },
        })
            .then(async (value) => {
                axios.defaults.withCredentials = true
                if (value != 'delete') return
                try {
                    const response = await axios.post(`${serverIP.ip}/adds/user/delete/${id}`)
                    swal({
                        icon: 'success',
                        text: 'Advertisement has been deleted successfully',
                    }).then(() => window.location.reload())
                } catch (error) {
                    swal({
                        icon: 'error',
                        text: 'Sorry, error while delete advert, try again',
                    })
                }
            })

    }

    const mainContainerProps = {
        sx: {
            paddingBottom: 2,
            paddingTop: 2,
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            //backgroundColor: 'white',

        }
    }

    const innerContainerProps = {
        style: {
            backgroundColor: 'white',
            marginBottom: '20px',
            padding: 20,
            boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.1)'
        }

    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleShare = async (id, general) => {
        handleCloseSetting();
        const { year, company, model } = general;
        try {
            if (navigator.share) {
                const shareData = {
                    title: `${year} ${company} ${model} advertisement`,
                    text: "Advert",
                    url: `${serverIP.clientIP}/adds/${company}/${id}`
                };
                await navigator.share(shareData);
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (err) {
            console.log(err);
            swal({
                icon: 'error',
                text: 'Share error'
            });
        }
    };


    const [anchorElList, setAnchorElList] = useState(new Array(myAdds.length).fill(null));

    const handleClick = (event, index) => {
        const newAnchorElList = [...anchorElList];
        newAnchorElList[index] = event.currentTarget;
        setAnchorElList(newAnchorElList);
    };

    const handleCloseSetting = (index) => {
        const newAnchorElList = [...anchorElList];
        newAnchorElList[index] = null;
        setAnchorElList(newAnchorElList);
    };

    const url = `${serverIP.ip}/adds/user/my/adds/edit`
    return (
        <>
            {loading && <Loader />}
            {!loading && user &&
                <Container {...mainContainerProps} >
                    <Container {...innerContainerProps}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} key='tabs'>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab key='My' sx={{ textTransform: 'none', color: 'green' }} label={`Advertisements (${myAdds.length})`} {...a11yProps(0)} />
                                <Tab key='MyFav' sx={{ textTransform: 'none', color: 'green' }} label={`Favourites (${favs.length})`} {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel key='My-panel' value={value} index={0}>
                            {!loading && myAdds.length == 0 && <h5> You have been not posted any adverts yet</h5>}
                            {
                                myAdds.length > 0 &&
                                myAdds.map((add, index) => (
                                    <>
                                        <div id={`box ${index}`} style={{ backgroundColor: 'white' }} className='myAdvert-single-box' key={index + 'box'}>
                                            <div className='tools'>
                                                <IconButton
                                                    aria-controls="ellipsis-menu"
                                                    aria-haspopup="true"
                                                    onClick={(event) => handleClick(event, index)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    id="ellipsis-menu"
                                                    anchorEl={anchorElList[index]}
                                                    open={Boolean(anchorElList[index])}
                                                    onClose={() => handleCloseSetting(index)}
                                                >
                                                    <MenuItem onClick={() => handleShare(add._id, add.general)}>Share</MenuItem>
                                                    <MenuItem onClick={(e) => handleClickOpen(add._id)}>Edit </MenuItem>
                                                    <MenuItem onClick={() => deleteAdd(add._id)}>Delete </MenuItem>

                                                </Menu>
                                            </div>

                                            <AddCard add={add} key={add._id} index={index} id={add._id} />

                                            <Accordion key={index + 20} >
                                                <AccordionSummary
                                                    key={index + 30}
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1-content"
                                                    id="panel1-header"
                                                >
                                                    <Badge key={index + 100} badgeContent={myAdds[index].inquiries.length} showZero={myAdds[index].inquiries.length == 0} color="primary">
                                                        <MailIcon key={index + 5000} color="action" />
                                                    </Badge>
                                                </AccordionSummary>
                                                <AccordionDetails key={index + 0}>
                                                    {myAdds[index].inquiries.length == 0 && <StyledB>There are no inquiries</StyledB>}
                                                    {
                                                        myAdds[index].inquiries.map((inq, inquiryIndex) => (
                                                            <div className="inquiries" key={inquiryIndex}>
                                                                <div id='header' className="sentData">
                                                                    <StyledB>{inq.sent_date}</StyledB>
                                                                </div>
                                                                <div id='header'>
                                                                    <PersonIcon color='success' />
                                                                    <StyledB>{inq.firstname + ' ' + inq.lastname}</StyledB>

                                                                </div>
                                                                <div id='message' style={{ padding: 10 }}>

                                                                    <StyledB>"{inq.message}"</StyledB>
                                                                </div>
                                                                <div id='contact'>
                                                                    <StyledB>
                                                                        <a href={`mailto:${inq.email}`}> <EmailIcon color='info' sx={{ mr: 1 }} /> {`${inq.email}`}</a>
                                                                    </StyledB>
                                                                </div>
                                                                <div>
                                                                    <StyledB>
                                                                        <a href={`tel:${inq.phoneNumber}`}> <CallIcon color='info' sx={{ mr: 1 }} /> {`${inq.phoneNumber}`}</a>

                                                                    </StyledB>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </AccordionDetails>

                                            </Accordion>

                                            <Dialog
                                                open={openDialogId === add._id}
                                                fullWidth
                                                className='dialog'
                                                onClose={handleClose}>
                                                <DialogTitle>{`${add.productionYear} ${add.carManufacturer} ${add.carModel}`}</DialogTitle>
                                                <DialogContent>
                                                    <CreateAddForm initialData={getAddFormData(add)} url={`${url}/${add._id}`} />
                                                </DialogContent>
                                            </Dialog>


                                        </div>
                                    </>

                                ))
                            }
                        </CustomTabPanel>

                        <CustomTabPanel key='My-FAV-PANEL' value={value} index={1}>
                            <div className='my-favs' key='fav-panel-content'>
                                {
                                    favs.length > 0 ? (favs.map((add, index) => (
                                        <AddCard add={add} key={add._id} index={index} user={user} id={add._id} />
                                    )))
                                        :
                                        (
                                            <h5>No favourites advertisements exsists</h5>
                                        )
                                }
                            </div>
                        </CustomTabPanel>
                    </Container>

                </Container >
            }
        </>

    );
}
const getAddFormData = (add) => {
    return {
        carManufacturer: add.carManufacturer,
        carModel: add.carModel,
        productionYear: add.productionYear,
        transmission: add.transmission,
        mileage: add.mileage,
        previousUse: add.previousUse,
        carHealth: add.carHealth,
        outerColor: add.outerColor,
        upholstery: add.upholstery,
        engineCapacity: add.engineCapacity,
        engineCylinders: add.engineCylinders,
        drivetrainPower: add.drivetrainPower,
        fuelType: add.fuelType,
        fuelTankCapacity: add.fuelTankCapacity,
        price: add.price,
        licenseExpiry: add.licenseExpiry,
        addons: add.addons,
        notes: add.notes,
        carImages: add.carImages
    }
}