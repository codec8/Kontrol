import { useEffect } from 'react';

interface PrivacyProps {
  onBack: () => void;
}

export const Privacy = ({ onBack }: PrivacyProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Privacy Policy
          </h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to App
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This Privacy Policy describes how Financial Calendar Tool ("we," "our," or "us") collects, uses, and protects your information when you use our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
              Personal Financial Data
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>All financial data you enter (income, expenses, starting balances) is stored exclusively in your browser's localStorage</li>
              <li>This data never leaves your device and is not transmitted to any server</li>
              <li>We do not have access to your financial information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
              Analytics Data
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              We use Vercel Analytics to collect anonymous usage statistics, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Page views and navigation patterns</li>
              <li>Device and browser information</li>
              <li>Referral sources</li>
              <li>Basic performance metrics</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This data is aggregated and anonymized. Vercel Analytics is privacy-focused and GDPR-compliant.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
              Advertising Data (if applicable)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              If you have consented to advertising, Google AdSense may collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Cookies and similar tracking technologies</li>
              <li>Browsing behavior and interests</li>
              <li>Device information for ad personalization</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This data is used to show relevant advertisements. You can manage your ad preferences through Google's Ad Settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Financial Data:</strong> Used only locally in your browser to provide the calendar functionality</li>
              <li><strong>Analytics Data:</strong> Used to improve the website's performance and user experience</li>
              <li><strong>Advertising Data:</strong> Used to display relevant advertisements and generate revenue</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Data Storage
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Your financial data is stored in your browser's localStorage</li>
              <li>Clearing your browser data will delete this information</li>
              <li>We recommend regularly exporting your data to prevent loss</li>
              <li>Analytics and advertising data are stored by third-party services (Vercel and Google)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Third-Party Services
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
              Vercel Analytics
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              Privacy Policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Vercel Privacy Policy</a>
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Data is processed in accordance with GDPR.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
              Google AdSense (if applicable)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google Privacy Policy</a>
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You can opt out of personalized ads through <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google Ad Settings</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Rights
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Access:</strong> You can export all your financial data at any time using the Data Management feature</li>
              <li><strong>Deletion:</strong> You can clear all data using the "Clear All Data" button, or clear your browser's localStorage</li>
              <li><strong>Opt-Out:</strong> You can disable cookies or use browser extensions to block tracking</li>
              <li><strong>GDPR Rights:</strong> If you're in the EU, you have the right to access, rectify, or erase your personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cookies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              We use cookies for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Analytics (Vercel Analytics)</li>
              <li>Advertising (Google AdSense, if applicable)</li>
              <li>Storing your dark mode preference</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This website is not intended for children under 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. The "Last Updated" date at the top indicates when changes were made.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us through [your contact method].
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Free Financial Calendar Tool - Plan your finances with ease</p>
        </div>
      </footer>
    </div>
  );
};

