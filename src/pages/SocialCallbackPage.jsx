import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { handleSocialCallback } from '../features/auth/authSlice';

const SocialCallbackPage = () => {
  const { provider } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    
    const loginUser = async () => {
      const resultAction = await dispatch(handleSocialCallback({ provider, params }));
      
      if (handleSocialCallback.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        const from = user?.role === 'admin' ? '/admin' : '/profile';
        navigate(from, { replace: true });
      } else {
        navigate('/login', { 
          replace: true, 
          state: { error: resultAction.payload || 'Social login failed' } 
        });
      }
    };

    if (provider && location.search) {
      loginUser();
    } else {
      navigate('/login');
    }
  }, [provider, location, dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">Completing social login...</p>
      <p className="text-gray-400 text-sm mt-2">Please wait while we authenticate your account.</p>
    </div>
  );
};

export default SocialCallbackPage;
