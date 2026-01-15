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

// Fetch all posts with optional category filter
export const fetchPosts = async (category = 'All') => {
  try {
    const url =
      category === 'All'
        ? `${API_URL}/posts`
        : `${API_URL}/posts?category=${encodeURIComponent(category)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
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

    return await response.json();
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Export postsAPI object to match original import expectation
export const postsAPI = {
  getPosts: async (category = 'All') => ({
    data: await fetchPosts(category),
  }),
  getPost: (id) => api.get(`/posts/${id}`),
   searchPosts: (term) => api.get(`/posts/search/${encodeURIComponent(term)}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  incrementView: (id) => api.post(`/posts/${id}/view`),
  getDashboardStats: () => api.get('/posts/dashboard'),
};

// Comments API
export const commentsAPI = {
  getComments: (postId) => api.get(`/comments/${postId}`),
  addComment: (commentData) => api.post('/comments', commentData),
};
