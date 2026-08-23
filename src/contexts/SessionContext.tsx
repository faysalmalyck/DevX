"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  phone?: string | null;
  designation?: string | null;
  department?: string | null;
  bio?: string | null;
  role: string;
  userType: "admin" | "user";
  permissions?: string[];
  isCeo?: boolean;
  language?: string;
  timezone?: string;
}

interface SessionContextType {
  user: SessionUser | null;
  isAdmin: boolean;
  isUser: boolean;
  isLoading: boolean;
  login: (params: any) => Promise<any>;
  signup: (params: any) => Promise<any>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    fetchProfile();

    // Set up a listener for custom event (useful to trigger fetches from outside)
    const handleAuthChange = () => {
      fetchProfile();
    };
    window.addEventListener("DevX-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("DevX-auth-change", handleAuthChange);
    };
  }, []);

  const login = async ({ email, password, role, portal, rememberMe, returnTo }: any) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, portal, rememberMe, returnTo }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
    await fetchProfile();
    return data;
  };

  const signup = async ({ fullName, email, password }: any) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Signup failed");
    }
    await fetchProfile();
    return data;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to call logout API:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const refresh = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        await fetchProfile();
        return true;
      }
    } catch (error) {
      console.error("Failed to rotate token:", error);
    }
    return false;
  };

  const isAdmin = user?.userType === "admin";
  const isUser = user?.userType === "user";

  return (
    <SessionContext.Provider
      value={{
        user,
        isAdmin,
        isUser,
        isLoading,
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
