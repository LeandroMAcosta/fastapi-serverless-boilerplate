import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { UserData, ErrorWithResponse } from '../../types/auth';
import { fetchUserData } from '../../services/user/userService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

const Home: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const { tokens } = await fetchAuthSession();
        const token = tokens?.idToken?.toString();
        
        if (!token) {
          throw new Error('No authentication token available');
        }

        const userData = await fetchUserData(token);
        setUserData(userData);
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

    loadUserData();
  }, [navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Home Page</h1>
        <p className="text-lg text-gray-600 mb-6">You can only see this if you&apos;re authenticated.</p>
        {userData && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
