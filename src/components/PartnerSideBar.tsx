import React, { useState, useEffect, useContext } from "react";
import { AcmeLogo } from "../asset/Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import { userProfile } from "@/pages/api/user";

export default function PartnerSidebar() {
  const [avt, setAvt] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const context = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userProfile();
        if (response.data?.status === 200) {
          setAvt(response.data.avatarUrl);
        } else {
          toast.error("Failed to fetch user profile");
        }
      } catch (error) {
        toast.error("An error occurred during fetch user profile");
      }
    };
    fetchUserProfile();
  }, []);

  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { user, logout } = context;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push("/");
    toast.success("Logout success");
  };

  const menuItems = [
    { name: "Dashboard", href: "/partner" },
    { name: "Voucher Management", href: "/partner/vouchers" },
    { name: "Booking Management", href: "/partner/bookings" },
    { name: "Facility Management", href: "/partner/facility" },
  ];

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/partner/dashboard" className="flex items-center">
          <AcmeLogo />
          <span className="ml-2 font-bold">Partner Portal</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`block w-full p-3 mb-2 rounded-lg transition-colors ${
              router.pathname === item.href
                ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative group">
            <img
              src={avt || "https://images.unsplash.com/broken"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold">Signed in as</p>
                  <p className="text-sm truncate">{user.email}</p>
                </div>
                <Link href="/partner/profile" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Partner Profile
                </Link>
                <Link href="/partner/settings" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Settings
                </Link>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Help & Support
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}