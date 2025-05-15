import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

interface UserData {
  message: string;
  email: string;
}

const client = generateClient();

const Home: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Making API call to /protected endpoint...');
      
      // Get the current session and token
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/dev/protected`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        status: err instanceof Error && 'response' in err ? (err as any).response?.status : undefined,
        statusText: err instanceof Error && 'response' in err ? (err as any).response?.statusText : undefined,
        data: err instanceof Error && 'response' in err ? (err as any).response?.data : undefined
      });
      setError('Failed to fetch user data. Please try again.');
      if (err instanceof Error && 'response' in err && (err as any).response?.status === 401) {
        console.log('Unauthorized, redirecting to login...');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Simple FastAPI Serverless App</h2>
                {userData && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      <span className="font-semibold">Message:</span> {userData.message}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Email:</span> {userData.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 