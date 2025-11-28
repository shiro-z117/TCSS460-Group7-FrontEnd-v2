'use client';

import React, { useState, FocusEvent, SyntheticEvent } from 'react';

// next
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { preload } from 'swr';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { APP_DEFAULT_PATH } from 'config';
import { fetcher } from 'utils/axios';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin({ providers, csrfToken }: any) {
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent: any) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '', // TODO for dev work, you can hardcode a known user and password here
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .min(6, 'Password must be at least 6 characters')
        })}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          const trimmedEmail = values.email.trim();
          signIn('credentials', {
            redirect: false,
            email: trimmedEmail,
            password: values.password,
            callbackUrl: APP_DEFAULT_PATH
          }).then(
            (res: any) => {
              if (res?.error) {
                setErrors({ submit: res.error });
                setSubmitting(false);
              } else {
                preload('api/menu/dashboard', fetcher);
                setSubmitting(false);
              }
            },
            (res) => {
              setErrors({ submit: res.error });
              setSubmitting(false);
            }
          );
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            {errors.submit && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded" style={{ marginBottom: '1.5rem' }}>
                {errors.submit}
              </div>
            )}
            <div style={{ marginBottom: '1.5rem' }}>
              <InputLabel
                htmlFor="email-login"
                className="block text-white font-medium mb-2"
                sx={{
                  color: '#ffffff !important',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  display: 'block'
                }}
              >
                Email
              </InputLabel>
              <OutlinedInput
                id="email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter email address"
                fullWidth
                error={Boolean(touched.email && errors.email)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '2px solid #9333ea',
                  },
                  '& input': {
                    color: 'black',
                  }
                }}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <InputLabel
                htmlFor="password-login"
                className="block text-white font-medium mb-2"
                sx={{
                  color: '#ffffff !important',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  display: 'block'
                }}
              >
                Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                color={capsWarning ? 'warning' : 'primary'}
                error={Boolean(touched.password && errors.password)}
                id="-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={(event: FocusEvent<any, Element>) => {
                  setCapsWarning(false);
                  handleBlur(event);
                }}
                onKeyDown={onKeyDown}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      color="secondary"
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="Enter password"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '2px solid #9333ea',
                  },
                  '& input': {
                    color: 'black',
                  }
                }}
              />
              {capsWarning && (
                <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                  Caps lock on!
                </Typography>
              )}
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </div>
            <div className="text-right" style={{ textAlign: 'right', marginBottom: '2rem' }}>
              <Link
                component={NextLink}
                href={'/forgot-password'}
                className="text-purple-400 hover:text-purple-300 text-sm no-underline"
                sx={{
                  color: '#c084fc',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#d8b4fe',
                  }
                }}
              >
                Forgot Password?
              </Link>
            </div>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded"
                sx={{
                  backgroundColor: '#9333ea',
                  '&:hover': {
                    backgroundColor: '#7e22ce',
                  },
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </AnimateButton>
          </form>
        )}
      </Formik>
    </>
  );
}
