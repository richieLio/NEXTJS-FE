import React, { useState, useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import { AcmeLogo } from "../asset/Logo";
import { ThemeSwitcher } from "../../ThemeSwitcher";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export default function Navibar() {
  const router = useRouter();
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { user, logout } = context;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { name: "Home", href: "/home" },
    { name: "Booking", href: "/booking" },
    { name: "History", href: "/history" },
    { name: "Live Chat", href: "/livechats" },
    { name: "Help", href: "/help" },
    { name: "Log Out", href: "/logout" },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push("/");
    toast.success("Logout success");

  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/home" className="font-bold text-inherit">
            <AcmeLogo />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link href="/home" aria-current="page">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/booking" color="foreground">
            Booking
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/livechats" color="foreground">
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
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {user && user.userId ? (
          <NavbarItem className="hidden md:flex">
            <Button color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden md:flex">
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
