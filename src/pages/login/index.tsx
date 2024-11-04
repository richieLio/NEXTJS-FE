import React, { useState, useContext, useEffect } from "react";
import googleImg from "@/asset/google_logo_icon.png";
import Image from "next/image";
import { loginApi } from "../api/user";
import { toast } from "react-toastify";
import { UserContext } from "../../components/UserContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import LoadingButton from "@/components/ui/button";

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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
      setError("An error occurred during login");
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.role === "CUSTOMER") {
      router.push("/");
    }
    if (user && user.role === "PARTNER") {
      router.push("/partner");
    }
  }, [user, router]);

  // If user is logged in, render nothing or a loading spinner
  if (user && user.userId) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-Input bg-[#7ad3f62a]">
      {/* Form */}

      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Login
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        If you are already a member, easily log in
      </p>

      {/* Data entry group */}
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2 w-full mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative">
          <div className="flex flex-col space-y-2 w-full mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <svg
            className="bi bi-eye-fill absolute top-1/2 right-4 translate-y-1/2 cursor-pointer "
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
        <LoadingButton
          type="submit"
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          isLoading={isLoading}
        >
          Login
        </LoadingButton>
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
        <Link href="/recover/initiate">Forgot Your password?</Link>
      </p>

      <div className="mt-3 text-xs flex justify-between items-center">
        <p>
          <Link href="/register">If you don't have an account?</Link>
        </p>
        <button
          className="py-2 px-5 border rounded-xl"
          onClick={() => router.push("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
