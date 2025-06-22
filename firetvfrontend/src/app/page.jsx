"use client";
import {auth, provider, signInWithPopup} from "../component/firebase";
import { useState } from "react";
import Image from "next/image";
// Remove axios import since it's not supported in this environment
// In your actual implementation, make sure to import axios

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const chatServerUrl = process.env.NEXT_PUBLIC_CHAT_SERVER;
      if (!chatServerUrl) {
        throw new Error("Chat server URL is not defined");
      }
      const idToken1 = await result.user.getIdToken();
      // Note: In your actual implementation, uncomment the axios import at the top
      // const response = await axios.post(`${chatServerUrl}/user`, 
      const response = await fetch(`${chatServerUrl}/user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken1}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      localStorage.setItem("jwt_token", data.token);
      console.log("User signed in:", data);
      if(data.message === "Not a new user"){
        //
      }
      else{
        // 
      }
    } catch (error) {
      alert("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Flux</h1>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              AI-Powered Adaptive
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                Content Discovery
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
              The world's most human-centric content recommendation system.
              <span className="block mt-2 text-lg text-purple-300 font-medium">
                Content that adapts to who you are, not just what you watch.
              </span>
            </p>
          </div>

          {/* Feature Icons */}
          <div className="hidden lg:flex space-x-8 pt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm border border-slate-700/50">
                <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Character<br/>Psychology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm border border-slate-700/50">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Adaptive<br/>Daylist</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm border border-slate-700/50">
                <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18 11 10.41l4 4 6.3-6.29L24 8l-8-2z"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Watch<br/>Party</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white">Welcome Back</h3>
                  <p className="text-gray-400">Sign in to access your personalized content</p>
                </div>

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-2xl 
                           flex items-center justify-center space-x-3 transition-all duration-200 
                           hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:hover:scale-100 focus:outline-none focus:ring-4 focus:ring-white/20"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Image
                      src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                      alt="Google Icon"
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  )}
                  <span className="text-lg">
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800 text-gray-400">Quick & Secure</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure authentication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Cross-device sync</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <p className="text-center text-gray-500 text-sm mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
    </div>
  );
}