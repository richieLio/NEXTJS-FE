import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../components/UserContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { sendOtp } from "../../api/user";

const ForgotPassword = () => {
  const router = useRouter();
  const context = useContext(UserContext);
  const { user } = context;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtp(email as string);
      if (response.code === 200) {
        toast.success("An OTP has been send to your email!");
        router.push({
          pathname: "/recover/code",
          query: { email },
        });
      } else {
        toast.error(response.data.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    } catch (error) {
      toast.error("Failed to send password reset link.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && user.userId) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all hover:scale-105">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder-gray-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ease-in-out"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-blue-500 hover:text-blue-700 hover:underline transition-all duration-300">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
  }
export default ForgotPassword;
