import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCalendarCheck,
  FaCreditCard,
  FaFutbol,
  FaRunning,
  FaBasketballBall,
  FaVolleyballBall,
  FaMapMarkerAlt,
  FaClock,
  FaPercent,
} from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import Model from "@/components/ui/models-glb";
import Link from "next/link";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <main className="relative flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip ">
      <div className="max-w-7xl w-full">
        {/* Hero Section */}
        <motion.section
          className="flex flex-col md:flex-row items-center justify-between py-10 md:py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="w-full md:w-1/2 mb-8 md:mb-0" variants={itemVariants}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-800">
              Đặt sân thể thao online dễ dàng và nhanh chóng
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Tìm và đặt sân thể thao yêu thích của bạn chỉ với vài cú nhấp chuột.
            </p>
            <motion.button
              className="bg-blue-600 text-white px-8 md:px-10 py-4 rounded-full text-lg md:text-xl hover:bg-blue-700 transition duration-300 flex items-center shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(59, 130, 246)" }}
              whileTap={{ scale: 0.95 }}
            >
           <Link href="/facility" className="flex items-center">
            <FaCalendarCheck className="mr-2" /> Đặt sân ngay
          </Link>          
          </motion.button>        
          </motion.div>
          {!isMobile && (
            <motion.div
              className="w-full md:w-2/3 h-[400px] md:h-[500px]"
              variants={itemVariants}
            >
              <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Model url="/glb/basketball_court.glb" />
                <OrbitControls autoRotate autoRotateSpeed={1} />
              </Canvas>
            </motion.div>
          )}
        </motion.section>

        {/* Tìm Kiếm Nhanh */}
        <motion.section
          className="py-12 bg-white rounded-3xl shadow-lg mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center text-blue-800" variants={itemVariants}>
            Tìm Kiếm Nhanh
          </motion.h2>
          <motion.div className="flex flex-wrap justify-center gap-4" variants={itemVariants}>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FaFutbol className="text-blue-600 mr-2" />
              <select className="bg-transparent outline-none">
                <option>Loại sân</option>
                <option>Sân bóng đá</option>
                <option>Sân bóng rổ</option>
                <option>Sân cầu lông</option>
              </select>
            </div>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FaClock className="text-blue-600 mr-2" />
              <input type="datetime-local" className="bg-transparent outline-none" />
            </div>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />
              <input type="text" placeholder="Địa điểm" className="bg-transparent outline-none" />
            </div>
            <motion.button
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSearch className="inline mr-2" /> Tìm kiếm
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Khuyến Mãi Hiện Tại */}
        <motion.section
          className="py-16 bg-blue-50 rounded-3xl mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center text-blue-800" variants={itemVariants}>
            Khuyến Mãi Hiện Tại
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
            {[
              { title: "Giảm 20% cho đặt sân buổi sáng", desc: "Áp dụng từ 6h-10h hàng ngày" },
              { title: "Ưu đãi cho khách hàng mới", desc: "Giảm 15% cho lần đặt sân đầu tiên" },
              { title: "Combo tiết kiệm", desc: "Đặt 5 buổi liên tiếp, tặng 1 buổi miễn phí" },
            ].map((promo, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md"
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,0,0,0.1)" }}
              >
                <FaPercent className="text-3xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-blue-800">{promo.title}</h3>
                <p className="text-gray-600">{promo.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className="py-16 md:py-24 bg-blue-50 rounded-3xl px-8 md:px-16 shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-800" variants={itemVariants}>
            Cách thức hoạt động
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Tìm kiếm", desc: "Chọn môn thể thao và địa điểm bạn muốn", icon: <FaSearch /> },
              { title: "Đặt sân", desc: "Chọn thời gian và xác nhận đặt sân", icon: <FaCalendarCheck /> },
              { title: "Thanh toán", desc: "Thanh toán an toàn qua nhiều hình thức", icon: <FaCreditCard /> },
              { title: "Chơi ngay", desc: "Đến sân và tận hưởng trận đấu của bạn", icon: <FaFutbol /> },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-3xl"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-blue-800">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Popular Sports */}
        <motion.section
          className="py-16 md:py-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-800" variants={itemVariants}>
            Các môn thể thao phổ biến
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Bóng đá", icon: <FaFutbol /> },
              { name: "Bóng rổ", icon: <FaBasketballBall /> },
              { name: "Bóng chuyền", icon: <FaVolleyballBall /> },
            ].map((sport, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,0,0,0.1)" }}
              >
                <div className="text-5xl mb-4 text-blue-600">{sport.icon}</div>
                <h3 className="text-2xl font-semibold text-blue-800">{sport.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          className="py-16 md:py-24 bg-blue-50 rounded-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-800" variants={itemVariants}>
            Khách hàng nói gì về chúng tôi
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0,0,0,0.1)" }}
              >
                <p className="mb-6 text-gray-700 italic">
                  "Dịch vụ tuyệt vời! Tôi đã dễ dàng tìm và đặt sân cho đội của mình."
                </p>
                <div className="flex items-center">
                  <Image
                    src={`/avatar-${index + 1}.jpg`}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-blue-800">Nguyễn Văn A</p>
                    <p className="text-sm text-gray-600">Khách hàng thường xuyên</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="py-16 md:py-24 bg-blue-600 text-white text-center rounded-3xl mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6" variants={itemVariants}>
            Sẵn sàng để đặt sân?
          </motion.h2>
          <motion.p className="text-xl md:text-2xl mb-8" variants={itemVariants}>
            Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho lần đặt sân đầu tiên!
          </motion.p>
          <motion.button
            className="bg-white text-blue-600 px-8 md:px-10 py-4 rounded-full text-lg md:text-xl hover:bg-blue-100 transition duration-300 flex items-center justify-center mx-auto shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            <FaRunning className="mr-2" /> Đăng ký ngay
          </motion.button>
        </motion.section>
      </div>
    </main>
  );
}