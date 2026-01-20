import { api } from './api';

export const knowledgeAPI = {
  // Get all knowledge articles with pagination
  getAllKnowledge: async () => {
    try {
      const response = await api.get('/knowledge');
      return {
        data: response.data.data || [],
        nextCursor: response.data.nextCursor || null,
        nextId: response.data.nextId || null,
        hasMore: response.data.hasMore || false
      };
    } catch (error) {
      console.error('Error fetching knowledge articles:', error);
      throw error;
    }
  },

  // Get knowledge article by ID
  getKnowledgeById: async (id) => {
    try {
      const response = await api.get(`/knowledge/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching knowledge article:', error);
      throw error;
    }
  },

  // Create new knowledge article
  createKnowledge: async (data) => {
    try {
      const response = await api.post('/knowledge', data);
      return response.data;
    } catch (error) {
      console.error('Error creating knowledge article:', error);
      throw error;
    }
  },

  // Update knowledge article
  updateKnowledge: async (id, data) => {
    try {
      const response = await api.put(`/knowledge/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating knowledge article:', error);
      throw error;
    }
  },

  // Delete knowledge article
  deleteKnowledge: async (id) => {
    try {
      const response = await api.delete(`/knowledge/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting knowledge article:', error);
      throw error;
    }
  }
};

