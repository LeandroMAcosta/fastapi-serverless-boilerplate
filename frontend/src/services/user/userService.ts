import { UserData } from '../../types/auth';

export const fetchUserData = async (token: string): Promise<UserData> => {
  const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}; 