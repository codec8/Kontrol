import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

export const Pricing = () => {
  const { subscription, openCheckout } = useSubscription();
  const navigate = useNavigate();

  const handleUpgrade = async (tier: 'pro' | 'lifetime') => {
    await openCheckout(tier);
  };

  const features = {
    free: [
      '15 total entries (income + expenses)',
      'Last 30 days visible',
      'Basic calendar view',
      'Balance projections',
      'Smart matching algorithm',
      'Data export/import',
      'Dark mode',
    ],
    pro: [
      'Unlimited entries',
      'Unlimited time range',
      'All free features',
      'Recurring expense automation',
      'CSV/PDF export',
      'Email reminders',
      'Priority support',
    ],
    lifetime: [
      'Everything in Pro',
      'One-time payment',
      'Lifetime access',
      'All future features included',
      'No recurring charges',
      'Best value for long-term users',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Financial Calendar Tool
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
          >
            Back to Calendar
          </button>
        </div>
      </header>
      
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start free and upgrade when you need more. All plans include local data storage and privacy.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/forever</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Perfect for getting started
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {subscription.tier === 'free' ? 'Current Plan' : 'Get Started'}
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-blue-500 dark:border-blue-400 relative">
            {subscription.tier === 'pro' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Current Plan
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">$4.99</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For power users and professionals
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {features.pro.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscription.tier === 'pro' ? undefined : handleUpgrade('pro')}
              disabled={subscription.tier === 'pro'}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                subscription.tier === 'pro'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
              }`}
            >
              {subscription.tier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Lifetime Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-purple-500 dark:border-purple-400 relative">
            <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
              Best Value
            </div>
            {subscription.tier === 'lifetime' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Current Plan
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Lifetime</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">$12.99</span>
                <span className="text-gray-600 dark:text-gray-400">/one-time</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pay once, use forever
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {features.lifetime.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscription.tier === 'lifetime' ? undefined : handleUpgrade('lifetime')}
              disabled={subscription.tier === 'lifetime'}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                subscription.tier === 'lifetime'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
              }`}
            >
              {subscription.tier === 'lifetime' ? 'Current Plan' : 'Get Lifetime Access'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes! You can upgrade from Free to Pro or Lifetime at any time. Pro subscribers can also upgrade to Lifetime.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What happens to my data?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All your data is stored locally in your browser. It never leaves your device, regardless of your plan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I cancel my Pro subscription?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes, you can cancel anytime. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What's included in Lifetime?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lifetime includes everything in Pro, plus all future features, with no recurring charges ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

