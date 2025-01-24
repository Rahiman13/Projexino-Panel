import { Box, Container, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Projexino_Logo from '../assets/projexino.png';
import CompanyIllustration from '../assets/company-illustration.jpg';

const AuthLayout = ({ children, title, subtitle, page = 'login' }) => {
  // Define content based on page type
  const getImageContent = () => {
    switch (page) {
      case 'login':
        return {
          heading: "Welcome Back",
          subtext: "Access your management dashboard to oversee blogs, users, and newsletters. Stay in control of your content and community."
        };
      case 'register':
        return {
          heading: "Join Our Management Team",
          subtext: "Get started with our comprehensive platform to manage blogs, user accounts, and newsletter distributions effectively."
        };
      case 'forgot-password':
        return {
          heading: "Account Recovery",
          subtext: "Securely reset your management account password. We ensure your administrative access is protected while making recovery simple."
        };
      default:
        return {
          heading: "Content Management Hub",
          subtext: "Streamline your workflow with our integrated platform for blog management, user administration, and newsletter campaigns."
        };
    }
  };

  const imageContent = getImageContent();

  // Optional: You might want to add these management-specific features to the background
  // const backgroundFeatures = [
  //   "Blog Management & Analytics",
  //   "User Account Administration",
  //   "Newsletter Campaign Tools",
  //   "Content Moderation",
  //   "Engagement Metrics"
  // ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        background: 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        component={motion.div}
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(43, 90, 158, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(43, 90, 158, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(43, 90, 158, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: 'blur(40px)',
        }}
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          sx={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            left: `${20 + i * 15}%`,
            top: `${10 + i * 15}%`,
          }}
        />
      ))}

      <Container 
        maxWidth={false}
        sx={{ 
          display: 'flex',
          p: { xs: 2, md: 1 },
          height: '100vh'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: { xs: 0, lg: 4 },
            height: '100%',
          }}
        >
          {/* Left Column - Form */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              flex: { xs: '1 1 100%', lg: '0 1 500px' },
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                p: { xs: 3, md: 6 },
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative Elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, #2b5a9e, #d9764a)',
                }}
              />
              
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <motion.img
                  src={Projexino_Logo}
                  alt="Projexino Logo"
                  style={{ height: 70, marginBottom: 32 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #2b5a9e, #19234d)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 2,
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 400,
                      opacity: 0.8,
                      maxWidth: '400px',
                      mx: 'auto'
                    }}
                  >
                    {subtitle}
                  </Typography>
                </motion.div>
              </Box>
              {children}
            </Paper>
          </Box>

          {/* Right Column - Creative Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            sx={{
              flex: '1 1 auto',
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '90%',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
              }}
            >
              <motion.img
                src={CompanyIllustration}
                alt="Management Platform Illustration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(25,35,77,0.2) 0%, rgba(25,35,77,0.95) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 6,
                  width: '100%',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 800,
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      mb: 3,
                      width: '100%',
                    }}
                  >
                    {imageContent.heading}
                  </Typography>
                  <Typography 
                    variant="h5"
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      width: '100%',
                      lineHeight: 1.8,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      mb: 4,
                    }}
                  >
                    {imageContent.subtext}
                  </Typography>
                  
                  {/* Add feature list */}
                  {/* <Box sx={{ mt: 3 }}>
                    {backgroundFeatures.map((feature, index) => (
                      <Box
                        key={feature}
                        component={motion.div}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (index * 0.1) }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                            boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 500,
                            fontSize: '1.1rem',
                          }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box> */}
                </motion.div>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout; 