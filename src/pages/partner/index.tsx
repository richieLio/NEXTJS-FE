import React from "react";
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from "@/components/UserContext";
import { getPartnerRevenue } from "@/pages/api/dashboard";
import Breadcrumb from "@/components/Breadcrumb";
import { Line } from 'react-chartjs-2';
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const PartnerPitchManagement = () => {
  const router = useRouter();
  const context = useContext(UserContext);
  const user = context?.user;
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] });
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());

  // useEffect(() => {
  //   if (user?.role !== 'PARTNER') {
  //     router.push('/');
  //   }
  // }, [router, user]);


  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await getPartnerRevenue(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        if (response.data) {
          setRevenueData(response.data);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, [startDate, endDate]);

  const chartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Partner Revenue Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 p-8 animate-fadeIn">
      <Breadcrumb />
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 backdrop-blur-sm bg-opacity-95">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4 animate-slideDown">Revenue Overview</h2>
          <div className="mb-6 flex flex-wrap gap-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="border rounded-lg p-3 shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                min={startDate.toISOString().split('T')[0]}
                className="border rounded-lg p-3 shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
          <div className="h-[500px] p-4 bg-white rounded-xl shadow-inner animate-fadeIn transition-all duration-500 hover:shadow-lg">
            <Line options={{
              ...options,
              animation: {
                duration: 3000,
                easing: 'easeInOutSine'
              },
              transitions: {
                active: {
                  animation: {
                    duration: 2000
                  }
                }
              },
              plugins: {
                ...options.plugins,
                animation: {
                  onProgress: function(animation) {
                    const currentStep = animation.currentStep
                    const yOffset = Math.sin(currentStep / 10) * 5
                    animation.chart.data.datasets.forEach(dataset => {
                      dataset.data = dataset.data.map((value, index) => 
                        value + yOffset
                      )
                    })
                  }
                }
              }
            }} data={chartData} />
          </div>
        </div>
      </main>
    </div>
    
  );};

export default PartnerPitchManagement;