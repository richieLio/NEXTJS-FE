import React, { useState } from "react";
import { useRouter } from "next/router";
import { emailVerify } from "../api/user";
import { toast } from "react-toastify";
import Image from "next/image";
import otpImg from "../../asset/otp.jpg";

const OtpVerification: React.FC = () => {
  const router = useRouter();
  const { email } = router.query;

  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP");
      toast.error("Please enter the OTP");
      return;
    }

    setError("");

    try {
      const response = await emailVerify(otp, email as string);
      if (response.code === 200) {
        toast.success("Account activated successfully");
        router.push("/login");
      } else {
        setError("OTP verification failed");
        toast.error("OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error", error);
      setError("An error occurred during OTP verification");
      toast.error("An error occurred during OTP verification");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="bg-white/80 backdrop-blur-sm flex rounded-3xl shadow-2xl max-w-4xl p-8 mx-4">
        {/* Form */}
        <div className="sm:w-1/2 px-8">
          <h2 className="font-bold text-3xl text-primary mb-6 text-center">
            Enter OTP
          </h2>
          <p className="text-sm text-secondary/70 text-center mb-8">
            Enter the OTP sent to your email to activate your account
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                className="w-full p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-4 font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300">
              Verify OTP
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="hidden sm:block w-1/2 p-4">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              src={otpImg}
              alt="otp verification illustration"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;