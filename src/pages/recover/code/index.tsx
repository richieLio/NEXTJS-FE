import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../components/UserContext";
import { useRouter } from "next/router";
import { verifyOtp } from "../../api/user"; // Adjust the import path as needed
import { toast } from "react-toastify";
import Image from "next/image";
import otpImg from "../../../asset/otp.jpg";

const OtpVerification: React.FC = () => {
  const router = useRouter();
  const { email } = router.query;
  const context = useContext(UserContext);
  const { user } = context;

  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP");
      toast.error("Please enter the OTP");
      return;
    }

    setError(""); // Clear any previous error messages

    try {
      const response = await verifyOtp(email as string, otp);
      if (response.code === 200) {
        toast.success("OTP verifycation success");
        router.push({
          pathname: "/recover/password",
          query: { email },
        });
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
  useEffect(() => {
    if (user && user.userId) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <section className=" flex items-center justify-center">
      <div className="bg-[#7ad3f62a] flex rounded-2xl shadow-lg max-w-3xl p-4">
        {/* Form */}
        <div className="sm:w-1/2 px-16">
          <h2 className="font-bold text-2xl text-[#4527a5] text-center">
            Enter OTP
          </h2>
          <p className="text-sm mt-7 text-[#6c57b1] text-opacity-70 text-center">
            Enter the OTP sent to your email to activate your account
          </p>

          {/* Data entry group */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className="p-2 mt-8 rounded-xl border"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl py-2 transition-colors mt-5">
              Verify OTP
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="hidden sm:block w-full sm:w-1/2 flex items-center justify-center">
          <Image
            className="w-full h-full object-cover rounded-2xl"
            src={otpImg}
            alt="otp image"
          />
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;
