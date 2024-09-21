import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { register } from "../api/user"; // Adjust the import path as needed
import { toast } from "react-toastify";
import { UserContext } from "../../components/UserContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import LoadingButton from "@/components/ui/button";
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
      const response = await register(
        email,
        password,
        phoneNumber,
        address,
        gender,
        dob,
        fullName
      );
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
    } finally {
      setIsLoading(false);
    }
  };

  const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-Input bg-[#7ad3f62a]">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to SSB
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Create your account to get started
      </p>
      {/* Data entry group */}
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2 w-full mb-4">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
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
        <div className="flex flex-col space-y-2 w-full mb-4">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="text"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2 w-full mb-4">
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            name="address"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex flex-col space-y-2 w-full mb-4">
            <Label htmlFor="Gender">Gender</Label>
            <Select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <div className="flex flex-col space-y-2 w-full mb-4">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              type="date"
              name="dob"
              placeholder="Enter your date of birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
        <div className="relative">
          <div className="flex flex-col space-y-2 w-full mt-4 mb-4">
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
          onClick={handleSubmit}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          isLoading={isLoading}
        >
          Sign up &rarr;
          <BottomGradient />
        </LoadingButton>
      </form>

      <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-gray-400" />
        <p className="text-center text-sm">OR</p>
        <hr className="border-gray-400" />
      </div>

      <button className="py-2 w-full rounded-xl mt-5 flex justify-center text-sm">
        <img className="w-6 mr-3" src="asset/google_logo_icon.png" alt="google logo" />
        Register with Google
      </button>

      <p className="mt-5 text-xs border-b border-gray-400 py-4">
        <a href="#">Forgot Your password?</a>
      </p>

      <div className="mt-3 text-xs flex justify-between items-center">
        <p>
          <a href="/login">Already have an account?</a>
        </p>
        <button
          className="py-2 px-5 border rounded-xl"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}
