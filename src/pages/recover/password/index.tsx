import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../components/UserContext";import { useRouter } from "next/router";
import { resetPassword } from "../../api/user"; // Adjust the import path as needed
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

    setError(""); // Clear any previous error messages

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
    <section className="flex items-center justify-center">
      <div className="bg-[#7ad3f62a] flex rounded-2xl shadow-lg max-w-3xl p-4">
        {/* Form */}
        <div className="sm:w-1/2 px-16">
          <h2 className="font-bold text-2xl text-[#4527a5] text-center">
            Reset Password
          </h2>
          <p className="text-sm mt-7 text-[#6c57b1] text-opacity-70 text-center">
            Enter your new password below
          </p>

          {/* Data entry group */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className="p-2 mt-8 rounded-xl border"
              type="password"
              name="newPassword"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className="p-2 rounded-xl border"
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl py-2 transition-colors mt-5">
              Reset Password
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="hidden sm:block w-full sm:w-1/2 flex items-center justify-center">
          <Image
            className="w-full h-full object-cover rounded-2xl"
            src={passwordImg}
            alt="password image"
          />
        </div>
      </div>
    </section>
  );
};

export default NewPassword;
