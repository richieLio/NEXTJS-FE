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
  description: string;
  status: string;
  location?: string;
  contactInfo?: string;
  type?: string;
}

interface UpdateFacilityDto {
  id: string;
  name: string;
  description: string;
  status: string;
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

const getFacilityById = (facilityId: string) => {
  return axiosInstance.get(`/facility/${facilityId}`);
};

const createFacility = (facilityRequestDTO: FacilityRequestDTO) => {
  return axiosInstance.post("/facility", facilityRequestDTO);
};

const deleteFacility = (facilityId: string) => {
  return axiosInstance.put(`/delete/${facilityId}`);
};

const updateFacility = (facilityId: string, updateModel: UpdateFacilityDto) => {
  return axiosInstance.put(`/facility/update?facilityId=${facilityId}`, updateModel);
};

export {
  getAllFacility,
  getFacilityById,
  createFacility,
  deleteFacility,
  updateFacility,
};