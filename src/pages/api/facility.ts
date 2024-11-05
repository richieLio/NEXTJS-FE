import axios, { AxiosError } from 'axios';
import axiosInstance from './customize-axios';

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}

interface FacilityRequestDTO {
  name: string;
  location?: string;
  contactInfo?: string;
  type?: string;
}


interface UpdateFacilityDto {
  id: string;
  name: string;
  location?: string;
  contactInfo?: string;
  type?: string;
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const getAllFacility = (page: number, userId: string) => {
  return axiosInstance.get(`/facility?page=${page}`);
};
const getAllFacilityManage = (page: number) => {
  return axiosInstance.get(`/facility/manage?page=${page}`);
};

const createFacility = (facilityRequestDTO: FacilityRequestDTO) => {
  return axiosInstance.post("/facility", facilityRequestDTO);
};

const updateFacility = (updateModel: UpdateFacilityDto) => {
  return axiosInstance.put(`/facility/update`, updateModel);
};
const getFacilityById = (id: string) => {
  return axiosInstance.get(`/facility/${id}`);
};

export {
  getAllFacility,
  createFacility,
  updateFacility,
  getAllFacilityManage,
  getFacilityById
};