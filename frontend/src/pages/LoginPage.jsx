import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare ,User, Mail,Lock, EyeOff , Eye, Loader2} from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import bg from '../assets/bg image.jpg'


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({email: "", password: ""});

  const {login , isLoggingIn}=useAuthStore();

  const handleSubmit = async (e) =>{
    e.preventDefault();
  console.log("Login form submitted", formData);
  login(formData);

  }
 return (
  <div className="min-h-screen flex flex-col md:flex-row bg-gray-300">
    {/* LEFT: Login */}
    <div className="flex w-full md:w-1/2 mt-20 items-center justify-center p-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl  transform transition-transform duration-500 hover:scale-105 hover:shadow--500/50 hover:shadow-2xl ">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <MessageSquare className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mt-2 bg-gradient-to-r from-[#8B0000] via-[#B22222] to-[#FF7F7F] text-transparent bg-clip-text font-extrabold">Welcome Back</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@email.com"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
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
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Signup link */}
        <div className="text-center mt-4">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-red-900 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT: Image - same height as login card */}
    <div className="hidden md:flex md:w-1/2 lg:w-2/3 items-center justify-center p-8">
      <img
        src={bg}
        alt="Login background"
        className="mt-20 w-[80%] h-[80%] object-cover rounded-lg shadow-2xl  transform transition-transform duration-500 hover:scale-105 hover:shadow-red-500/50 hover:shadow-2xl"
      />
    </div>
    
  </div>
);

}

export default LoginPage
