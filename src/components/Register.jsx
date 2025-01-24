import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Box
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import baseUrl from '../api'
import AuthLayout from './AuthLayout';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(/@projexino\.com$/, 'Email must be from @projexino.com domain')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
          const response = await fetch(`${baseUrl}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          
          if (response.ok) {
            toast.success('Registration successful');
            navigate('/login');
          } else {
            const data = await response.json();
            toast.error(data.message || 'Registration failed');
          }
        } catch (error) {
          toast.error('An error occurred during registration');
        } finally {
          setSubmitting(false);
        }
    };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our platform and start your journey"
    >
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Full Name"
              value={values.name}
              onChange={handleChange}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
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
            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              Register
            </Button>
            <Box textAlign="center">
              <Link to="/login">Already have an account? Login</Link>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Register;