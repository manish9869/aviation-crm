import { ConfigService } from '@nestjs/config';
require('dotenv').config();

const configService = new ConfigService();

export const ONE_IN = {
  PROFILE_VERIFICATION_API:
    '/persons/api/profile/get-profile-verification-details',
};

export const OG_SUBSCRIPTION = {
  USER_SUBSCRIPTION_LIST: '/subscriptions/user',
};

export const OG_WALLET = {
  WALLET_API: `/api/${configService.get<string>('OG_WALLET_TENANT_ID')}/wallet`,
  WALLET_URL: `${configService.get<string>(
    'OG_WALLET_BASE_URL',
  )}/${configService.get<string>('OG_WALLET_TENANT_ID')}/account`,
};

export const OG_INVOICE = {
  UPDATE_USER_DETAILS: '/subscriptions/businessdetails',
};
