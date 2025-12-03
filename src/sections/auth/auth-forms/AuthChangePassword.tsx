'use client';

import { useState, useEffect, SyntheticEvent } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { StringColorProps } from 'types/password';
import CapsLockWarning from 'components/CapsLockWarning';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [level, setLevel] = useState<StringColorProps>();

  const handleMouseDownPassword = (event: SyntheticEvent) => event.preventDefault();
  const changePassword = (value: string) => setLevel(strengthColor(strengthIndicator(value)));

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        currentPassword: Yup.string().required('Current Password is required'),
        newPassword: Yup.string()
          .required('New Password is required')
          .matches(/^[\x21-\x7E]+$/, 'Password contains invalid characters')
          .min(8, 'Password must be at least 8 characters')
          .max(50, 'Password cannot exceed 50 characters'),
        confirmPassword: Yup.string()
          .required('Please confirm your password')
          .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrors({ submit: 'You must be logged in to change your password.' });
          setSubmitting(false);
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_CREDENTIALS_API_URL}/auth/user/password/change`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword
            })
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.details || result.error || 'Password change failed');

          setSuccessMessage('Password changed successfully!');
          setSubmitting(false);
        } catch (err: any) {
          setErrors({ submit: err.message || String(err) });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="currentPassword-change"
                  sx={{ color: '#ffffff !important', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                >
                  Current Password
                </InputLabel>
                <OutlinedInput
                  id="currentPassword-change"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={values.currentPassword}
                  name="currentPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  fullWidth
                  error={Boolean(touched.currentPassword && errors.currentPassword)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle current password visibility"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showCurrentPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
              </Stack>
              <CapsLockWarning />
              {touched.currentPassword && errors.currentPassword && <FormHelperText error>{errors.currentPassword}</FormHelperText>}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="newPassword-change"
                  sx={{ color: '#ffffff !important', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                >
                  New Password
                </InputLabel>
                <OutlinedInput
                  id="newPassword-change"
                  type={showNewPassword ? 'text' : 'password'}
                  value={values.newPassword}
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  placeholder="Enter your new password"
                  fullWidth
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle new password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
              </Stack>
              <CapsLockWarning />
              {touched.newPassword && errors.newPassword && <FormHelperText error>{errors.newPassword}</FormHelperText>}
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
                  htmlFor="confirmPassword-change"
                  sx={{ color: '#ffffff !important', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                >
                  Confirm New Password
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword-change"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
              </Stack>
              <CapsLockWarning />
              {touched.confirmPassword && errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
            </Grid>

            {successMessage && (
              <Grid item xs={12}>
                <FormHelperText sx={{ color: 'success.main' }}>{successMessage}</FormHelperText>
              </Grid>
            )}

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
                  Change Password
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
