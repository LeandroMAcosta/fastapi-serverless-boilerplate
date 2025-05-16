export interface User {
  username: string;
  email: string;
  sub: string;
}

export interface AuthError {
  code: string;
  message: string;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  email: string;
}

export interface ConfirmSignupCredentials {
  username: string;
  confirmationCode: string;
}
