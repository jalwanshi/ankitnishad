"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { ShieldCheck, Eye, EyeOff, Lock, HelpCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Authenticated successfully. Redirecting...");
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      // Map standard firebase errors to human-readable strings
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email address or password validation check failed.");
      } else if (err.code === "auth/too-many-requests") {
        setError("This account has been temporarily disabled due to too many failed login attempts.");
      } else {
        setError("An unexpected authentication error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");

    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotSuccess("Password reset link sent! Check your inbox.");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess("");
        setForgotEmail("");
      }, 3000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setForgotError("No registered admin account found with this email.");
      } else {
        setForgotError("Failed to send reset email. Please try again.");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-bg px-6 relative">
      <div className="w-full max-w-md bg-white border border-border-grey shadow-xl p-8 md:p-12 relative z-10">

        {/* Head */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex justify-center mb-6">
            <img
              src="/assets/logo.png"
              alt="Ankit Nishad Logo"
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-light text-primary-black uppercase tracking-wider">
              Admin Login
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
              Authorized access only
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs py-3 px-4 mb-6 text-center font-light">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs py-3 px-4 mb-6 text-center font-light">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email input */}
          <div className="flex flex-col">
            <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. enter@gmail.com"
              required
              className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col relative">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">
                Secure Passcode
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[9px] uppercase tracking-widest text-muted-grey hover:text-primary-black hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full border border-border-grey bg-main-bg py-3 pl-4 pr-10 text-xs font-light focus:outline-none focus:border-primary-black transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-grey hover:text-primary-black cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black py-4 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Authenticating Client..." : "Log in to Portal"}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-primary-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <div className="bg-white border border-border-grey p-8 max-w-sm w-full relative">
            <div className="absolute inset-0 border border-primary-black translate-x-2 translate-y-2 -z-10" />

            <h3 className="font-display text-lg uppercase tracking-wider text-primary-black mb-2">
              Reset Password
            </h3>
            <p className="text-[10px] text-muted-grey uppercase tracking-widest mb-6 leading-relaxed">
              Enter your admin email address to receive a secure password recovery link.
            </p>

            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] py-2 px-3 mb-4 text-center font-light">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-[10px] py-2 px-3 mb-4 text-center font-light">
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
              />

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotError("");
                    setForgotSuccess("");
                  }}
                  className="flex-1 border border-border-grey hover:border-primary-black py-2.5 text-[10px] uppercase tracking-widest font-semibold text-muted-grey hover:text-primary-black transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
