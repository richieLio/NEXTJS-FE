import { useEffect, useState, useContext } from 'react';
import { bookingHistory } from '@/pages/api/booking';
import { UserContext } from "@/components/UserContext";
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";
import { createBooking } from '@/pages/api/booking';
import { sendMoMoPayment } from '@/pages/api/payment'
import { getPaymentStatus } from '@/pages/api/payment';
const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [occupancyRates, setOccupancyRates] = useState({});
  const context = useContext(UserContext);
  const { user } = context;

  const fetchBookingHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await bookingHistory(user.userId, page);
      console.log('Booking history response:', response);
      if (response && response.data) {
        setTotal(response.data.totalRecords);
        setTotalPages(response.data.totalPage);
        setBookings(response.data.listData);
        setCurrentPage(page - 1);
      }
    } catch (error) {
      setError('Error fetching booking history');
      toast.error('Failed to fetch booking history');
      console.error('Error fetching booking history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (timeSlotId: string, fieldId: string) => {
    try {
      const response = await createBooking(timeSlotId, fieldId);
      console.log(response.data)
      if (response.data) {
        const bookingId = response.data.id;
        const amount = 80000;

        const paymentResponse = await sendMoMoPayment(bookingId, amount);
        
        if (paymentResponse.data) {
          const confirmPayment = window.confirm('Bạn có muốn chuyển đến trang thanh toán không?');
          if (confirmPayment) {
            window.open(paymentResponse.data.url, '_blank');
            
            const { orderId, requestId } = paymentResponse.data;
            const checkPaymentInterval = setInterval(async () => {
              const paymentStatus = await getPaymentStatus(orderId, requestId, bookingId, amount);
              console.log('Payment status:', paymentStatus);
              if (paymentStatus.code === 200) {
                clearInterval(checkPaymentInterval);
                alert('Thanh toán thành công!');
                
                setSelectedTimeSlot(null);
              }
            }, 10000);
          }
        } else {
          alert('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error creating booking or processing payment:', error);
      alert('Failed to create booking or process payment');
    }
  };

  useEffect(() => {
    fetchBookingHistory(1);
  }, []);

  const handlePageClick = (event: { selected: number }) => {
    console.log('Selected page:', event.selected + 1);
    fetchBookingHistory(event.selected + 1);
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
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-gray-800 text-center transform hover:scale-105 transition-transform duration-300 border-b pb-4">
        Your Booking History
      </h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div 
            key={booking.id} 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{booking.fullName}</h3>
                    <p className="text-blue-600 font-medium">{booking.fieldName}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium text-gray-800">{booking.startTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="font-medium text-gray-800">{booking.endTime}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBooking(booking.timeSlotId, booking.fieldId)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {bookings.length === 0 && (
        <div className="text-center bg-white rounded-xl shadow-lg p-12 mt-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
          <p className="text-gray-500">You haven't made any bookings yet.</p>
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
        />
      </div>
    </div>
  );
};

export default History;