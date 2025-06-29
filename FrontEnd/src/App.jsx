
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Signin from './User/Login/Signin.jsx';
import Register from './User/Register/Register.jsx'
import Verification from './User/Register/Verification.jsx';
import Home from './Home/Home.jsx';
import Adds from './Adds/AddView/Adds.jsx';
import ResponsiveAppBar from './static components/ResponsiveAppBar.jsx';
import './Adds/Font.css'
import FullAddDetails from './Adds/AddView/FullAddDetails.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MkAdd from './Adds/Create Advert/MkAdd.jsx';
import Forgot from './User/Forgot.jsx'
import Recover from './User/Recover.jsx'
import RecoverPasswordVerification from './User/Login/RecoverPasswordVerification.jsx';
import MyAdvertisements from './User/Dashboard/MyAdvertisements.jsx';
import UserProile from './User/Dashboard/UserProfile.jsx';
import serverIP from './config.js';
import AdminDashboard from './User/Admin/Dashboard.jsx'
import CreateAdd from './Adds/Create Advert/CreateAdd.jsx';
import Help from './User/Help.jsx';
import Test from './Test.jsx';
export default function App() {

  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchLoggedInUser = async () => {
      axios.defaults.withCredentials = true
      try {
        const response = await axios.post(`${serverIP.ip}/user/userData`);
        setUser(() => response.data)
        setLoading(false)
      } catch (error) {
        setUser(() => null);
        setLoading(false)
      }

    }
    fetchLoggedInUser();

  }, []);


  return (
    <>
      {!loading &&
        <>
          <BrowserRouter>
            <ResponsiveAppBar user={user} loading={loading} />
            <Routes >
              <Route path='/' element={<Home />} />
              <Route path='/test' element={<Test />} />
              <Route path='/help' element={<Help />} />
              <Route path='/adds/new' element={<CreateAdd />} />
              <Route path='/user/signup' element={<Register />} />
              <Route path='/user/signin' element={<Signin />} />
              <Route path='/user/my/adds' element={<MyAdvertisements />} />
              <Route path='/user/profile' element={<UserProile />} />
              <Route path='/administration/:adminId' element={<AdminDashboard />} />
              <Route path='/user/signin/verify/:userId' element={<Verification />} />
              <Route path='/user/forgot' element={<Forgot />} />
              <Route path='/user/recover' element={<Recover />} />
              <Route path='/user/RecoverPasswordVerification' element={<RecoverPasswordVerification />} />
              <Route path='/adds/list' element={<Adds />} />
              <Route path='/adds/:carManufacturer/list' element={<Adds />} />
              <Route path='/adds/:carManufacturer/:addId' element={<FullAddDetails />} />
            </Routes>

          </BrowserRouter>
        </>
      }

    </>
  );
}





/**
 *
 */




//  { <ResponsiveAppBar user={user} loading={loading} /> }

/**
 * const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchLoggedInUser = async () => {
      axios.defaults.withCredentials = true
      try {
        const response = await axios.post(`${serverIP.ip}/user/userData`);
        setUser(() => response.data)
        setLoading(false)
      } catch (error) {
        setUser(() =>null);
        setLoading(false)
      }

    }
    fetchLoggedInUser();
    
  }, []);
 */
/* 
<>
      {!loading &&
        <>
          <BrowserRouter>
           
            <Routes >
              <Route path='/' element={<Home />} />
              <Route path='/test' element={<Test />} />
              <Route path='/help' element={<Help />} />
              <Route path='/adds/new' element={<CreateAdd />} />
              <Route path='/user/signup' element={<Register />} />
              <Route path='/user/signin' element={<Signin />} />
              <Route path='/user/my/adds' element={<MyAdvertisements />} />
              <Route path='/user/profile' element={<UserProile />} />
              <Route path='/administration/:adminId' element={<AdminDashboard />} />
              <Route path='/user/signin/verify/:userId' element={<Verification />} />
              <Route path='/user/forgot' element={<Forgot />} />
              <Route path='/user/recover' element={<Recover />} />
              <Route path='/user/RecoverPasswordVerification' element={<RecoverPasswordVerification />} />
              <Route path='/adds/list' element={<Adds />} />
              <Route path='/adds/:carManufacturer/list' element={<Adds />} />
              <Route path='/adds/:carManufacturer/:addId' element={<FullAddDetails />} />
            </Routes>
                
          </BrowserRouter>
        </>
      }

    </>
*/