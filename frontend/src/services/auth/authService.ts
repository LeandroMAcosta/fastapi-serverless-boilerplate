import { signOut, getCurrentUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const checkAuthState = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
};

export const handleSignOut = async (): Promise<boolean> => {
  try {
    await signOut();
    return true;
  } catch {
    return false;
  }
};

export const setupAuthListener = (onAuthChange: (isAuthenticated: boolean) => void) => {
  return Hub.listen('auth', ({ payload: { event } }: { payload: { event: string } }) => {
    switch (event) {
      case 'signedIn':
        onAuthChange(true);
        break;
      case 'signedOut':
        onAuthChange(false);
        break;
    }
  });
};
