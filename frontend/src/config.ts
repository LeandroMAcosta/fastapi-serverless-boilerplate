import { ResourcesConfig } from '@aws-amplify/core';

const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID as string,
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID as string,
      signUpVerificationMethod: 'code'
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_API_ENDPOINT as string,
      region: process.env.REACT_APP_AWS_REGION as string,
      defaultAuthMode: 'userPool'
    }
  }
};
// authenticationType: 'AMAZON_COGNITO_USER_POOLS'

export default config; 