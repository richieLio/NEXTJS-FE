import React, { useEffect, useState, createContext, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

interface User {
  email: string;
  userId: string;
  fullName: string;
  auth: boolean;
}

interface UserContextType {
  user: User;
  loginContext: (email: string, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    email: "",
    userId: "",
    fullName: "",
    auth: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setUser({
        email: decoded.email,
        userId: decoded.userid,
        fullName: decoded.fullname,
        auth: true,
      });
    }
  }, []);

  const loginContext = (email: string, token: string) => {
    const decoded: any = jwtDecode(token);
    setUser({
      email: decoded.email,
      userId: decoded.userid,
      fullName: decoded.fullname,
      auth: true,
    });
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser({
      email: "",
      userId: "",
      fullName: "",
      auth: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
