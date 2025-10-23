import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare ,User, Mail,Lock, EyeOff , Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
//import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import bgs from '../assets/bgs pic.png'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const {signup , isSigningUp} = useAuthStore();

  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
    if(!formData.password.trim()) return toast.error("Password is required");
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters long");

    return true;

  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log('SignUp form submitted', formData);
    const success = validateForm();

    if(success === true) signup(formData);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-300 overfkow-hidden page-viewport">
    
    {/* Left: Signup Form */}
    <div className="flex w-full md:w-1/2 items-center justify-center p-8">
      <div className="w-full max-w-md animated-card md:h-[560px] h-auto overflow-hidden auth-card">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 group mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <MessageSquare className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-extrabold">
            <span className="bg-gradient-to-r from-[#8B0000] via-[#B22222] to-[#FF7F7F] text-transparent bg-clip-text">
              Create Account
            </span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@email.com"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="......."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white font-semibold rounded-lg shadow-md hover:from-[#A52A2A] hover:to-[#DC143C] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:opacity-50"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-blue-900 mt-2">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-red-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* Right: Background Image */}
    <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8">
      <img
        src={bgs}
        alt="Signup Illustration"
        className="w-[80%] md:h-[560px] h-auto object-cover rounded-2xl shadow-2xl transform transition-transform duration-500 hover:scale-105 hover:shadow-red-500/50 hover:shadow-2xl auth-side-img"
      />
    </div>
  </div>
);


}

export default SignUpPage
