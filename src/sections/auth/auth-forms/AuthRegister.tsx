'use client';

import { useEffect, useState, SyntheticEvent } from 'react';

// next
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import CapsLockWarning from 'components/CapsLockWarning';

import { APP_DEFAULT_PATH } from 'config';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// types
import { StringColorProps } from 'types/password';

export default function AuthRegister({ providers, csrfToken }: any) {
  const router = useRouter();
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstname: Yup.string()
          .trim()
          .matches(/^[\p{L} .'-]+$/u, 'First Name contains invalid characters')
          .max(255, 'First Name cannot exceed 255 characters')
          .required('First Name is required'),
        lastname: Yup.string()
          .trim()
          .matches(/^[\p{L} .'-]+$/u, 'Last Name contains invalid characters')
          .max(255, 'Last Name cannot exceed 255 characters')
          .required('Last Name is required'),
        username: Yup.string()
          .required('Username is required')
          .matches(
            /^(?![._-])(?!.*[._-]{2})[A-Za-z0-9._-]+(?<![.-])$/,
            'Username may only contain letters, numbers, periods (.), underscores (_), and hyphens (-), and cannot begin or end with special characters or have consecutive special characters'
          )
          .min(3, 'Username must be at least 3 characters')
          .max(30, 'Username cannot exceed 30 characters'),
        email: Yup.string().email('Must be a valid email').required('Email is required').trim().max(255),
        password: Yup.string()
          .required('Password is required')
          .matches(/^[\x21-\x7E]+$/, 'Password contains invalid characters')
          .min(8, 'Password must be at least 8 characters')
          .max(50, 'Password cannot exceed 50 characters'),
        confirmPassword: Yup.string()
          .required('Please confirm your password')
          .oneOf([Yup.ref('password')], 'Passwords must match')
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        const trimmedFirst = values.firstname.trim();
        const trimmedLast = values.lastname.trim();
        const trimmedUsername = values.username.trim();
        const trimmedEmail = values.email.trim();
        signIn('credentials', {
          redirect: false,
          mode: 'register',
          firstname: trimmedFirst,
          lastname: trimmedLast,
          username: trimmedUsername,
          email: trimmedEmail,
          password: values.password,
          callbackUrl: APP_DEFAULT_PATH
        }).then(async (res: any) => {
          if (res?.error) {
            setErrors({ submit: res.error });
            setSubmitting(false);
          } else if (res?.ok) {
            // Successfully registered and signed in
            // Get session to extract token
            const session = await fetch('/api/auth/session').then(r => r.json());

            // Save token to localStorage
            if (session?.token?.accessToken) {
              localStorage.setItem('token', session.token.accessToken);
              console.log('Token saved to localStorage');
            }

            // Redirect to dashboard
            router.push(APP_DEFAULT_PATH);
          }
        });
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="firstname-signup"
                  sx={{
                    color: '#ffffff !important',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  First Name
                </InputLabel>
                <OutlinedInput
                  id="firstname-signup"
                  type="firstname"
                  name="firstname"
                  value={values.firstname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter your First Name"
                  fullWidth
                  error={Boolean(touched.firstname && errors.firstname)}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #9333ea'
                    },
                    '& input': {
                      color: 'black'
                    }
                  }}
                />
              </Stack>
              {touched.firstname && errors.firstname && (
                <FormHelperText error id="helper-text-firstname-signup">
                  {errors.firstname}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="lastname-signup"
                  sx={{
                    color: '#ffffff !important',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Last Name
                </InputLabel>
                <OutlinedInput
                  id="lastname-signup"
                  type="lastname"
                  name="lastname"
                  value={values.lastname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter your Last Name"
                  fullWidth
                  error={Boolean(touched.lastname && errors.lastname)}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #9333ea'
                    },
                    '& input': {
                      color: 'black'
                    }
                  }}
                />
              </Stack>
              {touched.lastname && errors.lastname && (
                <FormHelperText error id="helper-text-lastname-signup">
                  {errors.lastname}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="username-signup"
                  sx={{
                    color: '#ffffff !important',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Username
                </InputLabel>
                <OutlinedInput
                  id="username-signup"
                  type="text"
                  name="username"
                  value={values.username}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter username"
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #9333ea'
                    },
                    '& input': {
                      color: 'black'
                    }
                  }}
                />
              </Stack>
              {touched.username && errors.username && (
                <FormHelperText error id="helper-text-username-signup">
                  {errors.username}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="email-signup"
                  sx={{
                    color: '#ffffff !important',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Email Address
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
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #9333ea'
                    },
                    '& input': {
                      color: 'black'
                    }
                  }}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error id="helper-text-email-signup">
                  {errors.email}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="password-signup"
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
                  id="password-signup"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  placeholder="Enter password"
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
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
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #9333ea'
                    },
                    '& input': {
                      color: 'black'
                    }
                  }}
                />
              </Stack>
              <CapsLockWarning />
              {touched.password && errors.password && (
                <FormHelperText error id="helper-text-password-signup">
                  {errors.password}
                </FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem" sx={{ color: '#ffffff' }}>
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="confirmPassword-signup"
                  sx={{
                    color: '#ffffff !important',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword-signup"
                  type={showPassword ? 'text' : 'password'} // you can toggle showPassword if you want same visibility toggle
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #9333ea'
                    },
                    '& input': {
                      color: 'black'
                    }
                  }}
                />
              </Stack>
              <CapsLockWarning />
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="helper-text-confirmPassword-signup">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#9333ea',
                    '&:hover': { backgroundColor: '#7e22ce' },
                    textTransform: 'none',
                    fontSize: '1rem',
                    color: 'white',
                    paddingY: '0.75rem',
                    borderRadius: '0.375rem'
                  }}
                >
                  Create Account
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
