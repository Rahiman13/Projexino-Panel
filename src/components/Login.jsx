import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Typography,
    Box,
    InputAdornment,
    IconButton,
    useTheme,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AuthLayout from './AuthLayout';
import baseUrl from '../api';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`${baseUrl}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                toast.success('Login successful');
                navigate('/dashboard');
            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            toast.error('Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout 
            title="Welcome Back"
            subtitle="Enter your credentials to access your account"
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                width: '100%'
            }}>
                {/* <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography 
                        component="h1" 
                        variant="h4" 
                        sx={{ 
                            color: theme.palette.primary.dark,
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your credentials to access your account
                    </Typography>
                </Box> */}

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, isSubmitting }) => (
                        <Form style={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="email"
                                label="Email"
                                value={values.email}
                                onChange={handleChange}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 16px rgba(43, 90, 158, 0.15)',
                                    '&:hover': {
                                        boxShadow: '0 12px 20px rgba(43, 90, 158, 0.20)',
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>

                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 1
                            }}>
                                <Link 
                                    to="/forgot-password"
                                    style={{ 
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                                <Link 
                                    to="/register"
                                    style={{ 
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Create new account
                                </Link>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </AuthLayout>
    );
};

export default Login;