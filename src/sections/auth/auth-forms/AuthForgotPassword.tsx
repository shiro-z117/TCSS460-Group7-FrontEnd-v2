'use client';

// next
import { useRouter } from 'next/navigation';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/@extended/AnimateButton';
import { authApi } from '@/services/authApi';
import { openSnackbar } from 'api/snackbar';

// types
import { SnackbarProps } from 'types/snackbar';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

export default function AuthForgotPassword() {
  const scriptedRef = useScriptRef();
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call the actual API
          await authApi.forgotPassword(values.email);

          setStatus({ success: true });
          setSubmitting(false);

          openSnackbar({
            open: true,
            message: 'Password reset email sent! Check your inbox.',
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);

          setTimeout(() => {
            router.push('/check-mail');
          }, 1500);
        } catch (err: any) {
          if (scriptedRef.current) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to send reset email';
            setStatus({ success: false });
            setErrors({ submit: errorMessage });
            setSubmitting(false);

            openSnackbar({
              open: true,
              message: errorMessage,
              variant: 'alert',
              alert: {
                color: 'error'
              }
            } as SnackbarProps);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded" style={{ marginBottom: '1rem' }}>
              {errors.submit}
            </div>
          )}
          <div style={{ marginBottom: '2rem' }}>
            <InputLabel
              htmlFor="email-forgot"
              className="block text-white font-medium mb-2"
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
              fullWidth
              error={Boolean(touched.email && errors.email)}
              id="email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Enter your email"
              inputProps={{}}
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
              <FormHelperText error id="helper-text-email-forgot">
                {errors.email}
              </FormHelperText>
            )}
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
                '&.Mui-disabled': {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                },
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Password Reset Email'}
            </Button>
          </AnimateButton>
        </form>
      )}
    </Formik>
  );
}