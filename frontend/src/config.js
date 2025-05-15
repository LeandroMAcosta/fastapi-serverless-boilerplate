const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
      signUpVerificationMethod: 'code',
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_API_ENDPOINT,
      region: process.env.REACT_APP_AWS_REGION,
      authenticationType: 'AMAZON_COGNITO_USER_POOLS'
    }
  }
};

export default config; 