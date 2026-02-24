import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Zap } from "lucide-react";

type LoginStep = "email" | "password" | "success";

export function LoginPage() {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setStep("password");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      
      // Determine user role based on email
      let role: "patient" | "provider" | "admin" = "patient";
      if (email.includes("doctor") || email.includes("provider")) {
        role = "provider";
      } else if (email.includes("admin")) {
        role = "admin";
      }

      // Create user object and login
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0].replace(/[._]/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        role,
      };

      login(newUser);
      setStep("success");
    }, 1200);
  };

  const handleQuickLogin = (role: "patient" | "provider") => {
    const testEmail = role === "provider" ? "dr.sarah@hospital.com" : "john.patient@email.com";
    setEmail(testEmail);
    setPassword("password123");
    setLoading(true);
    setError("");
    
    setTimeout(() => {
      setLoading(false);
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: testEmail,
        name: role === "provider" ? "Dr. Sarah Johnson" : "John Doe",
        role,
      };

      login(newUser);
      setStep("success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">BP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BesaPlus</h1>
          <p className="text-sm text-gray-600 mt-1">Universal Healthcare Solution</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === "success" ? (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Welcome back!</h2>
                <p className="text-sm text-gray-600 mt-2">You're logged in successfully. Redirecting...</p>
              </div>
              <button 
                onClick={() => navigate("/user/dashboard")}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition active:scale-95"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={step === "email" ? handleEmailNext : handleLogin} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                {step === "email" ? "Sign in to your account" : "Enter your password"}
              </h2>

              {/* Email Step */}
              {step === "email" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Password Step */}
              {step === "password" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-700">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                {step === "password" && (
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition ${
                    loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Signing in..." : step === "password" ? "Sign in" : "Next"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Quick Login Section */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center font-medium">Quick Login (Demo)</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => handleQuickLogin("patient")}
                    disabled={loading}
                    className="py-2 px-3 border-2 border-green-500 bg-green-50 rounded-lg font-medium text-sm text-green-700 hover:bg-green-100 transition active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Patient</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleQuickLogin("provider")}
                    disabled={loading}
                    className="py-2 px-3 border-2 border-purple-500 bg-purple-50 rounded-lg font-medium text-sm text-purple-700 hover:bg-purple-100 transition active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Provider</span>
                  </button>
                </div>
              </div>

              {/* Social Buttons */}
              <button type="button" className="w-full py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition active:scale-95">
                Continue with Google
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account? <a href="/register" className="text-blue-600 font-medium hover:text-blue-700">Sign up here</a>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>Secure login • Encrypted connection • HIPAA compliant</p>
        </div>
      </div>
    </div>
  );
}
