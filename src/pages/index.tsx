import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCalendarCheck,
  FaCreditCard,
  FaFutbol,
} from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url, true);

  // Tính toán kích thước của mô hình để điều chỉnh tỷ lệ cho phù hợp
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3()).length();
  scene.scale.set(1.5, 1.5, 1.5); // Tăng kích thước mô hình lên 50%

  return (
    <>
      <primitive object={scene} />
      <PerspectiveCamera makeDefault position={[0, 0, size * 1.5]} />
    </>
  );
}

export default function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        {/* Hero Section */}
        <motion.section
          className="flex items-center justify-between py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-1/2">
            <motion.div
              className="flex items-center mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mr-4">
                Đặt sân thể thao online dễ dàng và nhanh chóng
              </h1>
            </motion.div>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Tìm và đặt sân thể thao yêu thích của bạn chỉ với vài cú nhấp
              chuột.
            </motion.p>
            <motion.button
              className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-600 transition duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCalendarCheck className="mr-2" /> Đặt sân ngay
            </motion.button>
          </div>
          <motion.div
            className="w-1/2 h-[400px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Model url="/glb/t-shirt.glb" />
              <OrbitControls />
            </Canvas>
          </motion.div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className="py-16 bg-gray-100 bg-opacity-70 rounded-lg px-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-10">Cách thức hoạt động</h2>
          <div className="flex justify-between items-start">
            {[
              {
                title: "Tìm kiếm",
                desc: "Chọn môn thể thao và địa điểm bạn muốn",
                icon: <FaSearch />,
              },
              {
                title: "Đặt sân",
                desc: "Chọn thời gian và xác nhận đặt sân",
                icon: <FaCalendarCheck />,
              },
              {
                title: "Thanh toán",
                desc: "Thanh toán an toàn qua nhiều hình thức",
                icon: <FaCreditCard />,
              },
              {
                title: "Chơi ngay",
                desc: "Đến sân và tận hưởng trận đấu của bạn",
                icon: <FaFutbol />,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center w-1/4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-all duration-300 hover:bg-blue-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-10">
            Khách hàng nói gì về chúng tôi
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-opacity-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <p className="mb-4">
                  "Dịch vụ tuyệt vời! Tôi đã dễ dàng tìm và đặt sân cho đội của
                  mình."
                </p>
                <div className="flex items-center">
                  <Image
                    src={`/avatar-${index + 1}.jpg`}
                    alt="Avatar"
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">Nguyễn Văn A</p>
                    <p className="text-sm text-gray-600">
                      Khách hàng thường xuyên
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="py-16 bg-blue-500 bg-opacity-90 text-white text-center rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6">Sẵn sàng để đặt sân?</h2>
          <p className="text-xl mb-8">
            Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho lần đặt sân đầu
            tiên!
          </p>
          <motion.button
            className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCalendarCheck className="mr-2" /> Đăng ký ngay
          </motion.button>
        </motion.section>
      </div>
    </main>
  );
}