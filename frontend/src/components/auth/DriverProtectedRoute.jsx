import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

/**
 * ✅ Protects driver-only routes.
 * Checks for:
 * - JWT token presence
 * - Role === "driver"
 * Redirects to /driver-login if unauthorized.
 */
export default function DriverProtectedRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    toast.error("Please log in as a driver to access this page.");
    return <Navigate to="/driver-login" replace />;
  }

  // Logged in but not a driver
  if (role !== "driver") {
    toast.error("Access denied. Driver access only.");
    return <Navigate to="/role-selection" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
}
