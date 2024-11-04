import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllField } from '@/pages/api/sportfield';
import { getAllTimeSlot } from '@/pages/api/timeslot';
import { getPriceByTimeSlotId } from '@/pages/api/pricing';
import { createBooking } from '@/pages/api/booking';
import { sendMoMoPayment } from '@/pages/api/payment'
import { getPaymentStatus } from '@/pages/api/payment';
import { applyVoucher } from '@/pages/api/voucher';
interface SportField {
  id: string;
  facilityId: string;
  name: string;
  createdAt: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
interface CalculatePriceDTO {
  timeSlotId: string;
  voucherCode: string;
}
const FacilityPage = () => {
  const [fields, setFields] = useState<SportField[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [occupancyRates, setOccupancyRates] = useState<{[key: string]: number}>({});
  const [prices, setPrices] = useState<{[key: string]: number}>({});
  const [voucherCode, setVoucherCode] = useState<string>('');
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { facilityId } = router.query;

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const fetchFields = async () => {
      if (facilityId) {
        try {
          const response = await getAllField(facilityId as string);
          setFields(response.data);
          
          // Fetch occupancy rates for all fields
          response.data.forEach(async (field: SportField) => {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const timeSlotResponse = await getAllTimeSlot(field.id, formattedDate);
            const totalSlots = timeSlotResponse.data.length;
            const bookedSlots = timeSlotResponse.data.filter((slot: TimeSlot) => slot.isAvailable).length;
            const occupancyRate = Math.round((bookedSlots / totalSlots) * 100);
            setOccupancyRates(prev => ({
              ...prev,
              [field.id]: occupancyRate
            }));
          });
        } catch (error) {
          console.error('Error fetching fields:', error);
        }
      }
    };

    fetchFields();
  }, [facilityId, selectedDate]);


  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedField) {
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await getAllTimeSlot(selectedField, formattedDate);
          setTimeSlots(response.data);
          setSelectedTimeSlot(null);
          
          // Fetch prices for all time slots
          response.data.forEach(async (slot) => {
            const priceResponse = await getPriceByTimeSlotId(slot.id);
            setPrices(prev => ({
              ...prev,
              [slot.id]: priceResponse.data.price
            }));
          });
        } catch (error) {
          console.error('Error fetching time slots:', error);
        }
      }
    };

    fetchTimeSlots();
  }, [selectedField]);

  const handleFieldClick = (fieldId: string) => {
    setSelectedField(fieldId);
  };

  const handleTimeSlotClick = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };
  
  const handleBooking = async (timeSlotId: string, fieldId: string) => {
    try {
      const response = await createBooking(timeSlotId, fieldId);
      console.log(response.data)
      if (response.data) {
        // Get booking ID and calculate price with voucher
        const bookingId = response.data.id;
        let amount = prices[timeSlotId];

        // Apply voucher if provided
        if (voucherCode) {
          const calculatePriceDTO: CalculatePriceDTO = {
            timeSlotId: timeSlotId,
            voucherCode: voucherCode
          };
          const voucherResponse = await applyVoucher(calculatePriceDTO);
          if (voucherResponse.data) {
            amount = voucherResponse.data.price;
          }
        }

        // Process MoMo payment
        const paymentResponse = await sendMoMoPayment(bookingId, amount);
        
        if (paymentResponse.data) {
          const confirmPayment = window.confirm('Bạn có muốn chuyển đến trang thanh toán không?');
          if (confirmPayment) {
            window.open(paymentResponse.data.url, '_blank');
            
            // Check payment status every 5 seconds
            const { orderId, requestId } = paymentResponse.data;
            const checkPaymentInterval = setInterval(async () => {
              const paymentStatus = await getPaymentStatus(orderId, requestId, bookingId, amount);
              console.log('Payment status:', paymentStatus);
              if (paymentStatus.code === 200) {
                clearInterval(checkPaymentInterval);
                alert('Thanh toán thành công!');
                
                // Refresh time slots after successful payment
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const timeSlotResponse = await getAllTimeSlot(fieldId, formattedDate);
                setTimeSlots(timeSlotResponse.data);
                setSelectedTimeSlot(null);
                
                // Update occupancy rate
                const totalSlots = timeSlotResponse.data.length;
                const bookedSlots = timeSlotResponse.data.filter(slot => slot.isAvailable).length;
                const occupancyRate = Math.round((bookedSlots / totalSlots) * 100);
                setOccupancyRates(prev => ({
                  ...prev,
                  [fieldId]: occupancyRate
                }));
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
  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="flex gap-12">
        <div className="w-1/2 pr-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Available Fields</h2>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setSelectedDate(newDate);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className={`relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 ${
                  selectedField === field.id ? 'ring-4 ring-blue-500 scale-105' : ''
                }`}
                onClick={() => handleFieldClick(field.id)}
              >
                <div className="p-4 relative h-56 w-full bg-gradient-to-br from-emerald-100 to-sky-100">
                  <div className="absolute inset-0 border-2 border-indigo-600 rounded-xl m-2" style={{
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
                  }}>
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md"></div>
                    
                    <div 
                      className="absolute bottom-0 w-full transition-all duration-1000 ease-in-out"
                      style={{
                        height: `${occupancyRates[field.id]}%`,
                        background: `linear-gradient(135deg, ${
                          occupancyRates[field.id] > 80 ? 'rgba(239, 68, 68, 0.8)' :
                          occupancyRates[field.id] > 50 ? 'rgba(245, 158, 11, 0.8)' : 'rgba(34, 197, 94, 0.8)'
                        }, ${
                          occupancyRates[field.id] > 80 ? 'rgba(239, 68, 68, 0.6)' :
                          occupancyRates[field.id] > 50 ? 'rgba(245, 158, 11, 0.6)' : 'rgba(34, 197, 94, 0.6)'
                        })`,
                        animation: 'waveAnimation 3s infinite ease-in-out',
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                      }}
                    >
                      <style jsx>{`
                        @keyframes waveAnimation {
                          0%, 100% { transform: translateY(0) scale(1); }
                          50% { transform: translateY(-8px) scale(1.02); }
                        }
                      `}</style>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center bg-white/70 px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg">{field.name}</h3>
                    {occupancyRates[field.id] !== undefined && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                        <span className="font-semibold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {occupancyRates[field.id]}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-6 border-l">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Time Slots</h2>
          <div className="space-y-4">
            {selectedField ? (
              timeSlots.map((slot, index) => (
                <div 
                  key={slot.id} 
                  className={`p-5 rounded-xl backdrop-filter backdrop-blur-lg transition-all duration-300 cursor-pointer ${
                    !slot.isAvailable ? 'bg-green-50/90 hover:bg-green-100/90' : 'bg-red-50/90 hover:bg-red-100/90'
                  } ${selectedTimeSlot?.id === slot.id ? 'ring-2 ring-blue-400 scale-102' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleTimeSlotClick(slot)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${!slot.isAvailable ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      <span className="text-lg font-medium">{slot.startTime} - {slot.endTime}</span>
                    </div>
                    {prices[slot.id] && (
                      <span className="text-lg font-bold text-gray-700">${prices[slot.id]}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xl">Please select a field to view available time slots</p>
              </div>
            )}
          </div>
          {selectedField && selectedTimeSlot && (
            <div className="mt-8 bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Booking Summary</h3>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Selected Field</span>
                      <span className="font-semibold">{fields.find(f => f.id === selectedField)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Slot</span>
                      <span className="font-semibold">{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
                    </div>
                    {prices[selectedTimeSlot.id] && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price</span>
                        <span className="font-bold text-xl text-blue-600">${prices[selectedTimeSlot.id]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                        !selectedTimeSlot.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {!selectedTimeSlot.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Enter voucher code"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                {!selectedTimeSlot.isAvailable && (
                  <button 
                    onClick={() => handleBooking(selectedTimeSlot.id, selectedField)}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );};

export default FacilityPage;