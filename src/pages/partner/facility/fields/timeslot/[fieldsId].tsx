import { toast } from "react-toastify";
import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import { getAllTimeSlotManage, getPricingForTimeslot, createTimeslot, updateTimeslot } from "@/pages/api/timeslot";
import { createPricing, updatePricing } from '@/pages/api/pricing';

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

const TimeSlots = () => {
  const [timeslots, setTimeslots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTimeslot, setSelectedTimeslot] = useState<any>(null);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [prices, setPrices] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' });
  
  const router = useRouter();
  const fieldId = router.query.fieldsId as string;

  const [createForm, setCreateForm] = useState<CreateForm>({ fieldId, dayOfWeek: '', startTime: '', endTime: '' });
  const [updateForm, setUpdateForm] = useState<UpdateForm | null>(null);

  const handleCreateTimeslot = async () => {
    try {
      const response = await createTimeslot(createForm);
      if (response && response.data) {
        toast.success("Timeslot created successfully");
        getTimeslots();
        handleCloseCreateModal();
      }
    } catch (error) {
      toast.error("Failed to create timeslot");
    }
  };

  const handleUpdateTimeslot = async () => {
    if (updateForm) {
      try {
        const response = await updateTimeslot(updateForm);
        if (response && response.data) {
          toast.success("Timeslot updated successfully");
          getTimeslots();
          handleCloseUpdateModal();
        }
      } catch (error) {
        toast.error("Failed to update timeslot");
      }
    }
  };

  const getTimeslots = async () => {
    try {
      setLoading(true);
      const res = await getAllTimeSlotManage(fieldId);
      if (res && res.data) {
        setTimeslots(res.data);
      }
    } catch (err) {
      setError('Failed to fetch timeslots');
      toast.error('Failed to fetch timeslots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fieldId) {
      getTimeslots();
    }
  }, [fieldId]);

  const handleOpenCreateModal = () => {
    setCreateForm({ fieldId, dayOfWeek: '', startTime: '', endTime: '' });
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenUpdateModal = (timeslot: any) => {
    setUpdateForm({ id: timeslot.id, startTime: timeslot.startTime, endTime: timeslot.endTime });
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateForm(null);
  };

  const handleOpenPriceModal = async (timeslot: any) => {
    setSelectedTimeslot(timeslot);
    try {
      const res = await getPricingForTimeslot(timeslot.id);
      if (res && res.data) {
        setPricingData(res.data);
        const priceObj = res.data.reduce((acc: any, curr: any) => {
          acc[curr.dayOfWeek] = curr.price;
          return acc;
        }, { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' });
        setPrices(priceObj);
      } 
    } catch (error) {
      toast.error("Failed to fetch pricing data");
    }
    setIsPriceModalOpen(true);
  };

  const handleClosePriceModal = () => {
    setIsPriceModalOpen(false);
    setPricingData([]);
    setPrices({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' });
  };

  const handlePriceChange = (day: string, value: string) => {
    setPrices(prev => ({
      ...prev,
      [day]: value
    }));
  };

  const handleSavePrices = async () => {
    try {
      const updates: Promise<any>[] = [];
      Object.entries(prices).forEach(([day, price]) => {
        if (price === '') return;
        const existingPrice = pricingData.find(p => p.dayOfWeek === day);
        if (existingPrice) {
          const updateDTO = { id: existingPrice.id, dayOfWeek: day, price: Number(price) };
          updates.push(updatePricing(updateDTO));
        } else {
          const createDTO = { dayOfWeek: day, price: Number(price), timeSlotId: selectedTimeslot.id };
          updates.push(createPricing(createDTO));
        }
      });
      await Promise.all(updates);
      toast.success("Prices updated successfully");
      handleClosePriceModal();
    } catch (error) {
      toast.error("Failed to update prices");
    }
  };
const [selectedDay, setSelectedDay] = useState<string>('1');

  const daysOfWeek = [
    { day: '2', label: 'Monday' },
    { day: '3', label: 'Tuesday' }, 
    { day: '4', label: 'Wednesday'},
    { day: '5', label: 'Thursday' },
    { day: '6', label: 'Friday' },
    { day: '7', label: 'Saturday' },
    { day: '1', label: 'Sunday' }
  ];

  const filteredTimeslots = useMemo(() => {
    return timeslots.filter(timeslot => timeslot.dayOfWeek === selectedDay);
  }, [timeslots, selectedDay]);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setCreateForm(prevForm => ({ ...prevForm, dayOfWeek: day }));
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={handleOpenCreateModal}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md mb-4"
      >
        Add Timeslot
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Timeslots</h1>
        
        <div className="flex space-x-2 mb-6">
          {daysOfWeek.map(({ day, label }) => (
            <button
              key={day}
              onClick={() => handleDaySelect(day)}
              className={`px-4 py-2 rounded-md ${
                selectedDay === day
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTimeslots.map((timeslot, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timeslot.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timeslot.endTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${timeslot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {timeslot.isAvailable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => handleOpenUpdateModal(timeslot)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleOpenPriceModal(timeslot)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                      View Prices
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Timeslot Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Create Timeslot</h2>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Day of Week</label>
                <select
                value={createForm.dayOfWeek}
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setCreateForm(prevForm => ({ ...prevForm, dayOfWeek: e.target.value }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {daysOfWeek.map(({ day, label }) => (
                  <option key={day} value={day}>
                    {label}
                  </option>
                ))}
              </select>

              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={createForm.startTime}
                  onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={createForm.endTime}
                  onChange={(e) => setCreateForm({ ...createForm, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleCreateTimeslot} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                  Create
                </button>
                <button onClick={handleCloseCreateModal} className="ml-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Timeslot Modal */}
      {isUpdateModalOpen && updateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Update Timeslot</h2>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={updateForm.startTime}
                  onChange={(e) => setUpdateForm({ ...updateForm, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={updateForm.endTime}
                  onChange={(e) => setUpdateForm({ ...updateForm, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleUpdateTimeslot} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                  Update
                </button>
                <button onClick={handleCloseUpdateModal} className="ml-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Modal */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Pricing for {selectedTimeslot?.startTime} - {selectedTimeslot?.endTime}</h2>
              <div className="mt-4">
                {['1', '2', '3', '4', '5', '6', '7'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between mt-2">
                    <label className="text-sm font-medium text-gray-700">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]}</label>
                    <input
                      type="number"
                      value={prices[day]}
                      onChange={(e) => handlePriceChange(day, e.target.value)}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleSavePrices} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                  Save Prices
                </button>
                <button onClick={handleClosePriceModal} className="ml-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;
