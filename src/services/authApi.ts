import { credentialsService } from 'utils/axios';

export const authApi = {
  login: (credentials: { email: string; password: string }) => 
credentialsService.post('/auth/login', credentials),

  register: (data: { email: string; password: string; firstname: string; 
lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data),

  // TODO: Update endpoint once Bao provides it
sendVerificationEmail: () => credentialsService.post('/auth/verify/email/send'),

  // TODO: Update endpoint and data format once Bao provides it
  changePassword: (data: { currentPassword?: string; newPassword: string; 
token?: string }) =>
    credentialsService.post('/auth/change-password', data),

  // TODO: Update endpoint once Bao provides it
  deleteAccount: () => credentialsService.delete('/auth/account')
};
