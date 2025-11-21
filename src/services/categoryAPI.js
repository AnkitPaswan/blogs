import { api } from './api';

export const categoryAPI = {
  // Get all categories
  getCategories: () => api.get('/categories'),

  // Get category by ID
  getCategory: (id) => api.get(`/categories/${id}`),

  // Create new category
  createCategory: (categoryData) => api.post('/categories', categoryData),

  // Update category
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),

  // Delete category
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};
