import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from './AuthLayout';
import baseUrl from '../api'
import { styled } from '@mui/material/styles';
import LockResetIcon from '@mui/icons-material/LockReset';
import TimerIcon from '@mui/icons-material/Timer';
import CircularProgress from '@mui/material/CircularProgress';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .required('OTP is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    maxWidth: '500px',
    margin: theme.spacing(2),
    position: 'relative',
    overflow: 'visible',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      background: 'linear-gradient(45deg, #2196F3, #21CBF3, #2196F3)',
      borderRadius: 26,
      zIndex: -1,
      opacity: 0.3,
    }
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.primary.main,
  fontSize: '1.75rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  position: 'relative',
  '& svg': {
    fontSize: '2.2rem',
    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
    borderRadius: '50%',
    padding: theme.spacing(1),
    color: '#fff',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
  },
}));

const TimerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  margin: theme.spacing(3, 0),
  padding: theme.spacing(2),
  borderRadius: 16,
  background: 'rgba(33, 150, 243, 0.05)',
  border: '1px solid rgba(33, 150, 243, 0.1)',
  color: theme.palette.primary.main,
  fontSize: '1.2rem',
  fontWeight: 500,
  '& svg': {
    animation: 'pulse 1.5s ease-in-out infinite',
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.2)',
      opacity: 0.7,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
  },
}));

const OtpInputWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& .timer-display': {
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.primary.main,
    fontFamily: 'monospace',
    fontSize: '0.95rem',
    fontWeight: 500,
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    background: 'rgba(33, 150, 243, 0.05)',
    border: '1px solid rgba(33, 150, 243, 0.1)',
  }
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer;
    if (openOtpDialog && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [openOtpDialog, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${baseUrl}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      if (response.ok) {
        setEmail(values.email);
        setOpenOtpDialog(true);
        toast.success('OTP sent to your email');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${baseUrl}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password reset successful');
        navigate('/login');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const response = await fetch(`${baseUrl}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setTimeLeft(300); // Reset to 5 minutes
        setCanResend(false);
        toast.success('New OTP sent to your email');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
    >
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form>
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                borderRadius: '20px',
                position: 'relative',
                minHeight: 48
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px'
                  }}
                />
              ) : (
                'Send Reset Link'
              )}
            </Button>
            <Box textAlign="center">
              <Button onClick={() => navigate('/login')}>
                Back to Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <StyledDialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          <LockResetIcon />
          Reset Password
        </StyledDialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ 
              otp: '',
              newPassword: '',
              confirmPassword: ''
            }}
            validationSchema={otpValidationSchema}
            onSubmit={handleOtpSubmit}
          >
            {({ values, errors, touched, handleChange, isSubmitting }) => (
              <Form>
                <OtpInputWrapper>
                  <StyledTextField
                    sx={{ flex: 1 }}
                    margin="normal"
                    name="otp"
                    label="Enter OTP"
                    value={values.otp}
                    onChange={handleChange}
                    error={touched.otp && Boolean(errors.otp)}
                    helperText={touched.otp && errors.otp}
                    InputProps={{
                      sx: { fontSize: '1.1rem', letterSpacing: '0.2em' }
                    }}
                  />
                  <Box className="timer-display">
                    <TimerIcon sx={{ fontSize: '1.2rem' }} />
                    {timeLeft > 0 ? (
                      formatTime(timeLeft)
                    ) : (
                      <Typography color="error" variant="body2">Expired</Typography>
                    )}
                  </Box>
                </OtpInputWrapper>

                <StyledTextField
                  fullWidth
                  margin="normal"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  error={touched.newPassword && Boolean(errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />
                <StyledTextField
                  fullWidth
                  margin="normal"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting || timeLeft === 0}
                    sx={{ 
                      borderRadius: 3,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                      position: 'relative',
                      minHeight: 56,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(33, 150, 243, 0.35)',
                        background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)',
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress 
                        size={24} 
                        sx={{ 
                          color: 'white',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px'
                        }}
                      />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                  {canResend && (
                    <Button
                      onClick={handleResendOtp}
                      fullWidth
                      variant="outlined"
                      disabled={isResending}
                      sx={{ 
                        borderRadius: 3,
                        py: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderWidth: '2px',
                        position: 'relative',
                        minHeight: 56,
                        '&:hover': {
                          borderWidth: '2px',
                          background: 'rgba(33, 150, 243, 0.05)',
                        }
                      }}
                    >
                      {isResending ? (
                        <CircularProgress 
                          size={24} 
                          sx={{ 
                            color: 'primary.main',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px'
                          }}
                        />
                      ) : (
                        'Resend OTP'
                      )}
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </StyledDialog>
    </AuthLayout>
  );
};

export default ForgotPassword;