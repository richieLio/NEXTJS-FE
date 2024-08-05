//province/index.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Select, Input, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useRouter } from 'next/router';

// Define types for the province data
interface Province {
  Id: string;
  Name: string;
}

const Provinces: React.FC = () => {
  const router = useRouter();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [name, setName] = useState<string>(localStorage.getItem('userName') || '');

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
      .then((response) => response.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    console.log(selectedProvince); // Log selectedProvince whenever it changes
  }, [selectedProvince]);

  const removeAccents = (str: string): string => {
    let normalizedStr = str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, "")
      .toLowerCase();

    // Check if the string starts with "tinh" or "thanhpho" and remove the prefix if present
    if (normalizedStr.startsWith("tinh")) {
      normalizedStr = normalizedStr.slice(4);
    } else if (normalizedStr.startsWith("thanhpho")) {
      normalizedStr = normalizedStr.slice(8);
    }

    return normalizedStr;
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    setName(newName);
    localStorage.setItem('userName', newName);
  };

  const handleStartChat = (): void => {
    router.push(`/livechat/chat/${removeAccents(selectedProvince)}`);
  };

  return (
    <div className="relative flex flex-col justify-center items-center">
      <section className="unique-section max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center space-y-5 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl font-light tracking-tighter mx-auto md:text-6xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text">
            Chat with everyone by{" "}
            <span className="bg-gradient-to-t from-light to-foreground text-transparent bg-clip-text">
              Sport Booking Service chat
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/80">
            Choose your province for chatting with people near you
          </p>
          <div>
            <Select
              placeholder="Chọn tỉnh thành"
              style={{ width: "300px", marginBottom: "20px" }}
              value={selectedProvince}
              onChange={(event) => setSelectedProvince(event.target.value)}
            >
              {provinces.map((province) => (
                <SelectItem key={province.Name} value={province.Id}>
                  {province.Name}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="text"
              placeholder="Nhập tên người dùng"
              style={{ width: "300px" }}
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                color="primary"
                variant="solid"
                onClick={handleStartChat}
              >
                Chat Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Provinces;
