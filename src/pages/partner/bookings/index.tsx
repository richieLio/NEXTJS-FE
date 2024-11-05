import { useEffect, useState, useContext } from 'react';
import { bookingManage } from '@/pages/api/booking';
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";
import { getAllFacilityManage } from '@/pages/api/facility';

const BookingManage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState('');

  const fetchFacilities = async () => {
    try {
      const response = await getAllFacilityManage(1);
      console.log('Facilities:', response);
      if (response && response.data) {
        setFacilities(response.data.listData);
        if (response.data.listData.length > 0) {
          setSelectedFacilityId(response.data.listData[0].id);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch facilities');
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchBooking = async (page: number) => {
    try {
      setLoading(true);
      const response = await bookingManage(selectedFacilityId, page);
      console.log('Booking history response:', response);
      if (response && response.data) {
        setTotal(response.data.totalRecords);
        setTotalPages(response.data.totalPage);
        setBookings(response.data.listData);
        setCurrentPage(page - 1);
      }
    } catch (error) {
      toast.error('Failed to fetch booking history');
      console.error('Error fetching booking history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (selectedFacilityId) {
      fetchBooking(1);
    }
  }, [selectedFacilityId]);

  const handlePageClick = (event: { selected: number }) => {
    console.log('Selected page:', event.selected + 1);
    fetchBooking(event.selected + 1);
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacilityId(event.target.value);
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
        Error loading booking history.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <select
          value={selectedFacilityId}
          onChange={handleFacilityChange}
          className="w-full p-2 border rounded-lg"
        >
          {facilities.map((facility: any) => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </select>
      </div>
      {bookings?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No bookings found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">Time</th>
                <th className="px-6 py-3 border-b text-left">Customer Name</th>
                <th className="px-6 py-3 border-b text-left">Field</th>
                <th className="px-6 py-3 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td className="px-6 py-4 border-b">{booking.fullName}</td>
                  <td className="px-6 py-4 border-b">{booking.fieldName}</td>
                  <td className="px-6 py-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      booking.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {bookings?.length > 0 && (
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
          />
        </div>
      )}
    </div>
  );
};
export default BookingManage;