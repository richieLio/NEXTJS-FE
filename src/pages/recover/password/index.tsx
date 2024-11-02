import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../components/UserContext";
import { useRouter } from "next/router";
import { resetPassword } from "../../api/user";
import { toast } from "react-toastify";
import Image from "next/image";
import passwordImg from "../../../asset/password.jpg";

const NewPassword: React.FC = () => {
  const router = useRouter();
  const { email } = router.query;
  const context = useContext(UserContext);
  const { user } = context;

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields");
      toast.error("Please fill in both fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setError("");

    try {
      const response = await resetPassword(email as string, newPassword);
      if (response.code === 200) {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        setError("Password reset failed");
        toast.error("Password reset failed");
      }
    } catch (error) {
      console.error("Password reset error", error);
      setError("An error occurred during password reset");
      toast.error("An error occurred during password reset");
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white/80 backdrop-blur-lg flex rounded-3xl shadow-2xl max-w-4xl w-full transform hover:scale-[1.02] transition-all duration-300">
        {/* Form */}
        <div className="w-full sm:w-1/2 p-8 md:p-12">
          <h2 className="font-bold text-3xl text-purple-800 text-center mb-2 animate-fadeIn">
            Reset Password
          </h2>
          <p className="text-sm mt-4 text-purple-600/70 text-center animate-slideUp">
            Enter your new password below
          </p>

          <form className="flex flex-col gap-6 mt-8" onSubmit={handleSubmit}>
            <div className="relative group">
              <input
                className="w-full p-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                type="password"
                name="newPassword"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </div>

            <div className="relative group">
              <input
                className="w-full p-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </div>

            {error && (
              <p className="text-red-500 text-sm animate-shake">
                {error}
              </p>
            )}

            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ease-in-out">
              Reset Password
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="hidden sm:block w-1/2 p-4">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700 ease-in-out"
              src={passwordImg}
              alt="password image"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewPassword;