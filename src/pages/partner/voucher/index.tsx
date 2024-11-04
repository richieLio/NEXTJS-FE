import axios, { AxiosError } from 'axios';
import axiosInstance from './customize-axios';

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}

interface CreateForm {
  fieldId: string;
  startTime: string;
  endTime: string;
}

interface UpdateForm {
  id: string;
  startTime: any;
  endTime: string;
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const getAllVoucher = (userId: string) => {
  return axiosInstance.get(`/voucher/${userId}`);
};

const updateVoucher = (updateForm: UpdateForm) => {
  return axiosInstance.put(`/voucher/`, updateForm);
}
const createVoucher = (createForm: CreateForm) => {
  return axiosInstance.post(`/voucher/`, createForm);

}


export {
    getAllVoucher,
    updateVoucher,
    createVoucher
};