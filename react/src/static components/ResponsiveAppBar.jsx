import * as React from 'react';
import { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Menu, Container, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../icon.jpg';
import serverIP from '../config';
function ResponsiveAppBar({ user, loading }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      {
        !loading &&
        <AppBar id='nav-bar' position="fixed" style={{ top: 0, backgroundColor: 'white', boxShadow: 'none', borderBottom: 'solid 1px lightgray' }} >
          <Container maxWidth="lg">

            <Toolbar disableGutters>
              <Box sx={{ color: 'black', display: { xs: 'none', md: 'initial' }}}>
                <a href="/" style={{ color: 'green', fontWeight: 'bold', height: '100%', fontSize : '20px', width : 'fit-content', marginRight : '5px' }}>
                  Drive By Connect
                </a>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="black"
                >
                  <MenuIcon />
                </IconButton>
                <Box sx={{ color: 'black', display: { xs: 'flex', md: 'none' }, justifyContent : 'center',  width : '100%' }}>
                  <a href="/" style={{ color: 'green', fontWeight: 'bold', display : 'flex', alignItems : 'center', verticalAlign : 'middle', fontSize : '25px'}}>
                    Drive By Connect
                  </a>
                </Box>
                <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: 'block', md: 'none' } }}
                >

                  {/** Menu for large screens */}
                  <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                    {getItems(user)}
                  </Box>

                  {/** Menu for small devices */}
                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {getItems(user)}
                  </Box>
                </Menu>
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {getItems()}
              </Box>

              {!user ? <SignUpInItems />
                :
                <Box sx={{ flexGrow: 0, display: 'flex' }}>
                  <>
                    <Tooltip title="Account">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="img" src={user.user.profile_img} />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px', p: 0 }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{ vertical: 'top', horizontal: 'canter' }}
                      keepMounted
                      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      <Box>
                        {
                          user.user.role == 'admin' &&
                          <a href={`${serverIP.clientIP}/administration/${user.user.name}`} className='bar-a font' style={{
                            cursor: 'pointer',
                            color: 'black',
                            display: 'block',
                            margin: '0 auto',
                            textDecoration: 'none',
                            textAlign: 'center',
                          }}>Admin dashboard</a>
                        }

                        <a href={`${serverIP.clientIP}/user/my/adds`} className='bar-a font' style={{
                          cursor: 'pointer',
                          color: 'black',
                          display: 'block',
                          margin: '0 auto',
                          textDecoration: 'none',
                          textAlign: 'center',
                        }}>My advertisements</a>
                        <a href={`${serverIP.clientIP}/user/profile`} className='bar-a font' style={{
                          cursor: 'pointer',
                          color: 'black',
                          display: 'block',
                          margin: '0 auto',
                          textDecoration: 'none',
                          textAlign: 'center',
                        }}>Account</a>
                         <a href={`${serverIP.clientIP}/help`} className='bar-a font' style={{
                          cursor: 'pointer',
                          color: 'black',
                          display: 'block',
                          margin: '0 auto',
                          textDecoration: 'none',
                          textAlign: 'center',
                        }}>Help</a>
                        <a href={`${serverIP.ip}/user/logout`} className='bar-a font' style={{
                          cursor: 'pointer',
                          color: 'black',
                          display: 'block',
                          margin: '0 auto',
                          textDecoration: 'none',
                          textAlign: 'center',
                        }}>Logout</a>
                       
                      </Box>
                    </Menu></>
                </Box>
              }

            </Toolbar>
          </Container>
        </AppBar>
      }

    </>
  );

}

const getItems = () => {
  return (
    <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
      <a href="/" className='bar-a font' style={{
        color: 'black',
        textDecoration: 'none',
        display: 'block',
        height: 'inherit',
      }}>
        Home
      </a>

      <a href={`/adds/new`} className='bar-a font' style={{
        color: 'black',
        display: 'block',
        textDecoration: 'none',
        height: 'inherit',
      }}>
        Sell your car
      </a>
      <a href={`/adds/list`} className='bar-a font' style={{
        color: 'black',
        display: 'block',
        textDecoration: 'none',
        height: 'inherit',
      }}>
        Search for car
      </a>


    </Box>
  );
}

const SignUpInItems = () => {
  const buttonProps = {
    sx: {
      marginTop: '15px',
      backgroundColor: 'green',
      textTransform: 'none',
      padding: 2,
      ':hover': { backgroundColor: '#006400' },
      borderRadius: '25px',
    }
  }
  return (
    <Box sx={{ flexGrow: 0, display: 'flex' }}>
      <a href="/user/signin" className='bar-a font sign-in-up' style={{
        marginTop: '5px',
        marginBottom: '5px',
        color: 'black',
        textDecoration: 'none',
        height: 'inherit',
        display: 'flex',
        alignItems: 'center',
      }}
      >
        Sign in
      </a>


      <a href="/user/signup" className='bar-a font sign-in-up' style={{
        marginTop: '5px',
        marginBottom: '5px',
        color: 'black',
        textDecoration: 'none',
        height: '50%',
        display: 'flex',
        alignItems: 'center'
      }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#006400'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'green'}>
        Sign up
      </a>
    </Box>
  );
}

export default ResponsiveAppBar;



