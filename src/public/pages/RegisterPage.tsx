import { useState } from "react";
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

type RegisterStep = "role" | "info" | "contact" | "success";
type UserRole = "patient" | "provider";

export function RegisterPage() {
  const [step, setStep] = useState<RegisterStep>("role");
  const [role, setRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setError("");
    setStep("info");
  };

  const handleInfoNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
    setError("");
    setStep("contact");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">BP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-600 mt-1">Join BesaPlus Healthcare</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step Indicator */}
          {step !== "role" && step !== "success" && (
            <div className="flex justify-between mb-8">
              <div className="flex-1 h-1 bg-blue-600 rounded-full mr-2"></div>
              <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
          )}

          {step === "role" ? (
            // Role Selection
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">I am a...</h2>
              <button
                onClick={() => handleRoleSelect("patient")}
                className="w-full p-6 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Patient / User</h3>
                    <p className="text-sm text-gray-600">Book appointments, access medical records</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("provider")}
                className="w-full p-6 border-2 border-gray-300 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Provider</h3>
                    <p className="text-sm text-gray-600">Doctor, clinic, hospital or home-care provider</p>
                  </div>
                </div>
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account? <a href="/login" className="text-blue-600 font-medium">Sign in</a>
              </p>
            </div>
          ) : step === "success" ? (
            // Success State
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Account created!</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {role === "provider" ? "Your provider account is under review. We'll notify you soon." : "Welcome to BesaPlus. Start booking now!"}
                </p>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                {role === "provider" ? "Go to Dashboard" : "Find Doctors & Book"}
              </button>
            </div>
          ) : step === "info" ? (
            // Info Collection
            <form onSubmit={handleInfoNext} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setError(""); }}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {role === "provider" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic/Organization Name</label>
                  <input
                    type="text"
                    placeholder="Your clinic name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              )}

              {error && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            // Contact & Password
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {error && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("info")}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-medium text-white transition ${
                    loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
