import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem("monthrob_admin_auth");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem("monthrob_admin_auth", JSON.stringify(adminUser));
    } else {
      localStorage.removeItem("monthrob_admin_auth");
    }
  }, [adminUser]);

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    setAdminUser(null);
  };

  if (!adminUser) {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </GoogleOAuthProvider>
    );
  }

  return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
}
