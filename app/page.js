import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white py-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-blue-500">Excellence CBT</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/student/auth" className="text-gray-600 hover:text-blue-500">
                <button className='bg-blue-500 px-4 py-2 font-semibold text-white rounded-md'> Start CBT Exam</button>
              </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between py-16 md:py-28">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl">
                Prepare for Success with Our JAMB CBT Platform.
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Practice with our comprehensive Computer-Based Test platform designed to help you excel in your JAMB examination.
              </p>
              <Link
                href="/student/auth"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out shadow-md"
              >
                Start CBT Exam
              </Link>
              <Link
                href="#"
                className="ml-4 text-blue-600 hover:text-blue-800 font-medium py-3 px-6 rounded-lg border border-blue-600 transition duration-150 ease-in-out"
              >
                View Demo
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg shadow-xl bg-white p-4">
                <img
                  src="/excellence.jpg"
                  alt="JAMB CBT Platform Preview"
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Realistic Exam Environment</h3>
              <p className="text-gray-600">Experience the same interface and timing conditions as the actual JAMB CBT exam.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Track your progress and identify areas that need improvement.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Question Bank</h3>
              <p className="text-gray-600">Access thousands of previous JAMB questions across all subjects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your JAMB Preparation?</h2>
          <p className="text-indigo-100 mb-8 max-w-3xl mx-auto">Join thousands of students who have improved their JAMB scores with our platform.</p>
          <Link
            href="/student/auth"
            className="bg-white text-blue-600 font-semibold hover:bg-indigo-50 py-3 px-8 rounded-lg transition duration-150 ease-in-out shadow-md"
          >
            Sign In to Start CBT Exam
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} JAMB CBT Platform. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}