import axios, { AxiosError } from 'axios';
import axiosInstance from './customize-axios';

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const loginApi = (email: string, password: string) => {
  return axiosInstance.post("/user/login", { email, password });
};

const register = async (
  email: string,
  password: string,
  phoneNumber: string,
  address: string,
  gender: string,
  dob: string,
  fullName: string
) => {
  try {
    const response = await axiosInstance.post("/user/register", {
      email,
      password,
      phoneNumber,
      address,
      gender,
      dob,
      fullName,
    });
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.error("Error register:", res);
    throw error;
  }
};

 const emailVerify = async (otp: string, email: string) => {
  try {
    const response = await axiosInstance.post("/user/verify-email", { otp, email });
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.error("Verify error:", res);
    throw error;
  }
};
const userProfile = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.error("UserProfile error:", res);
    throw error;
  }
};

const sendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post("/verify/send-otp", { email });
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.error("Send OTP error:", res);
    throw error;
  }
};

const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/verify/verify-otp", {
      email,
      OTPCode: otp,
    });
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.error("Error when verifying OTP:", res);
    throw error;
  }
};

const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post("/user/reset-password", {
      email,
      Password: newPassword,
    });
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.error("Error when reset password:", res);
    throw error;
  }
};

const putUpdateProfile = async (
  id: string,
  email: string,
  phoneNumber: string,
  address: string,
  gender: string,
  dob: string,
  fullName: string
) => {
  return await axiosInstance.put(`/user/update-profile`, {
    id,
    email,
    phoneNumber,
    address,
    gender,
    dob,
    fullName,
  });
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await axiosInstance.post("/user/change-password", {
      oldPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.log("Error when changing password:", res);
    throw error;
  }
};

const fbLogin = async (accessToken: string) => {
  try {
    const response = await axiosInstance.post(
      `/user/fb-login?accessToken=${accessToken}`
    );
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.log("Error when Facebook login:", res);
    throw error;
  }
};

const ggLogin = async (credential: string) => {
  try {
    const response = await axiosInstance.post(
      `/user/gg-login?credential=${credential}`
    );
    return response;
  } catch (error) {
    const res: ErrorResponse = {};
    if (isAxiosError(error) && error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    console.log("Error when Google login:", res);
    throw error;
  }
};

export {
  loginApi,
  register,
  emailVerify,
  userProfile,
  sendOtp,
  verifyOtp,
  resetPassword,
  putUpdateProfile,
  changePassword,
  fbLogin,
  ggLogin,
};
