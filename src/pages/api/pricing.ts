import axios, { AxiosError } from 'axios';
import axiosInstance from './customize-axios';

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}

interface CreateDTO {
  dayOfWeek: string;
  price: number;
  timeSlotId: string;
}
interface UpdateDTO {
  id: string;
  dayOfWeek: string;
  price: number;
}


const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const getAllPricing = (fieldId: string) => {
  return axiosInstance.get(`/fieldpricing/field//${fieldId}`);
};
const getPriceByTimeSlotId = (timeSlotId: string) => {
    return axiosInstance.get(`/fieldpricing/timeslot/${timeSlotId}`);
};
const createPricing = (createDTO: CreateDTO) => {
    return axiosInstance.post(`/fieldpricing/`, createDTO);
  };

  const updatePricing = (updateDTO: UpdateDTO) => {
    return axiosInstance.put(`/fieldpricing/update`, updateDTO);
  };

export {
    getAllPricing,
    getPriceByTimeSlotId,
    createPricing,
    updatePricing
};