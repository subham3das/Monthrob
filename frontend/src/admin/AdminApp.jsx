import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("monthrob_admin_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.token && !isTokenExpired(parsed.token) && parsed.role === "admin") {
          setAdminUser(parsed);
        } else {
          localStorage.removeItem("monthrob_admin_auth");
        }
      } catch {
        localStorage.removeItem("monthrob_admin_auth");
      }
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem("monthrob_admin_auth", JSON.stringify(adminUser));
    } else if (checked) {
      localStorage.removeItem("monthrob_admin_auth");
    }
  }, [adminUser, checked]);

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    setAdminUser(null);
  };

  if (!checked) return null;

  if (!adminUser) {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy-client-id"}>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </GoogleOAuthProvider>
    );
  }

  return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
}
