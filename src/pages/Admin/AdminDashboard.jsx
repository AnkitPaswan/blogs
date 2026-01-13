import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import ManagePosts from "./AdminManagePosts";
import ManageCategories from "./AdminManageCategories";
import { postsAPI } from "../../services/api.js";
import { FileText, Heart, MessageCircle, TrendingUp, Users, Activity } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // login state

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchPosts();
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
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
                    <p className="text-white text-3xl font-bold mt-2">{posts.length}</p>
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

              {/* Total Likes */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Likes</p>
                    <p className="text-white text-3xl font-bold mt-2">
                      {posts.reduce((sum, p) => sum + p.likes, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-400 bg-opacity-30 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-red-100 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Community engagement</span>
                </div>
              </div>

              {/* Total Comments */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Comments</p>
                    <p className="text-white text-3xl font-bold mt-2">
                      {posts.reduce((sum, p) => sum + p.comments, 0).toLocaleString()}
                    </p>
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
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg Engagement</p>
                    <p className="text-white text-3xl font-bold mt-2">
                      {posts.length > 0
                        ? Math.round((posts.reduce((sum, p) => sum + p.likes + p.comments, 0) / posts.length))
                        : 0
                      }
                    </p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-purple-100 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Per post average</span>
                </div>
              </div>
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
                          {post.content.substring(0, 30)}...
                        </p>
                        <p className="text-xs text-gray-500">{post.date}</p>
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


