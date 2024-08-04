import React, { useState, useContext } from "react";
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

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push("/");
    toast.success("Logout success");
  };

  return (
    <Navbar>
      <NavbarContent>
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
        {user && user.userId ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ThemeSwitcher />
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <Link href="/profile" className="font-semibold">{user.email}</Link>
                </DropdownItem>
                <DropdownItem as={Link} href="/profile">Profile</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
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
    </Navbar>
  );
}
