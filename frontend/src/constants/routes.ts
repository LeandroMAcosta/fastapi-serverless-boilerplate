export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CONFIRM_SIGNUP: '/confirm-signup',
  ROOT: '/',
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.CONFIRM_SIGNUP];
export const PROTECTED_ROUTES = [ROUTES.HOME];
