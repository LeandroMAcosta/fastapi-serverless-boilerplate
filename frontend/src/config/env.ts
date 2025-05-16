interface EnvConfig {
  cognito: {
    userPoolId: string;
    clientId: string;
  };
  api: {
    endpoint: string;
    region: string;
  };
}

const requiredEnvVars = [
  'REACT_APP_COGNITO_USER_POOL_ID',
  'REACT_APP_COGNITO_CLIENT_ID',
  'REACT_APP_API_ENDPOINT',
  'REACT_APP_AWS_REGION',
] as const;

const validateEnvVars = () => {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export const getEnvConfig = (): EnvConfig => {
  validateEnvVars();

  return {
    cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID!,
      clientId: process.env.REACT_APP_COGNITO_CLIENT_ID!,
    },
    api: {
      endpoint: process.env.REACT_APP_API_ENDPOINT!,
      region: process.env.REACT_APP_AWS_REGION!,
    },
  };
};
