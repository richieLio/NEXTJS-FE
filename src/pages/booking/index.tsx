import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../components/UserContext";
import { useRouter } from "next/router";



export default function Home() {
  
  const router = useRouter();
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user, loginContext } = context;

  useEffect(() => {
    if (!user || !user.userId) {
      router.push("/login");
    }
  }, [user, router]);
  

  return (
    <div className="relative flex flex-col justify-center items-center">
      helloooooooooooooooooooooo
    </div>
  );
}
