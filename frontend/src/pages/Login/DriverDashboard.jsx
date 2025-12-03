"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Car,
  Bell,
  User,
  LogOut,
  Menu,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Wallet,
  Eye,
  MoreVertical,
  Navigation,
  Calendar,
  Users,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import { driverAPI, ridesAPI } from "@/services/api";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function DriverDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [driverProfile, setDriverProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    carnumber: "",
  });

  const [offeredRides, setOfferedRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRide, setEditRide] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewRide, setViewRide] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAllRides, setShowAllRides] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("driver");
    sessionStorage.removeItem("driver");
    sessionStorage.removeItem("driverId");
    navigate("/");
  };

  // ✅ Sidebar items
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "offer-ride", label: "Offer a Ride", icon: BookOpen },
    { id: "my-rides", label: "My Rides", icon: Car },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  // ✅ Dashboard statistics
  const dashboardStats = [
    {
      title: "Total Rides Offered",
      value: offeredRides.length.toString(),
      change: "+3 this month",
      icon: Car,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Rides",
      value: offeredRides.filter((r) => !r.completed).length.toString(),
      change: "Awaiting completion",
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed Rides",
      value: offeredRides.filter((r) => r.completed).length.toString(),
      change: "Total completed",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Earnings",
      value: `₹${offeredRides.reduce((sum, r) => sum + (r.contribution || 0), 0)}`,
      change: "Expected earnings",
      icon: Wallet,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // ✅ Fetch driver's offered rides (authenticated)
  const fetchOfferedRides = async () => {
    setLoading(true);
    try {
      const res = await ridesAPI.getDriverRides();
      const rides = res.data?.rides || [];
      setOfferedRides(rides);
    } catch (err) {
      console.error("Failed to fetch driver rides:", err);
      setOfferedRides([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete ride
  const deleteRide = async (id) => {
    if (!confirm("Delete this ride?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rides/rides/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOfferedRides((prev) => prev.filter((r) => r._id !== id));
        alert("Ride deleted successfully!");
      }
    } catch {
      alert("Error deleting ride");
    }
  };

  // ✅ Save edited ride
  const saveEditedRide = async () => {
    if (!editRide) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rides/rides/${editRide._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editRide),
      });
      const data = await res.json();
      if (res.ok) {
        setOfferedRides((prev) =>
          prev.map((r) => (r._id === editRide._id ? data.ride : r))
        );
        setShowEditModal(false);
      }
    } catch {
      alert("Error saving ride");
    }
  };

  // ✅ Format date/time helpers
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ✅ Fetch on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await driverAPI.getProfile();
        const data = res.data?.driver || {};

        setDriverProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          carnumber: data.carnumber || "",
        });
      } catch (err) {
        console.error("Failed to fetch driver profile:", err);
        const stored =
          JSON.parse(localStorage.getItem("driver") || "null") || {};

        setDriverProfile({
          name: stored.name || "",
          email: stored.email || "",
          phone: stored.phone || "",
          gender: stored.gender || "",
          carnumber: stored.carnumber || "",
        });
      }
    };

    fetchProfile();
    fetchOfferedRides();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/driver-dashboard/profile")) {
      setActiveSection("profile");
    }
  }, [location.pathname]);

  // ✅ Notifications
  useEffect(() => {
    const saved = localStorage.getItem("driverNotifications");
    if (saved) setNotifications(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("driverNotifications", JSON.stringify(notifications));
  }, [notifications]);

  // ✅ Badge helpers
  const getBadgeVariant = (type) =>
    type === "success"
      ? "bg-green-100 text-green-700 border-green-200"
      : type === "alert"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-blue-100 text-blue-700 border-blue-200";

  const getBadgeIcon = (type) =>
    type === "success" ? (
      <CheckCircle className="w-3 h-3" />
    ) : type === "alert" ? (
      <AlertTriangle className="w-3 h-3" />
    ) : (
      <Info className="w-3 h-3" />
    );

  // ✅ Section renderer
  const renderMain = () => {
    switch (activeSection) {
      case "notifications":
        return (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
              <Button
                variant="outline"
                onClick={() =>
                  setNotifications((p) => p.map((n) => ({ ...n, read: true })))
                }
              >
                Mark All as Read
              </Button>
            </div>
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`p-4 backdrop-blur-xl ${
                  n.read ? "bg-white/30" : "bg-white/50"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <Badge className={`${getBadgeVariant(n.type)} flex gap-1`}>
                      {getBadgeIcon(n.type)}
                      {n.type}
                    </Badge>
                    <h3 className="font-semibold mt-1">{n.title}</h3>
                    <p className="text-sm text-slate-600">{n.message}</p>
                  </div>
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((x) =>
                            x.id === n.id ? { ...x, read: true } : x
                          )
                        )
                      }
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Read
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        );

      case "offer-ride":
        navigate("/driver-dashboard/offer-ride");
        return null;

      case "my-rides":
        return (
          <div className="mt-16 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-800">My Offered Rides</h1>
              <Button onClick={fetchOfferedRides}>Refresh</Button>
            </div>
            {loading ? (
              <p>Loading rides...</p>
            ) : offeredRides.length === 0 ? (
              <p>No rides offered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offeredRides.map((r) => (
                  <Card key={r._id} className="p-4">
                    <CardContent>
                      <div className="flex justify-between">
                        <Badge
                          className={`${
                            r.completed
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.completed ? "Completed" : "Pending"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditRide(r) || setShowEditModal(true)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteRide(r._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-slate-700 font-medium">
                        {r.from} → {r.to}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatDate(r.date)} • {formatTime(r.date)}
                      </p>
                      <Button
                        className="mt-3 w-full"
                        onClick={() => setViewRide(r) || setShowViewModal(true)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "profile":
        return (
          <div className="mt-16 space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
            <Card className="p-6 bg-white/50 backdrop-blur-md">
              <p><b>Name:</b> {driverProfile.name}</p>
              <p><b>Email:</b> {driverProfile.email}</p>
              <p><b>Phone:</b> {driverProfile.phone}</p>
              <p><b>Gender:</b> {driverProfile.gender}</p>
              <p><b>Car Number:</b> {driverProfile.carnumber}</p>
            </Card>
          </div>
        );

      default:
        return (
          <div className="mt-16 space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">
              Welcome, {driverProfile.name || "Driver"}
            </h1>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {dashboardStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={i} variants={fadeInUp}>
                    <Card className="p-6 backdrop-blur-lg bg-white/50 rounded-2xl">
                      <div className="flex justify-between mb-2">
                        <Icon className="text-slate-700 w-6 h-6" />
                        <TrendingUp className="text-blue-500 w-4 h-4" />
                      </div>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-sm">{stat.title}</p>
                      <p className="text-xs text-slate-500">{stat.change}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 p-6 border-b border-white/50">
            <Navigation className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">Greenwheels Driver</h1>
          </div>
          <nav className="flex-1 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (item.id === "dashboard") {
                      navigate("/driver-dashboard");
                    } else if (item.id === "profile") {
                      navigate("/driver-dashboard/profile");
                    } else if (item.id === "offer-ride") {
                      navigate("/driver-dashboard/offer-ride");
                    }
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "text-slate-700 hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-700 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-white/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800">Greenwheels Driver</span>
          </div>
        </div>

        <main className="p-6 lg:p-8">{renderMain()}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
