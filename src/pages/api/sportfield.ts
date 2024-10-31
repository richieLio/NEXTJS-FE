import axios, { AxiosError } from 'axios';
import axiosInstance from './customize-axios';

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}

interface FieldPricingRequestDTO {
  id: string;
  data: any;
}

interface UpdateFieldPricingDto {
  id: string;
  data: any;
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const getAllField = (facilityId: string) => {
  return axiosInstance.get(`/field?facilityId=${facilityId}`);
};

export {
  getAllField
};