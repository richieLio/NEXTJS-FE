import { getAllFacility } from "../api/facility";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { UserContext } from "@/components/UserContext";
import React, { useState, useEffect, useContext } from "react";
import ReactPaginate from 'react-paginate';

const Facility = () => {
  const [facilities, setFacilities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [provinces, setProvinces] = React.useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = React.useState<string>("");
  const router = useRouter();
  const context = useContext(UserContext);
  const user = context;

  const getProvinces = async () => {
    try {
      const response = await fetch('https://provinces.open-api.vn/api/');
      const data = await response.json();
      setProvinces(data);
    } catch (err) {
      console.error('Failed to fetch provinces:', err);
    }
  };

  const getFacilites = async (page: number) => {
    console.log('Fetching facilities for page:', page);

    try {
      setLoading(true);
      const res = await getAllFacility(page, user?.userId);
      if (res && res.data) {
        console.log('Total Pages:', res.data.totalPage);
        let filteredData = res.data.listData;
        if (selectedProvince) {
          filteredData = filteredData.filter((facility: any) => 
            facility.location.includes(selectedProvince)
          );
        }
        setTotal(res.data.totalRecords);
        setTotalPages(res.data.totalPage);
        setFacilities(filteredData);
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
    getProvinces();
    getFacilites(1);
  }, []);

  useEffect(() => {
    getFacilites(1);
  }, [selectedProvince]);

  const handlePageClick = (event: { selected: number }) => {
    console.log('Selected page:', event.selected + 1);
    getFacilites(event.selected + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading facility.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Facilities</h1>
        <select 
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          <option value="">All Provinces</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img 
                src={`https://placehold.co/600x400/e2e8f0/1e40af?text=${facility.name}`}
                alt={facility.name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <h2 className="text-xl font-semibold mb-4 hover:text-blue-600 transition-colors duration-300">{facility.name}</h2>
            <p className="text-gray-600 mb-4">{facility.description}</p>
            <div className="flex flex-col gap-2">
              <p className="text-gray-600">ID: {facility.id}</p>
              <p className="text-gray-600">Contact: {facility.contactInfo}</p>
              <p className="text-gray-600">Type: {facility.type}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500">{facility.location}</span>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => router.push({
                    pathname: '/facility/[facilityId]',
                    query: { facilityId: facility.id }
                  })}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {facilities.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No facilities found.
        </div>
      )}
     
        <div className="flex justify-center mt-8">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<span className="flex items-center">Next <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></span>}
                previousLabel={<span className="flex items-center"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>Prev</span>}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                forcePage={currentPage}
                pageClassName="inline-block"
                pageLinkClassName="px-4 py-2 mx-1 rounded-lg hover:bg-blue-50 text-blue-600"
                previousClassName="inline-block"
                previousLinkClassName="px-4 py-2 mx-1 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center"
                nextClassName="inline-block"
                nextLinkClassName="px-4 py-2 mx-1 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center"
                breakClassName="inline-block"
                breakLinkClassName="px-4 py-2 mx-1 text-blue-600"
                containerClassName="flex items-center justify-center space-x-2 mt-8"
                activeClassName="bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                marginPagesDisplayed={2}
              />        </div>
    </div>
  );
};
export default Facility;