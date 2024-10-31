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

const createBooking = (timeSlotId: string, fieldId: string) => {
  return axiosInstance.post(`/booking/create-booking/`, {
    timeSlotId,
    fieldId
  });
};

export {
    createBooking,
};