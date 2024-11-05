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
const bookingHistory = (userId: string) => {
  return axiosInstance.get(`/booking/user-booking-history/${userId}`);
};
const bookingManage = (facilityId: string, page: number) => {
  return axiosInstance.get(`/booking/manage?facilityId=${facilityId}&page=${page}`);
};


export {
    createBooking,
    bookingHistory,
    bookingManage
};