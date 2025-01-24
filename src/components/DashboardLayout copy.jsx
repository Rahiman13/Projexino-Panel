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
import { Outlet, useNavigate } from 'react-router-dom';
import Logo from '../assets/projexino.png';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getThemeColors = () => ({
    background: isDarkMode ? '#19234d' : 'white',
    text: isDarkMode ? '#f5f5f5' : '#19234d',
    sidebar: isDarkMode ? '#151b3b' : 'white',
    hover: isDarkMode ? 'rgba(217, 118, 74, 0.15)' : 'rgba(43, 90, 158, 0.08)',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
  });

  const colors = getThemeColors();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/users' },
    { text: 'Blogs', icon: <ArticleIcon />, path: '/dashboard/blogs' },
    { text: 'Newsletter', icon: <MailIcon />, path: '/dashboard/newsletter' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: isDarkMode ? '#151b3b' : '#f5f5f5', 
      minHeight: '10vh',
      transition: 'all 0.3s ease'
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: colors.background,
          backgroundImage: isDarkMode 
            ? 'linear-gradient(135deg, rgba(217, 118, 74, 0.05), rgba(43, 90, 158, 0.05))'
            : 'linear-gradient(135deg, rgba(43, 90, 158, 0.02), rgba(217, 118, 74, 0.02))',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: `1px solid ${colors.border}`,
          transition: 'all 0.3s ease'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 80, px: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: drawerWidth - 40,
            borderRight: `1px solid ${colors.border}`,
            height: '100%',
            pr: 2
          }}>
            <Box sx={{ 
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={Logo}
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
            </motion.div>

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

      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          left: open ? drawerWidth - 20 : 20,
          top: '100px',
          zIndex: 1300,
          transition: 'left 0.3s ease'
        }}
      >
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            bgcolor: isDarkMode ? '#d9764a' : '#2b5a9e',
            color: 'white',
            '&:hover': {
              bgcolor: isDarkMode ? '#de7527' : '#19234d',
            },
            width: 40,
            height: 40,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }}
        >
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </motion.div>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${colors.border}`,
            bgcolor: colors.sidebar,
            transition: 'all 0.3s ease',
            overflowX: 'hidden',
            pt: '80px',
            ...(open ? {} : {
              width: theme => theme.spacing(9),
            }),
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },
        }}
      >
        <Box sx={{ 
          p: 3, 
          borderBottom: `1px solid ${colors.border}`,
          mb: 2
        }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: isDarkMode ? '#d1d5db' : '#374151',
              fontWeight: 600,
              letterSpacing: 1.5,
              fontSize: '0.75rem',
              opacity: open ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            MAIN MENU
          </Typography>
        </Box>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
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
                  mb: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: colors.hover,
                    '&::before': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%) translateX(-100%)',
                    height: '60%',
                    width: 4,
                    bgcolor: isDarkMode ? '#d9764a' : '#2b5a9e',
                    borderRadius: 1,
                    opacity: 0,
                    transition: 'all 0.3s ease',
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isDarkMode ? '#d9764a' : '#2b5a9e',
                    minWidth: 45
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
                      fontWeight: 500,
                      color: colors.text,
                      fontSize: '0.95rem'
                    }
                  }} 
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Drawer>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          flexGrow: 1,
          p: 4,
          mt: '80px',
          ml: open ? `${drawerWidth}px` : '73px',
          transition: 'all 0.3s ease',
          bgcolor: isDarkMode ? '#151b3b' : '#f5f5f5'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;