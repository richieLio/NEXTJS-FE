import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { UserContext } from "@/components/UserContext";
import React, { useState, useEffect, useContext } from "react";
import ReactPaginate from 'react-paginate';
import {createFacility, updateFacility, getAllFacilityManage } from "@/pages/api/facility";
import Breadcrumb from "@/components/Breadcrumb";
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

const Facility = () => {
  const [facilities, setFacilities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [facilityData, setFacilityData] = useState<FacilityRequestDTO>({
    name: '',
    location: '',
    contactInfo: '',
    type: ''
  });

  const router = useRouter();
  const context = useContext(UserContext);
  const user = context;

  const facilityTypes = ['Football', 'Basketball', 'Tennis', 'Swimming', 'Volleyball', 'Badminton'];

  const getFacilites = async (page: number) => {
    
    try {
      setLoading(true);
      const res = await getAllFacilityManage(page, user?.user?.id);
      if (res && res.data) {
        console.log('Total Pages:', res.data.totalPage);

        setTotal(res.data.totalRecords);
        setTotalPages(res.data.totalPage);
        setFacilities(res.data.listData);
        setCurrentPage(page - 1);
      }
    } catch (err) {
      setError('Failed to fetch facilities');
      toast.error('Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFacilites(1);
  }, []);

  const handlePageClick = (event: { selected: number }) => {
    console.log('Selected page:', event.selected + 1);
    getFacilites(event.selected + 1);
  };

  const handleOpenEditModal = (facility: any) => {
    setSelectedFacility(facility);
    setFacilityData({
      name: facility.name,
      location: facility.location,
      contactInfo: facility.contactInfo,
      type: facility.type
    });
    setIsEditModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedFacility(null);
    setIsEditModalOpen(false);
    setFacilityData({
      name: '',
      location: '',
      contactInfo: '',
      type: ''
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFacilityData({
      name: '',
      location: '',
      contactInfo: '',
      type: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFacilityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateFacility = async () => {
    try {
      if (!facilityData.name) {
        toast.error('Please fill in facility name');
        return;
      }

      const facilityRequestDTO: FacilityRequestDTO = {
        name: facilityData.name,
        location: facilityData.location || undefined,
        contactInfo: facilityData.contactInfo || undefined,
        type: facilityData.type || undefined
      };

      await createFacility(facilityRequestDTO);
      toast.success('Facility created successfully');
      handleCloseCreateModal();
      getFacilites(currentPage + 1);
    } catch (err) {
      toast.error('Failed to create facility');
    }
  };

  const handleUpdateFacility = async () => {
    try {
      if (!facilityData.name) {
        toast.error('Please fill in facility name');
        return;
      }

      const updateModel: UpdateFacilityDto = {
        id: selectedFacility.id,
        name: facilityData.name,
        location: facilityData.location || undefined,
        contactInfo: facilityData.contactInfo || undefined,
        type: facilityData.type || undefined
      };

      await updateFacility(updateModel);
      toast.success('Facility updated successfully');
      handleCloseEditModal();
      getFacilites(currentPage + 1);
    } catch (err) {
      toast.error('Failed to update facility');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // await deleteFacility(id);
      toast.success('Facility deleted successfully');
      getFacilites(currentPage + 1);
    } catch (err) {
      toast.error('Failed to delete facility');
    }
  };

  const handleNavigateToFields = (facilityId: string) => {
    router.push(`/partner/facility/fields/${facilityId}`);
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
        Error loading facility.
      </div>
    );
  }

  return (
    
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">

      <Breadcrumb />
        <h1 className="text-2xl font-bold text-gray-800">Facilities</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add New Facility
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {facilities.map((facility, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{facility.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{facility.contactInfo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{facility.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{facility.location}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                  <button 
                    onClick={() => handleOpenEditModal(facility)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleNavigateToFields(facility.id)}
                    className="text-green-600 hover:text-green-900 font-medium"
                  >
                    View Fields
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {facilities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No facilities found.
        </div>
      )}
     
      <div className="mt-4 flex justify-center">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next →"
          previousLabel="← Prev"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          forcePage={currentPage}
          marginPagesDisplayed={2}
          className="flex gap-2 items-center"
          pageClassName="px-3 py-1 rounded hover:bg-gray-100"
          activeClassName="bg-blue-500 text-white hover:bg-blue-600"
          previousClassName="px-3 py-1 rounded hover:bg-gray-100"
          nextClassName="px-3 py-1 rounded hover:bg-gray-100"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Create New Facility</h2>
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
                  value={facilityData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                <input 
                  type="text" 
                  name="contactInfo"
                  value={facilityData.contactInfo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  name="type"
                  value={facilityData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a type</option>
                  {facilityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={facilityData.location}
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
                onClick={handleCreateFacility}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Create Facility
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit Facility</h2>
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
                  value={facilityData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                <input 
                  type="text" 
                  name="contactInfo"
                  value={facilityData.contactInfo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  name="type"
                  value={facilityData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a type</option>
                  {facilityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={facilityData.location}
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
                onClick={handleUpdateFacility}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Update Facility
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
 };
export default Facility;
