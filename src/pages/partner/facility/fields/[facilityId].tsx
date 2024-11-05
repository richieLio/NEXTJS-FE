import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { UserContext } from "@/components/UserContext";
import React, { useState, useEffect, useContext } from "react";
import {createField, updateField, getAllField } from "@/pages/api/sportfield";
import Breadcrumb from "@/components/Breadcrumb";

interface FieldRequestDTO {
    facilityId: string;
    name: string;
}
  
interface FieldUpdateRequestDTO {
    fieldId: string;
    name: string;
}

const Fields = () => {
  const [fields, setFields] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [fieldData, setFieldData] = useState<FieldRequestDTO>({
    facilityId: '',
    name: ''
  });

  const router = useRouter();
  const context = useContext(UserContext);
  const user = context;
  const facilityId = router.query.facilityId as string;
  console.log(facilityId);
  const getFields = async () => {
    try {
      setLoading(true);
      const res = await getAllField(facilityId);
      if (res && res.data) {
        setFields(res.data);
      }
    } catch (err) {
      setError('Failed to fetch fields');
      toast.error('Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facilityId) {
      getFields();
    }
  }, [facilityId]);

  const handleOpenEditModal = (field: any) => {
    setSelectedField(field);
    setFieldData({
      facilityId: field.facilityId,
      name: field.name
    });
    setIsEditModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedField(null);
    setIsEditModalOpen(false);
    setFieldData({
      facilityId: '',
      name: ''
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFieldData({
      facilityId: '',
      name: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateField = async () => {
    try {
      if (!fieldData.name) {
        toast.error('Please fill in field name');
        return;
      }

      const fieldRequestDTO: FieldRequestDTO = {
        facilityId: facilityId,
        name: fieldData.name
      };

      await createField(fieldRequestDTO);
      toast.success('Field created successfully');
      handleCloseCreateModal();
      getFields();
    } catch (err) {
      toast.error('Failed to create field');
    }
  };

  const handleUpdateField = async () => {
    try {
      if (!fieldData.name) {
        toast.error('Please fill in field name');
        return;
      }

      const updateModel: FieldUpdateRequestDTO = {
        fieldId: selectedField.id,
        name: fieldData.name
      };

      await updateField(updateModel);
      toast.success('Field updated successfully');
      handleCloseEditModal();
      getFields();
    } catch (err) {
      toast.error('Failed to update field');
    }
  };

  const handleViewTimeslot = (fieldId: string) => {
    router.push(`/partner/facility/fields/timeslot/${fieldId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Error loading fields.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Breadcrumb />
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          Fields Management
        </h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2 transform transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add New Field
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                  Name
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.map((field, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{field.name}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-4">
                  <button 
                    onClick={() => handleOpenEditModal(field)}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleViewTimeslot(field.id)}
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-900 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    View Timeslot
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {fields.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl mt-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p className="mt-2 text-gray-500 text-lg font-medium">No fields found.</p>
          <p className="mt-1 text-gray-400 text-sm">Create a new field to get started.</p>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Create New Field</h2>
              <button onClick={handleCloseCreateModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={fieldData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={handleCloseCreateModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateField}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Create Field
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit Field</h2>
              <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={fieldData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateField}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Update Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;