import { useEffect, useState } from 'react';

import {getAllVoucher, createVoucher,updateVoucher, deleteVoucher } from "@/pages/api/voucher";
import { getAllFacilityManage } from '@/pages/api/facility';
import { UserContext } from "@/components/UserContext";
import React, { useContext } from "react";

interface VoucherType {
  id: string;
  code: string;
  discountAmount: number;
  discountType: string;
  expiryAt: string;
  isSystem: number;
  fieldId: string;
  minimumOrderAmount: number;
  maxDiscountAmount: number;
}
interface VoucherReqDTO {
  code: string;
  discountAmount: number;
  discountType: string;
  expiryAt: string;
  isSystem: number;
  fieldId: string;
  minimumOrderAmount: number;
  maxDiscountAmount: number;
}

interface FacilityType {
  id: string;
  name: string;
}

const VoucherPage = () => {
  const context = useContext(UserContext);
  const user = context;
  const [vouchers, setVouchers] = useState<VoucherType[]>([]);
  const [facilities, setFacilities] = useState<FacilityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherType | null>(null);
  
  const [newVoucher, setNewVoucher] = useState<VoucherReqDTO>({
    code: '',
    discountAmount: 0,
    discountType: 'F',
    expiryAt: '',
    isSystem: 0,
    fieldId: '',
    minimumOrderAmount: 0,
    maxDiscountAmount: 0
  });

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await getAllVoucher();
      console.log(user?.user.userId)
      setVouchers(response.data);
    } catch (error) {
      console.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await getAllFacilityManage(1, user?.user.userId);
      setFacilities(response.data.listData);
    } catch (error) {
      console.error('Không thể tải danh sách facility');
    }
  };

  const handleCreateVoucher = async () => {
    try {
      await createVoucher(newVoucher);
      setIsModalOpen(false);
      fetchVouchers();
      setNewVoucher({
        code: '',
        discountAmount: 0,
        discountType: 'F',
        expiryAt: '',
        isSystem: 0,
        fieldId: '',
        minimumOrderAmount: 0,
        maxDiscountAmount: 0
      });
    } catch (error) {
      console.error('Không thể tạo voucher');
    }
  };

  const handleUpdateVoucher = async (id: string, voucherData: VoucherReqDTO) => {
    try {
      await updateVoucher(id, voucherData);
      fetchVouchers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Không thể cập nhật voucher');
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    try {
      await deleteVoucher(id);
      
      fetchVouchers();
    } catch (error) {
      console.error('Không thể xóa voucher');
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchFacilities();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Thêm voucher mới
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Tạo Voucher Mới</h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Mã voucher</label>
                <input
                  type="text"
                  value={newVoucher.code}
                  onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value})}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Số tiền giảm</label>
                <input
                  type="number"
                  value={newVoucher.discountAmount}
                  onChange={(e) => setNewVoucher({...newVoucher, discountAmount: Number(e.target.value)})}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                <select
                  value={newVoucher.discountType}
                  onChange={(e) => setNewVoucher({...newVoucher, discountType: e.target.value})}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="F">Fixed</option>
                  <option value="P">Percentage</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Facility</label>
                <select
                  value={newVoucher.fieldId}
                  onChange={(e) => setNewVoucher({...newVoucher, fieldId: e.target.value})}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                <input
                  type="datetime-local"
                  value={newVoucher.expiryAt}
                  onChange={(e) => setNewVoucher({...newVoucher, expiryAt: e.target.value})}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu</label>
                <input
                  type="number"
                  value={newVoucher.minimumOrderAmount}
                  onChange={(e) => setNewVoucher({...newVoucher, minimumOrderAmount: Number(e.target.value)})}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Giảm tối đa</label>
                <input
                  type="number"
                  value={newVoucher.maxDiscountAmount}
                  onChange={(e) => setNewVoucher({...newVoucher, maxDiscountAmount: Number(e.target.value)})}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                  Hủy
                </button>
                <button onClick={handleCreateVoucher} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Cập Nhật Voucher
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Mã voucher</label>
                <input
                  type="text"
                  value={selectedVoucher.code}
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, code: e.target.value} as VoucherType)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Số tiền giảm</label>
                <input
                  type="number"
                  value={selectedVoucher.discountAmount}
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, discountAmount: Number(e.target.value)} as VoucherType)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                <select
                  value={selectedVoucher.discountType}
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, discountType: e.target.value} as VoucherType)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="F">Fixed</option>
                  <option value="P">Percentage</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Facility</label>
                <select
                  value={selectedVoucher.fieldId}
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, fieldId: e.target.value} as VoucherType)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                <input
                  type="datetime-local"
                  value={selectedVoucher.expiryAt}
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, expiryAt: e.target.value} as VoucherType)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu</label>
                <input
                  type="number"
                  value={selectedVoucher.minimumOrderAmount}
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, minimumOrderAmount: Number(e.target.value)} as VoucherType)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Giảm tối đa</label>
                <input
                  type="number"
                  value={selectedVoucher.maxDiscountAmount}
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, maxDiscountAmount: Number(e.target.value)} as VoucherType)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Hủy
                </button>
                <button 
                  onClick={() => selectedVoucher && handleUpdateVoucher(selectedVoucher.id, selectedVoucher)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã voucher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại giảm giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hết hạn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn tối thiểu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm tối đa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voucher.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.discountAmount.toLocaleString()}đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voucher.discountType === 'F' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Fixed</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Percentage</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(voucher.expiryAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.minimumOrderAmount.toLocaleString()}đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.maxDiscountAmount.toLocaleString()}đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDeleteVoucher(voucher.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>  );
};

export default VoucherPage;