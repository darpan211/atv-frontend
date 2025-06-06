import React, { useState } from 'react';

const EnhancedErrorFallback = ({ error, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isDev = import.meta.env.VITE_SECRET_KEY === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 ease-in-out">
        <div className="relative">
          {/* Top decorative wave pattern */}
          <div className="absolute inset-x-0 top-0">
            <svg
              className="w-full h-12 text-indigo-500/10"
              viewBox="0 0 1440 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="p-8 pt-16">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-red-500/20 animate-pulse"></div>
                <div className="relative rounded-full bg-gradient-to-br from-red-500 to-red-600 p-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800">
              Oops! Something went wrong
            </h2>

            <p className="mt-3 text-center text-gray-600">
              The application encountered an unexpected error.
            </p>

            <div className="mt-6">
              <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error: {error?.name || 'Unknown Error'}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p className="font-medium">
                        {error?.message || 'An unexpected error occurred'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isDev && error?.stack && (
              <div className="mt-4">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center cursor-pointer px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {showDetails ? 'Hide' : 'Show'} Technical Details
                </button>

                {showDetails && (
                  <div className="mt-2 overflow-auto max-h-64 text-xs font-mono bg-gray-800 text-gray-200 rounded-lg p-4">
                    <pre>{error.stack}</pre>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <p className="text-center text-sm text-gray-500">
                Try these actions to resolve the issue:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={resetErrorBoundary}
                  className="w-full cursor-pointer flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full cursor-pointer flex items-center justify-center px-5 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Page
                </button>
              </div>

              <a
                href="/"
                className="block w-full text-center px-5 py-3 bg-transparent text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Return to Home Page
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <button className="text-sm cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Visit Help Center
                </button>

                <button className="text-sm cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Bottom decorative wave pattern */}
          <div className="absolute inset-x-0 bottom-0 transform rotate-180">
            <svg
              className="w-full h-12 text-indigo-500/10"
              viewBox="0 0 1440 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedErrorFallback;
