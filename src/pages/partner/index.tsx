import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from "@/components/UserContext";

const PartnerPitchManagement = () => {
  const router = useRouter();
  const context = useContext(UserContext);
  const { user } = context;


  useEffect(() => {
    if (user.role !== 'PARTNER') {
      router.push('/');
    }
  }, [router]);

  const columns = [
    {
      title: 'Tên sân',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Giá/giờ',
      dataIndex: 'pricePerHour',
      key: 'pricePerHour',
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      
    },
  ];

  return (
    <p>day la trang cua partner</p>
  );
};

export default PartnerPitchManagement;
