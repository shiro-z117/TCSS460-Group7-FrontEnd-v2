import { credentialsService } from 'utils/axios';

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    credentialsService.post('/auth/login', credentials),

  register: (data: { email: string; password: string; firstname: string;
    lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data),

  // Send password reset email (requires verified email)
  forgotPassword: (email: string) =>
    credentialsService.post('/auth/password/reset-request', { email }),

  // Reset password using token from email
  resetPassword: (data: { token: string; newPassword: string }) =>
    credentialsService.post('/auth/password/reset', data),

  // TODO: Update endpoint once provide by group
  sendVerificationEmail: () => credentialsService.post('/auth/verify/email/send'),

  // TODO: Update endpoint and data format once provide by group
  changePassword: (data: { currentPassword?: string; newPassword: string;
    token?: string }) =>
    credentialsService.post('/auth/user/password/change', data),

  // TODO: Update endpoint once provide by group
  deleteAccount: () => credentialsService.delete('/auth/me')
};