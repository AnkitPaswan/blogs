import { useState, useEffect,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import ManagePosts from "./AdminManagePosts";
import ManageCategories from "./AdminManageCategories";
import { postsAPI } from "../../services/api.js";
import { FileText, Eye, MessageCircle, TrendingUp, Users, Activity } from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [posts, setPosts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // login state

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchPosts();
      fetchDashboardStats();
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts();
      setPosts(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await postsAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

const avgEngagement = useMemo(() => {
  if (!Array.isArray(posts) || posts.length === 0) return 0;

  const total = posts.reduce((sum, post) => {
    const views = Number(post?.views ?? 0);
    const comments = Number(post?.comments ?? 0);
    return sum + views + comments;
  }, 0);

  return Math.round(total / posts.length);
}, [posts]);

  // Prepare data for Pie Chart (Category Distribution)
  const categoryData = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];

    const categoryStats = posts.reduce((acc, post) => {
      const category = post.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryStats).map(([name, value]) => ({
      name,
      value
    }));
  }, [posts]);

  // Prepare data for Views Trend Chart
  const viewsTrendData = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];

    // Group posts by createdAt
    const dateStats = posts.reduce((acc, post) => {
      const date = post.createdAt ? formatDate(post.createdAt) : 'Unknown';
      
      if (!acc[date]) {
        acc[date] = { date, views: 0, commentCount: 0 };
      }
      acc[date].views += Number(post.views ?? 0);
      acc[date].commentCount += Number(post.commentCount ?? 0);
      return acc;
    }, {});

    return Object.values(dateStats).slice(-7); // Last 7 entries
  }, [posts]);

  // Prepare data for Engagement by Category
  const engagementData = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];

    const categoryStats = posts.reduce((acc, post) => {
      const category = post.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { category, views: 0, commentCount: 0 };
      }
      acc[category].views += Number(post.views ?? 0);
      acc[category].commentCount += Number(post.commentCount ?? 0);
      return acc;
    }, {});

    return Object.values(categoryStats)
      .sort((a, b) => (b.views + b.commentCount) - (a.views + a.commentCount))
      .slice(0, 5);
  }, [posts]);

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  // Custom tooltip for charts
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
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 p-6 overflow-y-auto" style={{ height: '100vh', overflowY: 'auto' }}>
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
              {/* Total Posts */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Posts</p>
                    <p className="text-white text-3xl font-bold mt-2">{dashboardStats?.totalPosts || posts.length}</p>
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

              {/* Total Views */}
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

              {/* Total Comments */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Comments</p>
                    <p className="text-white text-3xl font-bold mt-2">{dashboardStats?.totalComments || posts.reduce((sum, p) => sum + (p.commentCount ?? 0), 0).toLocaleString()}</p>
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

              {/* Engagement Rate */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg Engagement</p>
                    <p className="text-white text-3xl font-bold mt-2">
                     {avgEngagement}
                    </p>
                  </div>
                  <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-orange-100 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Per post average</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Category Distribution */}
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

              {/* Area Chart - Views Trend */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Views Trend</h3>
                    <p className="text-sm text-gray-500 mt-1">Engagement over time</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={viewsTrendData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
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
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                        name="Views"
                      />
                    </AreaChart>
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

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Most Popular Category */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Category</h3>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {(() => {
                    const categoryStats = posts.reduce((acc, post) => {
                      acc[post.category] = (acc[post.category] || 0) + 1;
                      return acc;
                    }, {});
                    const topCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0];
                    return topCategory ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{topCategory[0]}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {topCategory[1]} posts
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-500">No posts yet</p>
                    );
                  })()}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.content?.substring(0, 30)}...
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-gray-500 text-sm">No recent posts</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setActive("Manage Posts")}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Manage Posts</span>
                  </button>
                  <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {active === "Manage Posts" && (
          <ManagePosts posts={posts} setPosts={setPosts} />
        )}

        {active === "Manage Categories" && (
          <ManageCategories />
        )}
      </div>
    </div>
  );
}


