import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { register } from "../api/user"; // Adjust the import path as needed
import { toast } from "react-toastify";
import { UserContext } from "../../components/UserContext";
import googleImg from "../../asset/google_logo_icon.png";
import registerImg from "../../asset/register.jpg";
import Link from "next/link";
export default function Register() {
  const router = useRouter();
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Minimum password length of 6 characters
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setError(""); // Clear any previous error messages

    try {
      const response = await register(email, password, phoneNumber, address, gender, dob, fullName);
      if (response.code === 200) {
        toast.success("Registration successful");
        router.push({
          pathname: "/email-verify",
          query: { email },
        });
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Registration error", error);
      setError("An error occurred during registration");
      toast.error("An error occurred during registration");
    }
  };

  return (
    <section className=" flex items-center justify-center">
      <div className="bg-[#7ad3f62a] flex rounded-2xl shadow-lg w-full sm:w-[90%] lg:w-[70%] xl:w-[60%]">
        {/* Form */}
        <div className="w-full sm:w-1/2 p-8">
          <h2 className="font-bold text-2xl text-[#4527a5] text-center">
            Register
          </h2>
          <p className="text-sm mt-7 text-[#6c57b1] text-opacity-70 text-center">
            Create your account to get started
          </p>

          {/* Data entry group */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className="p-2 mt-8 rounded-xl border"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="p-2 mt-2 rounded-xl border"
              type="text"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-2 mt-2 rounded-xl border"
              type="text"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              className="p-2 mt-2 rounded-xl border"
              type="text"
              name="address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="p-2 mt-2 rounded-xl border"
              type="text"
              name="gender"
              placeholder="Enter your gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <input
              className="p-2 mt-2 rounded-xl border"
              type="date"
              name="dob"
              placeholder="Enter your date of birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <div className="relative">
              <input
                className="p-2 mt-2 rounded-xl border w-full"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg
                className="bi bi-eye-fill absolute top-1/2 right-4 translate-y-1/2 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="gray"
                viewBox="0 0 16 16"
                onClick={togglePasswordVisibility}
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              </svg>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl py-2 transition-colors mt-5">
              Register
            </button>
          </form>

          <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <button className="py-2 w-full rounded-xl mt-5 flex justify-center text-sm">
            <Image className="w-6 mr-3" src={googleImg} alt="google logo" />
            Register with Google
          </button>

          <p className="mt-5 text-xs border-b border-gray-400 py-4">
            <a href="#">Forgot Your password?</a>
          </p>

          <div className="mt-3 text-xs flex justify-between items-center">
            <p>
              <a href="/login">Already have an account?</a>
            </p>
            <button className="py-2 px-5 border rounded-xl" onClick={() => router.push("/login")}>
              Login
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="hidden sm:block w-full sm:w-1/2 flex items-center justify-center">
          <Image
            className="w-full h-full object-cover rounded-2xl"
            src={registerImg}
            alt="login image"
          />
        </div>
      </div>
    </section>
  );
}
