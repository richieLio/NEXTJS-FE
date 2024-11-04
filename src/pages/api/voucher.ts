import axios, { AxiosError } from 'axios';
import axiosInstance from './customize-axios';

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}
interface CalculatePriceDTO {
    timeSlotId: string;
    voucherCode: string;
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const applyVoucher = (calculatePriceDTO: CalculatePriceDTO) => {
  return axiosInstance.post(`/Voucher/apply/`, calculatePriceDTO);
};

export {
    applyVoucher,
   
};