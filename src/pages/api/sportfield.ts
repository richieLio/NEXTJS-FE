import axios, { AxiosError } from 'axios';
import axiosInstance from './customize-axios';

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}

interface FieldRequestDTO {
  facilityId: string;
  name: string;
}

interface FieldUpdateRequestDTO {
  fieldId: string;
  name: any;
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const getAllField = (facilityId: string) => {
  return axiosInstance.get(`/field?facilityId=${facilityId}`);
};
const createField = (fieldRequestDTO: FieldRequestDTO) => {
  return axiosInstance.post("/field", fieldRequestDTO);
};
const updateField = (fieldUpdateRequestDTO: FieldUpdateRequestDTO) => {
  return axiosInstance.put("/field", fieldUpdateRequestDTO);
};


export {
  getAllField,
  createField,
  updateField
};