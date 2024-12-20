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

const getPartnerRevenue = (startDate: string, endDate: string) => {
  return axiosInstance.get(`/payment/revenue-by-partner?startDate=${startDate}&endDate=${endDate}`);
};


export {
    getPartnerRevenue,
};