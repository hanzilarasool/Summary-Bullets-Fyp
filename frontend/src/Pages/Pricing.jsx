

import React, { useEffect, useState } from 'react';
import '../styles/Pricing.css'; // Import your CSS styles
import { useSelector } from "react-redux";
import axios from 'axios';
import config from "../config";
import { Check, Star, Calendar, FileText, BookOpen, Loader2 } from 'lucide-react';

function Pricing() {
  const { currentUser } = useSelector((state) => state.user);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Loading state for individual plan subscribe buttons
  const [loadingPlan, setLoadingPlan] = useState(null);

  // Plan order for comparison
  const planOrder = ["free", "basic", "standard", "premium"];

  // Fetch up-to-date subscription status on mount
  useEffect(() => {
    const fetchSubscription = async () => {
      if (currentUser?.token) {
        try {
          setLoading(true);
          const res = await axios.get(`${config.API_URL}/api/v1/getsubscriptionstatus`, {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              credentials: "include",
            },
          });
          setSubscriptionInfo(res.data.subscription);
        } catch (err) {
          setSubscriptionInfo(currentUser);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchSubscription();
    // eslint-disable-next-line
  }, [currentUser?.token]);

  const handleSubscribe = async (plan) => {
    setLoadingPlan(plan); // set loading for this plan
    try {
      const res = await axios.post(
        `${config.API_URL}/api/v1/subscribe`,
        { plan },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      window.location.href = res.data.url; // Stripe redirect
    } catch (err) {
      console.error("Subscription error", err);
      alert("Login required. Please try again.");
      setLoadingPlan(null);
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }

  const plans = [
    {
      name: 'Basic',
      price: 5,
      features: [
        '3 book summary requests/month',
        '20 PDF downloads',
        'Unlimited audio listening',
      ],
    },
    {
      name: 'Standard',
      price: 10,
      features: [
        '10 book summary requests/month',
        '50 PDF downloads',
        'Unlimited audio listening',
      ],
    },
    {
      name: 'Premium',
      price: 20,
      features: [
        'Unlimited book summary requests',
        'Unlimited PDF downloads',
        'Unlimited audio listening',
      ],
    },
  ];

  // Show loading state first
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-16">
        <span className="text-lg text-gray-600">Loading subscription info...</span>
      </div>
    );
  }

  const getPlanIndex = planName => planOrder.indexOf(planName?.toLowerCase() || "free");

  const infoBanner = subscriptionInfo?.isPremium ? (
    <div className="subscription-banner subscription-banner--premium">
      <div className="subscription-content-wrapper">
        {/* Premium Plan Button */}
        <div className="premium-button-container">
           <Star className="premium-star-icon" size={22} />
          <button
            className="premium-plan-button"
            style={{ letterSpacing: "0.03em" }}
            disabled
          >
            {subscriptionInfo.plan.charAt(0).toUpperCase() + subscriptionInfo.plan.slice(1)} Plan
          </button>
        </div>

        <div className="subscription-details">
          <div className="subscription-status">
            Your Subscription is Active
          </div>
          <div className="expiry-info">
            <Calendar size={20} className="calendar-icon" />
            <span className="expiry-label">Expires At:</span>
            <span className="expiry-date">{formatDate(subscriptionInfo.expiresAt)}</span>
          </div>
        </div>
        {/* Stats Section */}
        <div className="stats-container">
          <div className="stat-card stat-card--summary">
            <BookOpen size={22} className="book-icon" />
            <div className="stat-details">
              <span className="stat-label">Summary Requests Used</span>
              <span className="stat-value">
                {subscriptionInfo.subscription?.summaryRequestsUsed ?? 0}
              </span>
            </div>
          </div>
          <div className="stat-card stat-card--pdf">
            <FileText size={22} className="file-icon" />
            <div className="stat-details">
              <span className="stat-label">PDF Downloads Used</span>
              <span className="stat-value">
                {subscriptionInfo.subscription?.pdfDownloadsUsed ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="subscription-banner subscription-banner--free">
      <div className="free-plan-info">
        <span className="free-plan-label">
          {subscriptionInfo?.plan || 'free'}
        </span>
      </div>
      <div className="free-plan-status">
        You are on the Free plan.
        <div className="free-plan-cta">
          Subscribe to unlock more features!
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {subscriptionInfo && infoBanner}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row  gap-8 justify-center items-center pricing-cards">
        {plans.map((plan, idx) => {
          const userPlanIdx = getPlanIndex(subscriptionInfo?.plan);
          const planIdx = getPlanIndex(plan.name);

          const isCurrent = userPlanIdx === planIdx;
          const isLower = planIdx < userPlanIdx;
          const disabled = isCurrent || isLower;

          return (
            <div
              key={idx}
              className={`${
                isCurrent
                  ? 'border-2 border-gray-900 shadow-2xl scale-105'
                  : 'shadow-lg'
              } bg-white rounded-2xl p-8 flex flex-col items-center w-full max-w-sm transition hover:shadow-xl min-h-[389px]`}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h2>
              <p className="text-4xl font-extrabold text-gray-800 mb-4">
                ${plan.price}
                <span className="text-base font-medium">/mo</span>
              </p>
              <ul className="text-gray-700 mb-6 space-y-3 w-full">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                    <Check size={18} className="text-black mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !disabled && handleSubscribe(plan.name.toLowerCase())}
                className={`bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition w-full font-semibold
                  ${disabled ? 'opacity-60 cursor-not-allowed' : ''} flex items-center justify-center`}
                disabled={disabled || loadingPlan === plan.name.toLowerCase()}
                title={
                  isLower
                    ? "Cannot downgrade to a lower plan until your current subscription ends."
                    : isCurrent
                      ? "Current Plan"
                      : ""
                }
              >
                {loadingPlan === plan.name.toLowerCase() ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Redirecting...
                  </>
                ) : (
                  isCurrent ? 'Current Plan' : `Choose ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;

