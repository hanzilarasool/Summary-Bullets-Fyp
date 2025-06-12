// import React from 'react';
// import { Check } from 'lucide-react'; // using Lucide icons (install with: npm install lucide-react)
// import { useSelector, useDispatch } from "react-redux";
// import axios from 'axios';
// import config from "../config"
// function Pricing() {


//       const { currentUser } = useSelector((state) => state.user);
//       console.log(currentUser,"is current user in pricing page");


//       const handleSubscribe = async (plan) => {
//   try {
//     const res = await axios.post(
//       `${config.API_URL}/api/v1/subscribe`,
//       { plan },
//       {
//         headers: {
//           Authorization: `Bearer ${currentUser?.token}`,
//         },
//       }
//     );
//     window.location.href = res.data.url; // Stripe redirect
//   } catch (err) {
//     console.error("Subscription error", err);
//   }
// };
//   const plans = [
//     {
//       name: 'Basic',
//       price: 5,
//       features: [
//         '3 book summary requests/month',
//         '20 PDF downloads',
//         'Unlimited audio listening',
//       ],
//     },
//     {
//       name: 'Standard',
//       price: 10,
//       features: [
//         '10 book summary requests/month',
//         '50 PDF downloads',
//         'Unlimited audio listening',
//       ],
//       featured: true,
//     },
//     {
//       name: 'Premium',
//       price: 20,
//       features: [
//         'Unlimited book summary requests',
//         'Unlimited PDF downloads',
//         'Unlimited audio listening',
//       ],
//     },
//   ];

//   return (
//     <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 100px)' }}>
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch">
//         {plans.map((plan, idx) => (
//           <div
//             key={idx}
//             className={`${
//               plan.featured
//                 ? 'border-2 border-gray-900 shadow-2xl scale-105'
//                 : 'shadow-lg'
//             } bg-white rounded-2xl p-8 flex flex-col items-center w-full max-w-sm transition hover:shadow-xl min-h-[480px]`}
//           >
//             <h2 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h2>
//             <p className="text-4xl font-extrabold text-gray-800 mb-4">
//               ${plan.price}
//               <span className="text-base font-medium">/mo</span>
//             </p>
//             <ul className="text-gray-700 mb-6 space-y-3 w-full">
//               {plan.features.map((feature, i) => (
//                 <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
//                   <Check size={18} className="text-black mt-0.5" />
//                   <span>{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           <button
//   onClick={() => handleSubscribe(plan.name.toLowerCase())}
//   className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition w-full font-semibold"
// >
//   Choose {plan.name}
// </button>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Pricing;
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react'; // using Lucide icons (install with: npm install lucide-react)
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import config from "../config";

function Pricing() {
  const { currentUser } = useSelector((state) => state.user);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch up-to-date subscription status on mount
  useEffect(() => {
    const fetchSubscription = async () => {
      if (currentUser?.token) {
        try {
          setLoading(true);
          const res = await axios.get(`${config.API_URL}/api/v1/getSubscriptionStatus`, {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });
          setSubscriptionInfo(res.data);
        } catch (err) {
          // fallback to currentUser from redux if API fails
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
      alert("Error starting subscription. Please try again.");
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
      featured: true,
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

  // Info banner
  const infoBanner = subscriptionInfo?.isPremium ? (
    <div className="mb-6 p-4 rounded-xl border bg-green-50 border-green-300 text-green-900 max-w-xl mx-auto flex flex-col items-start">
      <div className="font-semibold text-lg mb-2">
        Current Plan: <span className="capitalize">{subscriptionInfo.plan}</span>
      </div>
      <div className="mb-1">
        Expires At: <span className="font-mono">{formatDate(subscriptionInfo.expiresAt)}</span>
      </div>
      <div>
        <span className="mr-4">
          Summary Requests Used: {subscriptionInfo.subscription?.summaryRequestsUsed ?? 0}
        </span>
        <span>
          PDF Downloads Used: {subscriptionInfo.subscription?.pdfDownloadsUsed ?? 0}
        </span>
      </div>
    </div>
  ) : (
    <div className="mb-6 p-4 rounded-xl border bg-yellow-50 border-yellow-300 text-yellow-900 max-w-xl mx-auto flex flex-col items-start">
      <div className="font-semibold text-lg mb-2">
        You are on the <span className="capitalize">{subscriptionInfo?.plan || 'free'}</span> plan.
      </div>
      <div>Subscribe to unlock more features!</div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {subscriptionInfo && infoBanner}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {plans.map((plan, idx) => {
          const isCurrent = subscriptionInfo?.plan === plan.name.toLowerCase();
          return (
            <div
              key={idx}
              className={`${
                plan.featured
                  ? 'border-2 border-gray-900 shadow-2xl scale-105'
                  : 'shadow-lg'
              } bg-white rounded-2xl p-8 flex flex-col items-center w-full max-w-sm transition hover:shadow-xl min-h-[480px]`}
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
                onClick={() => handleSubscribe(plan.name.toLowerCase())}
                className={`bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition w-full font-semibold
                  ${isCurrent ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isCurrent}
              >
                {isCurrent ? 'Current Plan' : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;