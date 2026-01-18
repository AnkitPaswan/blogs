import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import AdminManagePosts from "./AdminManagePosts";
import ManageCategories from "./AdminManageCategories";
import { postsAPI } from "../../services/api";
import { FileText, Eye, MessageCircle, TrendingUp, Users, Activity, Menu } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchDashboardStats();
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await postsAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  // Calculate category data for pie chart from dashboardStats
  const categoryData = dashboardStats?.categories?.map(cat => ({
    name: cat.name,
    value: cat.totalPosts
  })) || [];

  // Calculate engagement data from dashboardStats categories
  const engagementData = dashboardStats?.categories?.map(cat => ({
    category: cat.name,
    views: cat.totalViews,
    commentCount: cat.totalComments
  })).sort((a, b) => (b.views + b.commentCount) - (a.views + a.commentCount)) || [];

  // Calculate average engagement from dashboardStats
  const avgEngagement = dashboardStats?.categories?.length > 0
    ? Math.round(
        dashboardStats.categories.reduce((sum, cat) => 
          sum + cat.totalViews + cat.totalComments, 0
        ) / dashboardStats.categories.length
      )
    : 0;

  // Create views trend data from category stats (aggregate by name as proxy)
  const viewsTrendData = dashboardStats?.categories?.map(cat => ({
    date: cat.name,
    views: cat.totalViews,
    commentCount: cat.totalComments
  })) || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-y-auto" style={{ height: '100vh' }}>
        {/* Mobile Header with Menu Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <span className="font-bold text-gray-900">Admin Panel</span>
          <div className="w-10" />
        </div>

        <div className="p-6">
          {active === "Dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your blog.</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Activity className="w-4 h-4" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Posts</p>
                      <p className="text-white text-3xl font-bold mt-2">{dashboardStats?.totalPosts || 0}</p>
                    </div>
                    <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-blue-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Active content</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Views</p>
                      <p className="text-white text-3xl font-bold mt-2">{dashboardStats?.totalViews?.toLocaleString() || '-'}</p>
                    </div>
                    <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-purple-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Total reach</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Comments</p>
                      <p className="text-white text-3xl font-bold mt-2">{dashboardStats?.totalComments || 0}</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Discussion growth</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Avg Engagement</p>
                      <p className="text-white text-3xl font-bold mt-2">{avgEngagement}</p>
                    </div>
                    <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-orange-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Per category average</span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Posts by Category</h3>
                      <p className="text-sm text-gray-500 mt-1">Distribution of content across categories</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          layout="vertical"
                          align="right"
                          verticalAlign="middle"
                          formatter={(value) => <span className="text-gray-700 text-sm">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {categoryData.length === 0 && (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No category data available
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Views by Category</h3>
                      <p className="text-sm text-gray-500 mt-1">Views distribution across categories</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={viewsTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          axisLine={{ stroke: '#E5E7EB' }}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          axisLine={{ stroke: '#E5E7EB' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="views"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                          name="Views"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {viewsTrendData.length === 0 && (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No trend data available
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement by Category Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Engagement by Category</h3>
                    <p className="text-sm text-gray-500 mt-1">Views and comments per category</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => <span className="text-gray-700 text-sm">{value}</span>}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                        name="Views"
                      />
                      <Line
                        type="monotone"
                        dataKey="commentCount"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                        name="Comments"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {engagementData.length === 0 && (
                  <div className="h-72 flex items-center justify-center text-gray-500">
                    No engagement data available
                  </div>
                )}
              </div>
            </div>
          )}

          {active === "Manage Posts" && (
              <AdminManagePosts />
          )}

          {active === "Manage Categories" && (
            <ManageCategories />
          )}
        </div>
      </div>
    </div>
  );
}

