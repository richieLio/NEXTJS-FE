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
  dayOfWeek: string;
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

const getAllTimeSlot = (fieldId: string, dateTime: string) => {
  return axiosInstance.get(`/timeslot/${fieldId}?dateTime=${dateTime}`);
};
const getAllTimeSlotManage = (fieldId: string) => {
  return axiosInstance.get(`/timeslot/partner/${fieldId}`);
};
const getPriceByTimeSlotId = (timeSlotId: string) => {
  return axiosInstance.get(`/fieldpricing/timeslot/${timeSlotId}`);
};
const updateTimeslot = (updateForm: UpdateForm) => {
  return axiosInstance.put(`/timeslot/`, updateForm);
}
const createTimeslot = (createForm: CreateForm) => {
  return axiosInstance.post(`/timeslot/`, createForm);

}
const getPricingForTimeslot = (timeslotId : string) => {
  return axiosInstance.get(`/timeslot/price/${timeslotId}`);

}

export {
    getAllTimeSlot,
    getPriceByTimeSlotId,
    createTimeslot,
    updateTimeslot,
    getPricingForTimeslot,
    getAllTimeSlotManage
};