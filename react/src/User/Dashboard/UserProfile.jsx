import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Container, Button } from '@mui/material';
import axios from "axios";
import './UserProfile.css'
import Loader from "../../Adds/AddView/Loader";
import EditProfile from "./EditProfile";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'
import Security from "./Security";
import serverIP from "../../config";


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

export default function UserProile() {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const getAllUserInformation = async () => {
            axios.defaults.withCredentials = true
            try {
                const response = await axios.post(`${serverIP.ip}/user/allUserData`);
                setUserData(response.data)
                setLoading(false)
            } catch (error) {
                setUserData(null)
                setLoading(false)
                navigate('../user/signin')
            }
        }
        getAllUserInformation()

    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const mainContainerProps = {
        sx: {
            paddingBottom: 2,
            paddingTop: 2,
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
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
    return (
        <>
            {loading && <Loader />}
            {
                !loading &&
                <Container {...mainContainerProps} maxWidth='lg'>
                    <Container {...innerContainerProps}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} key='tabs'>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab key='My' sx={{ textTransform: 'none', color: 'green' }} label={`Edit profile`} {...a11yProps(0)} />
                                <Tab key='MyFav' sx={{ textTransform: 'none', color: 'green' }} label={`Security`} {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                       <CustomTabPanel key='edit-profile' value={value} index={0}>

                         <EditProfile user={userData} />
                       
                        </CustomTabPanel>
                         
                        
                        <CustomTabPanel key='edit-security' value={value} index={1}>
                            <div className="details">
                                <Security user={userData} />
                            </div>
                        </CustomTabPanel>
                    </Container>

                </Container>
            }
        </>
    )
}