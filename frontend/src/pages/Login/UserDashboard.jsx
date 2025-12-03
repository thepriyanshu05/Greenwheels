import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function UserDashboard() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [bookedRides, setBookedRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllRides, setShowAllRides] = useState(false);
  const [viewRide, setViewRide] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "book-ride", label: "Book a Ride", icon: BookOpen },
    { id: "my-bookings", label: "My Bookings", icon: Car },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  const dashboardStats = [
    {
      title: "Total Rides Booked",
      value: bookedRides.length.toString(),
      change: "+2 this month",
      icon: Car,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Upcoming Rides",
      value: bookedRides.filter((ride) => !ride.completed).length.toString(),
      change: "Awaiting travel",
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed Rides",
      value: bookedRides.filter((ride) => ride.completed).length.toString(),
      change: "Total completed",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Spent",
      value: `₹${bookedRides.reduce(
        (sum, ride) => sum + (ride.contribution || 0),
        0
      )}`,
      change: "Expected spend",
      icon: Wallet,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // ✅ Profile Fetch with Clean Fallback
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

        if (token) {
          const res = await fetch("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setUserProfile({
              name: data.name || storedUser.name || "",
              email: data.email || storedUser.email || "",
              phone: data.phone || storedUser.phone || "",
              gender: data.gender || storedUser.gender || "",
            });
            return;
          }
        }

        // Fallback to stored user if token not found or API fails
        if (storedUser) {
          setUserProfile({
            name: storedUser.name || "",
            email: storedUser.email || "",
            phone: storedUser.phone || "",
            gender: storedUser.gender || "",
          });
        }
      } catch (err) {
        const fallback = JSON.parse(sessionStorage.getItem("user") || "{}");
        setUserProfile({
          name: fallback.name || "",
          email: fallback.email || "",
          phone: fallback.phone || "",
          gender: fallback.gender || "",
        });
      }
    };
    fetchProfile();
  }, []);

  // Mock Booked Rides (replace with API later)
  useEffect(() => {
    const fetchBookedRides = async () => {
      setLoading(true);
      try {
        setBookedRides([
          {
            _id: "1",
            from: "Chandigarh",
            to: "Delhi",
            date: "2024-06-10",
            time: "09:00",
            passengers: 1,
            transport: "Car",
            contribution: 500,
            completed: false,
          },
          {
            _id: "2",
            from: "Delhi",
            to: "Agra",
            date: "2024-05-20",
            time: "14:00",
            passengers: 2,
            transport: "Car",
            contribution: 800,
            completed: true,
          },
        ]);
      } catch {
        setBookedRides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookedRides();
  }, []);

  // Notifications (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("userNotifications");
    if (saved) setNotifications(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const d = new Date();
    d.setHours(hours, minutes);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRideStatus = (ride) =>
    ride.completed
      ? { status: "Completed", color: "bg-green-100 text-green-700" }
      : { status: "Upcoming", color: "bg-yellow-100 text-yellow-700" };

  // Main renderer
  const renderMainContent = () => {
    switch (activeSection) {
      case "notifications":
        return (
          <div className="space-y-6 mt-16">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-slate-800">
                Notifications
              </h1>
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 bg-transparent"
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                  )
                }
              >
                Mark All as Read
              </Button>
            </div>
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {notifications.map((n) => (
                <motion.div key={n.id} variants={fadeInUp}>
                  <Card
                    className={`backdrop-blur-xl border-white/50 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                      n.read ? "bg-white/30" : "bg-white/50 border-blue-200"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              className={`${getBadgeVariant(
                                n.type
                              )} flex items-center gap-1`}
                            >
                              {getBadgeIcon(n.type)}
                              {n.type === "success"
                                ? "Success"
                                : n.type === "alert"
                                ? "Alert"
                                : "Info"}
                            </Badge>
                            {!n.read && (
                              <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                                New
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            {n.title}
                          </h3>
                          <p className="text-slate-600 mb-3">{n.message}</p>
                          <p className="text-sm text-slate-500">
                            {n.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!n.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(n.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Mark as Read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6 mt-16">
            <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
            <Card className="backdrop-blur-xl bg-white/40 border-white/50 rounded-2xl p-8">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-slate-700">Name:</span>{" "}
                    {userProfile.name || "-"}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Email:</span>{" "}
                    {userProfile.email || "-"}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Phone:</span>{" "}
                    {userProfile.phone || "-"}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Gender:</span>{" "}
                    {userProfile.gender || "-"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6 mt-16">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-slate-800">
                User Dashboard
              </h1>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Welcome, {userProfile.name || "User"}
              </Badge>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {dashboardStats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} variants={fadeInUp}>
                    <Card className="backdrop-blur-xl bg-white/40 border-white/50 rounded-2xl overflow-hidden hover:bg-white/50 transition-all duration-300 group hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 ${s.bgColor} rounded-xl flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-slate-700" />
                          </div>
                          <div
                            className={`w-8 h-8 bg-gradient-to-r ${s.color} rounded-lg flex items-center justify-center`}
                          >
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-800">
                            {s.value}
                          </h3>
                          <p className="text-sm font-medium text-slate-700">
                            {s.title}
                          </p>
                          <p className="text-xs text-slate-500">{s.change}</p>
                        </div>
                      </CardContent>
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Greenwheels</h1>
              <p className="text-sm text-slate-600">User Panel</p>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const unread =
                  item.id === "notifications"
                    ? notifications.filter((n) => !n.read).length
                    : 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "text-slate-700 hover:bg-white/50 hover:text-blue-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {unread > 0 && (
                      <Badge className="bg-red-500 text-white text-xs px-2 py-1 ml-auto">
                        {unread}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-white/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
            <span className="font-bold text-slate-800">Greenwheels User</span>
          </div>
        </div>

        <main className="p-6 lg:p-8">{renderMainContent()}</main>
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
