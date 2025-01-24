import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Switch,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Mail as MailIcon,
  Logout as LogoutIcon,
  NotificationsNone as NotificationIcon,
  Person as ProfileIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/projexino.png';
import collapsedLogo from '../assets/Navbar_logo.png'
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const drawerWidth = 280;

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleThemeChange = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const getThemeColors = () => ({
    background: isDarkMode ? '#19234d' : 'white',
    text: isDarkMode ? '#f5f5f5' : '#19234d',
    sidebar: isDarkMode ? '#151b3b' : 'white',
    hover: isDarkMode ? 'rgba(217, 118, 74, 0.15)' : 'rgba(43, 90, 158, 0.08)',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    gradientStart: isDarkMode ? 'rgba(217, 118, 74, 0.05)' : 'rgba(43, 90, 158, 0.02)',
    gradientEnd: isDarkMode ? 'rgba(43, 90, 158, 0.05)' : 'rgba(217, 118, 74, 0.02)',
  });

  const colors = getThemeColors();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    // { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/users' },
    { text: 'Blogs', icon: <ArticleIcon />, path: '/dashboard/blogs' },
    { text: 'Newsletter', icon: <MailIcon />, path: '/dashboard/newsletter' },
    { text: 'Subscribers', icon: <PeopleIcon />, path: '/dashboard/subscribers' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // const collapsedLogo = '../assets/collapsed-logo.png';

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <Box sx={{
        display: 'flex',
        bgcolor: isDarkMode ? '#151b3b' : '#f5f5f5',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        background: isDarkMode
          ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
      }}>
        <AppBar
          position="fixed"
          sx={{
            bgcolor: 'transparent',
            backgroundImage: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
            backdropFilter: 'blur(10px)',
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.2)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            borderBottom: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', height: 80, px: 1 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              width: open ? drawerWidth - 25 : '50px',
              borderRight: `1px solid ${colors.border}`,
              height: '100%',
              position: 'relative'
            }}>
              <Box sx={{
                width: open ? '100%' : '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'width 0.3s ease'
              }}>
                <img
                  src={open ? Logo : collapsedLogo}
                  alt="Projexino Logo"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 70,
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Box>

            <IconButton
              onClick={() => setOpen(!open)}
              sx={{
                position: 'fixed',
                left: open ? `${drawerWidth + 10}px` : '90px',
                top: '20px',
                bgcolor: isDarkMode ? '#d9764a' : '#2b5a9e',
                color: 'white',
                '&:hover': {
                  bgcolor: isDarkMode ? '#de7527' : '#19234d',
                },
                width: 40,
                height: 40,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                zIndex: (theme) => theme.zIndex.drawer + 2
              }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleThemeChange}
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.04)',
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)'
                    },
                    width: 40,
                    height: 40,
                    color: isDarkMode ? '#d9764a' : '#2b5a9e'
                  }}
                >
                  {isDarkMode ? <DarkIcon /> : <LightIcon />}
                </IconButton>
              </motion.div>

              {/* <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.04)',
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)'
                    },
                    width: 40,
                    height: 40,
                    color: isDarkMode ? '#d9764a' : '#2b5a9e',
                    position: 'relative'
                  }}
                >
                  <NotificationIcon />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 8,
                      height: 8,
                      bgcolor: '#d9764a',
                      borderRadius: '50%'
                    }}
                  />
                </IconButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.04)',
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)'
                    },
                    width: 40,
                    height: 40,
                    color: isDarkMode ? '#d9764a' : '#2b5a9e'
                  }}
                >
                  <ProfileIcon />
                </IconButton>
              </motion.div> */}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    bgcolor: '#d9764a',
                    '&:hover': {
                      bgcolor: '#de7527',
                    },
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                    ml: 1
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? drawerWidth : '73px',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : '73px',
              boxSizing: 'border-box',
              borderRight: `1px solid ${colors.border}`,
              bgcolor: colors.sidebar,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowX: 'hidden',
              pt: '80px',
              backdropFilter: 'blur(10px)',
              backgroundImage: `linear-gradient(180deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
              boxShadow: isDarkMode
                ? '4px 0 20px rgba(0, 0, 0, 0.2)'
                : '4px 0 20px rgba(0, 0, 0, 0.08)',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
            },
          }}
        >
          <List sx={{
            px: 2,
            '& .MuiListItem-root': {
              transition: 'all 0.2s ease',
              py: 1.5,
              mb: 1.5,
              '&:hover': {
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                }
              },
              '&:active': {
                transform: 'translateX(6px) scale(0.98)',
              }
            }
          }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.text}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ListItem
                    button
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      bgcolor: isActive ? colors.hover : 'transparent',
                      height: '60px',
                      '&:hover': {
                        bgcolor: colors.hover,
                        '&::before': {
                          opacity: 1,
                          transform: 'translateX(0)',
                        }
                      },
                      '&:active': {
                        bgcolor: isDarkMode
                          ? 'rgba(217, 118, 74, 0.25)'
                          : 'rgba(43, 90, 158, 0.15)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: `translateY(-50%) translateX(${isActive ? '0' : '-100%'})`,
                        height: '70%',
                        width: 4,
                        bgcolor: isDarkMode ? '#d9764a' : '#2b5a9e',
                        borderRadius: 1,
                        opacity: isActive ? 1 : 0,
                        transition: 'all 0.3s ease',
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive
                          ? (isDarkMode ? '#d9764a' : '#2b5a9e')
                          : (isDarkMode ? '#d1d5db' : '#374151'),
                        minWidth: 50,
                        transition: 'transform 0.2s ease',
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem',
                        }
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        '& .MuiTypography-root': {
                          fontWeight: isActive ? 600 : 500,
                          color: isActive
                            ? (isDarkMode ? '#d9764a' : '#2b5a9e')
                            : colors.text,
                          fontSize: '1rem',
                          letterSpacing: '0.02em'
                        }
                      }}
                    />
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          right: 16,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: isDarkMode ? '#d9764a' : '#2b5a9e'
                        }}
                      />
                    )}
                  </ListItem>
                </motion.div>
              );
            })}
          </List>
        </Drawer>

        {/* <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
          sx={{
            flexGrow: 1,
            p: 0,
            mt: '80px',
            // ml: open ? `${drawerWidth}px` : '73px',
            transition: 'all 0.3s ease',
            bgcolor: 'transparent',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.gradientStart}, transparent)`,
              opacity: 0.5,
              pointerEvents: 'none',
            }
          }}
        > */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
          sx={{
            flexGrow: 1,
            p: 0,
            mt: '80px',
            ml: open ? '1px' : '0px',
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            bgcolor: 'transparent',
            position: 'relative',
            width: `calc(100% - ${open ? drawerWidth : 73}px)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.gradientStart}, transparent)`,
              opacity: 0.5,
              pointerEvents: 'none',
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              position: 'relative',
              zIndex: 1
            }}
          >
            <Outlet />
          </motion.div>
        </Box>
      </Box>
    </ThemeContext.Provider>
  );
};

export default DashboardLayout;