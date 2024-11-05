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

interface VoucherReqDTO {
  code: string;
  discountAmount: number;
  discountType: string;
  expiryAt: string;
  isSystem: number;
  fieldId: string;
  minimumOrderAmount: number;
  maxDiscountAmount: number;
}

const isAxiosError = (error: any): error is AxiosError => {
return error.isAxiosError;
};

const applyVoucher = (calculatePriceDTO: CalculatePriceDTO) => {
return axiosInstance.post(`/Voucher/apply/`, calculatePriceDTO);
};
const createVoucher = (voucherReqDTO: VoucherReqDTO) => {
return axiosInstance.post(`/Voucher`, voucherReqDTO);
};
const updateVoucher = (id: string, voucherReqDTO: VoucherReqDTO) => {
  return axiosInstance.put(`/Voucher/update/${id}`, voucherReqDTO);
  };
const deleteVoucher = (id: string) => {
    return axiosInstance.delete(`/Voucher/${id}`);
};
const getAllVoucher = () => {
  return axiosInstance.get(`/Voucher`);
};

export {
  applyVoucher,
  createVoucher,
  getAllVoucher,
  updateVoucher,
  deleteVoucher
};