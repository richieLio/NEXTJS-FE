import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllField } from '@/pages/api/sportfield';
import { getAllTimeSlot } from '@/pages/api/timeslot';
import { getPriceByTimeSlotId } from '@/pages/api/pricing';
import { createBooking } from '@/pages/api/booking';
import { sendMoMoPayment } from '@/pages/api/payment'
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

const FacilityPage = () => {
  const [fields, setFields] = useState<SportField[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [occupancyRates, setOccupancyRates] = useState<{[key: string]: number}>({});
  const [prices, setPrices] = useState<{[key: string]: number}>({});
  const router = useRouter();
  const { facilityId } = router.query;

  useEffect(() => {
    const fetchFields = async () => {
      if (facilityId) {
        try {
          const response = await getAllField(facilityId as string);
          setFields(response.data);
          
          // Fetch occupancy rates for all fields
          response.data.forEach(async (field) => {
            const timeSlotResponse = await getAllTimeSlot(field.id);
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
  }, [facilityId]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedField) {
        try {
          const response = await getAllTimeSlot(selectedField);
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
        // Get booking ID and price from response
        const bookingId = response.data.id;
        const amount = prices[timeSlotId];

        // Process MoMo payment
        const paymentResponse = await sendMoMoPayment(bookingId, amount);
        
        if (paymentResponse.data) {
          const confirmPayment = window.confirm('Bạn có muốn chuyển đến trang thanh toán không?');
          if (confirmPayment) {
            window.open(paymentResponse.data.url, '_blank');
          }
          // Refresh time slots after successful booking
          const timeSlotResponse = await getAllTimeSlot(fieldId);
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
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex gap-12">
        <div className="w-1/2 pr-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Available Fields</h2>
          <div className="grid gap-6">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-500 ${
                  selectedField === field.id ? 'ring-4 ring-blue-400 scale-105' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: `linear-gradient(135deg, ${
                    occupancyRates[field.id] > 80 ? '#ef4444' :
                    occupancyRates[field.id] > 50 ? '#f59e0b' :
                    occupancyRates[field.id] >= 0 ? '#22c55e' : '#ffffff'
                  }22, white)`
                }}
                onClick={() => handleFieldClick(field.id)}
              >
                <div className="p-6 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{field.name}</h3>
                  {occupancyRates[field.id] !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Occupancy</span>
                        <span className="font-semibold">{occupancyRates[field.id]}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            occupancyRates[field.id] > 80 ? 'bg-red-500' :
                            occupancyRates[field.id] > 50 ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${occupancyRates[field.id]}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
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