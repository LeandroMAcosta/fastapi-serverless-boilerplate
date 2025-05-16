import { ResourcesConfig } from '@aws-amplify/core';
import { getEnvConfig } from './env';

const envConfig = getEnvConfig();

const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: envConfig.cognito.userPoolId,
      userPoolClientId: envConfig.cognito.clientId,
      signUpVerificationMethod: 'code',
    },
  },
  API: {
    GraphQL: {
      endpoint: envConfig.api.endpoint,
      region: envConfig.api.region,
      defaultAuthMode: 'userPool',
    },
  },
};

export default config;
