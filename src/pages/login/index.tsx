import React, { useState, useContext, useEffect } from "react";
import googleImg from "@/asset/google_logo_icon.png";
import loginImg from "@/asset/login.jpeg";
import Image from "next/image";
import { loginApi } from "../api/user"; // Adjust the import path as needed
import { toast } from "react-toastify";
import { UserContext } from "../../components/UserContext";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user, loginContext } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginApi(email, password);
      const { user: loggedInUser, token } = response.data; 
     
      if (response.isSuccess === true) {
        toast.success("Login success");
        loginContext(loggedInUser.email, token);
        router.push("/");
      } else {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.userId) {
      router.push("/");
    }
  }, [user, router]);

  // If user is logged in, render nothing or a loading spinner
  if (user && user.userId) {
    return null; // or a loading spinner
  }

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="bg-[#7ad3f62a] flex rounded-2xl shadow-lg max-w-3xl p-4">
        {/* Form */}
        <div className="sm:w-1/2 px-16">
          <h2 className="font-bold text-2xl text-[#4527a5] text-center">Login</h2>
          <p className="text-sm mt-7 text-[#6c57b1] text-opacity-70 text-center">
            If you already a member, easily log in
          </p>

          {/* Data entry group */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className="p-2 mt-8 rounded-xl border"
              type="text"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                className="p-2 mt-5 rounded-xl border w-full"
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
              Login
            </button>
          </form>

          <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <button className="py-2 w-full rounded-xl mt-5 flex justify-center text-sm">
            <Image className="w-6 mr-3" src={googleImg} alt="google logo" />
            Login with Google
          </button>

          <p className="mt-5 text-xs border-b border-gray-400 py-4">
            <a href="#">Forgot Your password?</a>
          </p>

          <div className="mt-3 text-xs flex justify-between items-center">
            <p>
              <a href="#">If you don't have an account?</a>
            </p>
            <button className="py-2 px-5 border rounded-xl">Register</button>
          </div>
        </div>

        {/* Image */}
        <div className="sm:block hidden w-1/2">
          <Image
            className="sm:block hidden rounded-2xl"
            src={loginImg}
            alt="login image"
          />
        </div>
      </div>
    </section>
  );
}
