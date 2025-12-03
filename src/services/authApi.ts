import { credentialsService } from 'utils/axios';

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    credentialsService.post('/auth/login', credentials),

  register: (data: { email: string; password: string; firstname: string;
    lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data),

  // TODO: Update endpoint once provide by group
  sendVerificationEmail: () => credentialsService.post('/auth/verify/email/send'),

  // TODO: Update endpoint and data format once provide by group
  changePassword: (data: { currentPassword?: string; newPassword: string;
    token?: string }) =>
    credentialsService.post('/auth/change-password', data),

  // TODO: Update endpoint once provide by group
  deleteAccount: () => credentialsService.delete('/auth/account'),

  // TODO: Update endpoint once provide by group
  resetPassword: (data: { token: string; newPassword: string }) =>
    credentialsService.post('/auth/reset-password', data),

  // TODO: Update endpoint once provides by group
  forgotPassword: (email: string) => credentialsService.post('/auth/forgot-password', { email })
};