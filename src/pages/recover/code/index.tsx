import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../components/UserContext";
import { useRouter } from "next/router";
import { verifyOtp } from "../../api/user";
import { toast } from "react-toastify";
import Image from "next/image";
import otpImg from "../../../asset/otp.jpg";

const OtpVerification: React.FC = () => {
  const router = useRouter();
  const { email } = router.query;
  const context = useContext(UserContext);
  const { user } = context;

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState<string>("");

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextElementSibling) {
      (element.nextElementSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const otpInputs = document.querySelectorAll('input');
      (otpInputs[index - 1] as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete OTP");
      toast.error("Please enter the complete OTP");
      return;
    }

    setError("");

    try {
      const response = await verifyOtp(email as string, otpString);
      if (response.code === 200) {
        toast.success("OTP verification success");
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
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white flex rounded-2xl shadow-lg max-w-3xl p-8">
        <div className="sm:w-1/2 px-8">
          <h2 className="font-bold text-2xl text-purple-700 text-center mb-6">
            Enter OTP
          </h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Enter the OTP sent to your email to activate your account
          </p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold text-purple-700 
                           focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                           transition-all duration-200 outline-none
                           hover:border-purple-400"
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ease-in-out"
            >
              Verify OTP
            </button>
          </form>
        </div>

        <div className="hidden sm:block w-1/2">
          <Image
            className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-all duration-300"
            src={otpImg}
            alt="otp image"
          />
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;