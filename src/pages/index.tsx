import { Spotlight } from "@/components/ui/Spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center mx-auto overflow-hidden">
      <section className="overflow-hidden w-full md:pt-0 relative min-h-screen">
        {/* Spotlight Effects */}
        <div className="absolute inset-0">
          <Spotlight
            className="-top-40 -left-10 md:-left-32 md:-top-20"
            fill="blue"
          />
          <Spotlight
            className="top-10 left-full md:left-3/4 h-[80vh] w-[50vw]"
            fill="red"
          />
          <Spotlight
            className="top-28 left-80 h-[80vh] w-[50vw]"
            fill="white"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full min-h-screen px-4">
          <div className="flex flex-col items-center justify-center w-full max-w-[89vw] md:max-w-2xl lg:max-w-[60vw]">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-xs uppercase tracking-wider max-w-80 mb-4"
            >
              Chào mừng đến với dịch vụ đặt sân thể thao trực tuyến
            </motion.h2>
            <TextGenerateEffect
              className="text-center text-[28px] sm:text-[32px] md:text-5xl lg:text-6xl mb-6"
              words="Trải nghiệm đặt sân thể thao tốt nhất trực tuyến"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-center text-sm md:text-lg lg:text-2xl md:tracking-wider"
            >
              Chúng tôi cung cấp dịch vụ đặt sân dễ dàng và thuận tiện cho nhiều
              môn thể thao khác nhau
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="#booking">
                <button className="px-6 py-3 sm:px-8 sm:py-4 text-white bg-gradient-to-r from-blue-600 via-red-500 to-white rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 uppercase tracking-wide border-2 border-opacity-50 border-white backdrop-filter backdrop-blur-sm relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2">⚽</span>
                    Đặt sân ngay
                    <span className="ml-2">🏀</span>
                  </span>
                </button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
     
      <section className="w-full ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-4">Đa dạng sân</h3>
              <p>
                Chúng tôi cung cấp nhiều loại sân cho các môn thể thao khác
                nhau.
              </p>
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-4">Đặt sân dễ dàng</h3>
              <p>
                Giao diện thân thiện, dễ sử dụng giúp bạn đặt sân nhanh chóng.
              </p>
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-4">Hỗ trợ 24/7</h3>
              <p>Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc mọi nơi.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-12 shadow-text">
            Khách hàng nói gì về SSB
          </h2>
          <div className="flex flex-col space-y-8">
            <motion.div
              className="bg-white bg-opacity-90 p-4 md:p-8 shadow-xl flex flex-col md:flex-row items-start w-full md:w-2/3 ml-0 rounded-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-20"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="asset/avatar.png"
                alt="Avatar"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full mb-4 md:mb-0 md:mr-6 flex-shrink-0 border-4 border-blue-500 shadow-lg"
              />
              <div>
                <div className="mb-4">
                  <h4 className="font-bold text-xl md:text-2xl text-blue-600">
                    Lionel Messi
                  </h4>
                  <p className="text-gray-600 italic">
                    Cầu thủ bóng đá chuyên nghiệp
                  </p>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  "SSB đã thực sự thay đổi cách tôi tìm và đặt sân bóng đá. Giao
                  diện trực quan và dễ sử dụng giúp tôi tiết kiệm rất nhiều thời
                  gian. Tôi đặc biệt ấn tượng với tính năng tìm kiếm nâng cao,
                  cho phép tôi lọc sân theo vị trí, giá cả và tiện ích. Hơn nữa,
                  hệ thống đánh giá và nhận xét từ người dùng khác giúp tôi luôn
                  chọn được sân chất lượng nhất. SSB thực sự là một công cụ
                  tuyệt vời cho bất kỳ ai đam mê thể thao!"
                </p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white bg-opacity-90 p-4 md:p-8 shadow-xl flex flex-col-reverse md:flex-row items-start w-full md:w-2/3 ml-auto rounded-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-left md:text-right md:mr-6 mt-4 md:mt-0">
                <div className="mb-4">
                  <h4 className="font-semibold text-xl md:text-2xl text-purple-600">
                    Trần Thị B
                  </h4>
                  <p className="text-gray-600 italic">
                    Huấn luyện viên tennis chuyên nghiệp
                  </p>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  "Là một huấn luyện viên tennis, việc tìm được sân phù hợp cho
                  các buổi tập là vô cùng quan trọng. SSB không chỉ giúp tôi dễ
                  dàng đặt sân mà còn cung cấp thông tin chi tiết về chất lượng
                  mặt sân, ánh sáng và các tiện ích đi kèm. Tôi đặc biệt yêu
                  thích tính năng lặp lại đặt sân, giúp tôi dễ dàng lên lịch cho
                  các khóa học dài hạn. Hỗ trợ khách hàng của SSB cũng rất tuyệt
                  vời, luôn sẵn sàng giải đáp mọi thắc mắc của tôi. SSB thực sự
                  đã nâng cao trải nghiệm đặt sân của tôi!"
                </p>
              </div>
              <img
                src="asset/avatar.png"
                alt="Avatar"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full mb-4 md:mb-0 flex-shrink-0 border-4 border-purple-500 shadow-lg"
              />
            </motion.div>
            <motion.div
              className="bg-white bg-opacity-90 p-4 md:p-8 shadow-xl flex flex-col md:flex-row items-start w-full md:w-2/3 ml-0 rounded-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img
                src="asset/avatar.png"
                alt="Avatar"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full mb-4 md:mb-0 md:mr-6 flex-shrink-0 border-4 border-indigo-500 shadow-lg"
              />
              <div>
                <div className="mb-4">
                  <h4 className="font-semibold text-xl md:text-2xl text-indigo-600">
                    Lê Văn C
                  </h4>
                  <p className="text-gray-600 italic">
                    Người chơi bóng rổ nghiệp dư
                  </p>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  "Là một người đam mê bóng rổ nhưng lại bận rộn với công việc,
                  SSB thực sự là một giải pháp tuyệt vời cho tôi. Giao diện thân
                  thiện và trực quan giúp tôi dễ dàng tìm và đặt sân chỉ trong
                  vài phút. Tôi đặc biệt thích tính năng đặt sân nhanh, cho phép
                  tôi nhanh chóng tìm sân trống gần nhất khi có thời gian rảnh
                  đột xuất. Ngoài ra, tính năng tạo và quản lý nhóm chơi cũng
                  rất hữu ích, giúp tôi dễ dàng tổ chức các trận đấu với bạn bè.
                  SSB không chỉ là một ứng dụng đặt sân, mà còn là một công cụ
                  tuyệt vời để kết nối cộng đồng những người yêu thể thao."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
