'use client';

import React, { useState, FocusEvent, SyntheticEvent } from 'react';

// next
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { preload } from 'swr';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import AuthErrorCard from 'components/cards/AuthErrorCard';

import { APP_DEFAULT_PATH } from 'config';
import { fetcher } from 'utils/axios';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin({ providers, csrfToken }: any) {
  const [capsWarning, setCapsWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: SyntheticEvent) => event.preventDefault();
  const onKeyDown = (keyEvent: any) => setCapsWarning(keyEvent.getModifierState('CapsLock'));

  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setApiError(null); // reset API error on submit
        const trimmedEmail = values.email.trim();

        signIn('credentials', {
          redirect: false,
          mode: 'login',
          email: trimmedEmail,
          password: values.password,
          callbackUrl: APP_DEFAULT_PATH
        })
          .then((res: any) => {
            if (res?.error) {
              const errorMessage = decodeURIComponent(res.error);
              setApiError(errorMessage.replace(/^Error:\s*/i, ''));
            } else {
              preload('api/menu/dashboard', fetcher);
            }
            setSubmitting(false);
          })
          .catch((err) => {
            const errorMessage = decodeURIComponent(err?.error || 'An error has occurred');
            setApiError(errorMessage);
            setSubmitting(false);
          });
      }}
    >
      {({ errors, touched, values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          {/* API Error */}
          <AuthErrorCard message={apiError} />

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <InputLabel
              htmlFor="email-login"
              className="block text-white font-medium mb-2"
              sx={{
                color: '#ffffff !important',
                fontWeight: 500,
                marginBottom: '0.5rem'
              }}
            >
              Email
            </InputLabel>

            <OutlinedInput
              id="email-login"
              type="email"
              name="email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Enter email address"
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{
                backgroundColor: 'white',
                borderRadius: '0.375rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '2px solid #9333ea' },
                '& input': { color: 'black' }
              }}
            />
            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1rem' }}>
            <InputLabel
              htmlFor="password-login"
              className="block text-white font-medium mb-2"
              sx={{
                color: '#ffffff !important',
                fontWeight: 500,
                marginBottom: '0.5rem'
              }}
            >
              Password
            </InputLabel>

            <OutlinedInput
              id="password-login"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onBlur={(event: FocusEvent<any, Element>) => {
                setCapsWarning(false);
                handleBlur(event);
              }}
              onKeyDown={onKeyDown}
              onChange={handleChange}
              fullWidth
              error={Boolean(touched.password && errors.password)}
              placeholder="Enter password"
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
              sx={{
                backgroundColor: 'white',
                borderRadius: '0.375rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '2px solid #9333ea' },
                '& input': { color: 'black' }
              }}
            />
            {capsWarning && (
              <Typography variant="caption" sx={{ color: 'warning.main' }}>
                Caps lock on!
              </Typography>
            )}
            {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </div>

          {/* Forgot password */}
          <div className="text-right" style={{ marginBottom: '2rem' }}>
            <Link
              component={NextLink}
              href={'/forgot-password'}
              className="text-purple-400 hover:text-purple-300 text-sm no-underline"
              sx={{ color: '#c084fc', '&:hover': { color: '#d8b4fe' } }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: '#9333ea',
                '&:hover': { backgroundColor: '#7e22ce' },
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </AnimateButton>
        </form>
      )}
    </Formik>
  );
}
