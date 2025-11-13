import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SubscriptionTier = 'free' | 'pro' | 'lifetime';

export interface SubscriptionStatus {
  isActive: boolean;
  tier: SubscriptionTier;
  expiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  isLoading: boolean;
  lastVerified: number | null;
}

interface SubscriptionContextType {
  subscription: SubscriptionStatus;
  verifySubscription: () => Promise<void>;
  customerId: string | null;
  setCustomerId: (id: string | null) => void;
  openCheckout: (tier?: 'pro' | 'lifetime') => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const VERIFICATION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    tier: 'free',
    expiresAt: null,
    cancelAtPeriodEnd: false,
    isLoading: true,
    lastVerified: null,
  });
  const [customerId, setCustomerIdState] = useState<string | null>(() => {
    return localStorage.getItem('stripe_customer_id');
  });

  const setCustomerId = (id: string | null) => {
    if (id) {
      localStorage.setItem('stripe_customer_id', id);
    } else {
      localStorage.removeItem('stripe_customer_id');
    }
    setCustomerIdState(id);
  };

  const verifySubscription = async () => {
    // Check cache first
    const cached = localStorage.getItem('subscription_status');
    const cachedTime = localStorage.getItem('subscription_status_time');
    
    if (cached && cachedTime) {
      const timeDiff = Date.now() - parseInt(cachedTime, 10);
      if (timeDiff < VERIFICATION_CACHE_DURATION) {
        try {
          const cachedStatus = JSON.parse(cached);
          setSubscription({
            ...cachedStatus,
            isLoading: false,
            lastVerified: parseInt(cachedTime, 10),
          });
          return;
        } catch (e) {
          // Invalid cache, continue to verify
        }
      }
    }

    setSubscription(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify subscription');
      }

      const data = await response.json();
      const now = Date.now();
      
      const status: SubscriptionStatus = {
        isActive: data.isActive,
        tier: data.tier,
        expiresAt: data.expiresAt,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
        isLoading: false,
        lastVerified: now,
      };

      // Cache the result
      localStorage.setItem('subscription_status', JSON.stringify(status));
      localStorage.setItem('subscription_status_time', now.toString());

      setSubscription(status);
    } catch (error) {
      console.error('Error verifying subscription:', error);
      setSubscription(prev => ({
        ...prev,
        isLoading: false,
        tier: 'free',
        isActive: false,
      }));
    }
  };

  const openCheckout = async (tier: 'pro' | 'lifetime' = 'pro') => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error opening checkout:', error);
      alert('Failed to open checkout. Please try again.');
    }
  };

  useEffect(() => {
    verifySubscription();
  }, [customerId]);

  // Check for successful checkout session
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Verify subscription after successful checkout
      setTimeout(() => {
        verifySubscription();
      }, 2000);
    }
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        verifySubscription,
        customerId,
        setCustomerId,
        openCheckout,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

