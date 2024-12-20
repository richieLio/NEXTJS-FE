import React, { useState, useEffect, useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { AcmeLogo } from "../asset/Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import { userProfile } from "@/pages/api/user";

export default function Navibar() {
  const [avt, setAvt] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const context = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userProfile();
        if (response.code === 200) {
          setAvt(response.data.avatarUrl);
        } else {
         // toast.error("Failed to fetch user profile");
        }
      } catch (error) {
        toast.error("An error occurred during fetch user profile");
      }
    };
    fetchUserProfile();
  }, []); // Empty dependency array to run effect only once

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
    { name: "Home", href: "/home" },
    { name: "Booking", href: "/booking" },
    { name: "Live Chat", href: "/livechat" },
    { name: "History", href: "/history" },
    { name: "Help", href: "/help" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            <AcmeLogo />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link href="/" aria-current="page">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/booking" color="foreground">
            Booking
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/livechat" color="foreground">
            Live Chat
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/history">
            History
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/help">
            Help
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {user && user.userId ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ThemeSwitcher />
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  size="sm"
                  showFallback
                  src={avt || "https://images.unsplash.com/broken"}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <Link href="/profile" className="font-semibold">
                    {user.email}
                  </Link>
                </DropdownItem>
                <DropdownItem as={Link} href="/profile">
                  Profile
                </DropdownItem>
                <DropdownItem as={Link} href="/history">Booking History</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          <>
            <ThemeSwitcher />
            <NavbarItem>
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={
                index === 0
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
