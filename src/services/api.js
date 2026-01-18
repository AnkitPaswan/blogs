import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with base URL
export const api = axios.create({
  baseURL: API_URL,
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Fetch all posts with optional category filter and pagination
export const fetchPosts = async (category = 'All', limit = 8, cursor = null, id = null) => {
  try {
    const params = new URLSearchParams();
    
    // Always add limit
    params.append('limit', limit.toString());
    
    // Add cursor and id for pagination (if provided)
    if (cursor) params.append('cursor', cursor);
    if (id) params.append('id', id);
    
    // Add category filter
    if (category !== 'All') {
      params.append('category', encodeURIComponent(category));
    }

    const url = `${API_URL}/posts?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Fetch home posts (grouped by category) from the home API
export const fetchHomePosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts/home`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching home posts:', error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return ['All', ...data.map(cat => cat.name)];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch single post by ID
export const fetchPostById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Search posts
export const searchPosts = async (term) => {
  try {
    const response = await fetch(
      `${API_URL}/posts/search/${encodeURIComponent(term)}`
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    // Return full response with posts array for pagination support
    return {
      posts: data.posts || data,
      nextCursor: data.nextCursor || null,
      nextId: data.nextId || null,
      hasMore: data.hasMore || false
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};


// Export postsAPI object with consistent response handling
export const postsAPI = {
  getPosts: async (category = 'All', limit = 8, cursor = null, id = null) => {
    const data = await fetchPosts(category, limit, cursor, id);
    return { data };
  },
  getPost: (id) => api.get(`/posts/${id}`),
  // Search posts with pagination support
  searchPosts: async (term, limit = 8, cursor = null, id = null) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (cursor) params.append('cursor', cursor);
      if (id) params.append('id', id);
      
      const url = `${API_URL}/posts/search/${encodeURIComponent(term)}?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      // Return full response with posts array for convenience
      return { 
        data: {
          ...data,  // Keep nextCursor, nextId, hasMore
          posts: data.posts || data  // Also include posts for easy access
        }
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return { data: response.data };
  },
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return { data: response.data };
  },
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return { data: response.data };
  },
  incrementView: (id) => api.post(`/posts/${id}/view`),
  getDashboardStats: () => api.get('/posts/dashboard'),
};

// Comments API
export const commentsAPI = {
  getComments: (postId) => api.get(`/comments/${postId}`),
  addComment: (commentData) => api.post('/comments', commentData),
};

