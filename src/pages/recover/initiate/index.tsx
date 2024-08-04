import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../components/UserContext";
import { Input, Button, Spacer, Card } from "@nextui-org/react";
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
    <div className="flex justify-center items-center ">
      <Card className="p-6 max-w-md w-full shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <Input
            clearable
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-6"
          />
          <button
            className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl py-2 transition-colors mt-5 "
            type="submit"
            color="primary"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
