import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => navigate('/'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription Successful!
        </h2>
        <p className="text-lg text-gray-700">
          You’ve subscribed to the {plan.charAt(0).toUpperCase() + plan.slice(1)} plan.
          Redirecting to home...
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;