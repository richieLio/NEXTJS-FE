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


const sendMoMoPayment = (bookingId: string, amount: number) => {
  return axiosInstance.post(`/payment/process/`, {
      bookingId,
      amount
  });
};
const getPaymentStatus = (orderId: string, requestId: string, BookingId: string, Amount: number ) => {
  return axiosInstance.post(`/payment/check-transaction/`, {
      orderId,
      requestId,
      BookingId,
      Amount
  });
};

export {
    sendMoMoPayment,
    getPaymentStatus
};