// Manager/Admin dashboard . . . 
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Container, Button } from '@mui/material';
import axios from "axios";
import Loader from "../../Adds/AddView/Loader";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'
import serverIP from "../../config";
import './AdminDashboardStyle.css';
import AccountsTable from "./AccountsTable";
import AdvertisementsTable from "./AdvertisementsTable";
import ReportsList from './ReportsList'

import styled from 'styled-components';
const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
    font-size: 14px;
    display : block; 
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

export default function AdminDashboard() {
    const [users, setUsers] = useState(null)
    const [adds, setAdds] = useState(null)
    const [reports, setReports] = useState(null)

    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState(0)
    const [thisUser, setThisUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getAllData = async () => {
            axios.defaults.withCredentials = true
            try {
                const response = await axios.post(`${serverIP.ip}/administration/getInfo`);
                setUsers(response.data.users)
                setAdds(response.data.adds)
                setReports(response.data.reports)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                navigate('../../user/signin')
            }
            setLoading(false)
        }
        const fetchUserData = async () => {
            await axios.post(`${serverIP.ip}/user/userData`)
                .then(res => setThisUser(res.data))
                .catch(() => setThisUser(null))
        }
        getAllData()
        fetchUserData()

    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const updateUsers = (updated) => {
        setUsers(updated)
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
    const tabProps = {
        sx: {
            textTransform: 'none',
            color: 'green'
        }
    }
    return (
        <>
            {loading && <Loader />}
            {
                !loading &&
                <Container
                    {...mainContainerProps}
                    maxWidth='lg'>
                    <Container
                        {...innerContainerProps}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} key='tabs'>

                            <Tabs value={value}
                                onChange={handleChange}
                                aria-label="basic tabs example">
                                <Tab key='Accounts'
                                    {...tabProps}
                                    label={`Users`}
                                    {...a11yProps(0)} />

                                <Tab key='Advertisements'
                                    {...tabProps}
                                    label={`Advertisements`}
                                    {...a11yProps(1)} />

                                <Tab key='Reports'
                                    {...tabProps}
                                    label={`Reports`}
                                    {...a11yProps(1)} />

                            </Tabs>
                        </Box>
                        <CustomTabPanel
                            key='manage-users'
                            value={value}
                            index={0}>

                            <div
                                className="brief-info">
                                <div
                                    className="brief-info-card"
                                    onClick={() => document.getElementById('table').scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                                    <h5>Customers accounts</h5>
                                    <h3>{users.length}</h3>
                                </div>


                                <div
                                    className="brief-info-card">
                                    <h5>Active</h5>
                                    <h3>{numOfAciveAccounts(users)}</h3>
                                </div>

                                <div className="brief-info-card">
                                    <h5>Suspended</h5>
                                    <h3>{users.length - numOfAciveAccounts(users)}</h3>
                                </div>
                            </div>
                            
                            <AccountsTable usersProp={users} updateUsers={updateUsers} />

                        </CustomTabPanel>


                        <CustomTabPanel
                            key='manage-ads'
                            value={value}
                            index={1}>
                            <div
                                className="brief-info-card"
                                onClick={() => document.getElementById('table').scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            >
                                <h5>Total Advertisements</h5>
                                <h3>{adds.length}</h3>
                            </div>
                    
                            <AdvertisementsTable advertisements={adds} />
                        </CustomTabPanel>

                        <CustomTabPanel
                            key='reports'
                            value={value}
                            index={2}>
                            <div className="brief-info">
                                <div
                                    className="brief-info-card"
                                >
                                    <h5>Submitted Reports</h5>
                                    <h3>{reports.length}</h3>
                                </div>
                                <div className="brief-info-card"
                                    onClick={() => document.getElementById('table').scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                >
                                    <h5>In proccessing</h5>
                                    <h3>{reports.filter(rep => rep.status == 'in proccess').length}</h3>
                                </div>
                                <div className="brief-info-card">
                                    <h5>Handled</h5>
                                    <h3>{reports.filter(rep => rep.status == 'handled').length}</h3>
                                </div>
                            </div>
                            
                            <ReportsList allReports={reports} />
                        </CustomTabPanel>

                    </Container>
                </Container>
            }
        </>
    )
}

const numOfAciveAccounts = (allUsers) => {
    let active = 0

    allUsers.forEach(el => {
        if (el['status'] == 'active')
            active++
    })
    return active
}