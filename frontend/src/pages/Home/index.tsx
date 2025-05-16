import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

interface UserData {
  message: string;
  user: string;
}

interface ErrorWithResponse extends Error {
  response?: {
    status?: number;
  };
}

const Home: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { tokens } = await fetchAuthSession();
        const token = tokens?.idToken?.toString();
        
        if (!token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/dev/protected`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data. Please try again.');
        const errorWithResponse = err as ErrorWithResponse;
        if (errorWithResponse.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
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

  console.log('User data:', userData);
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Home Page</h1>
        <p className="text-lg text-gray-600 mb-6">You can only see this if you&apos;re authenticated.</p>
        {userData && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-600">
              <span className="font-semibold">Message:</span> {userData.message}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {userData.user}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
