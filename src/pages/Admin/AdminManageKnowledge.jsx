import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText, BookOpen, Filter } from "lucide-react";
import { knowledgeAPI } from "../../services/knowledgeAPI";
import KnowledgeModal from "../../components/Admin/KnowledgeModal";
import { SkeletonLoaderForCategory } from "../../utils/SkeletonLoader";
import { formatDate } from "../../utils/formatDate";

export default function AdminManageKnowledge() {
  const [knowledgeArticles, setKnowledgeArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    title: "",
    content: "",
  });
  const [editKnowledgeId, setEditKnowledgeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Fetch knowledge articles on component mount
  useEffect(() => {
    fetchKnowledgeArticles();
  }, []);

  // Filter articles when filterBy or knowledgeArticles change
  useEffect(() => {
    let filtered = [...knowledgeArticles];
    if (filterBy && filterBy !== "all") {
      filtered = knowledgeArticles.filter(article => article._id === filterBy);
    }
    setFilteredArticles(filtered);
  }, [knowledgeArticles, filterBy]);

  const fetchKnowledgeArticles = async () => {
    try {
      setLoading(true);
      const response = await knowledgeAPI.getAllKnowledge();
      if (Array.isArray(response.data)) {
        setKnowledgeArticles(response.data);
      } else {
        console.error('Knowledge articles data is not an array:', response.data);
        setKnowledgeArticles([]);
      }
    } catch (error) {
      console.error('Error fetching knowledge articles:', error);
      alert('Error fetching knowledge articles: ' + (error.response?.data?.message || error.message));
      setKnowledgeArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditKnowledge = async (e) => {
    e.preventDefault();
    if (!newKnowledge.title.trim()) {
      alert("Please enter article title");
      return;
    }

    try {
      setLoading(true);
      if (editKnowledgeId) {
        const updatedArticle = await knowledgeAPI.updateKnowledge(editKnowledgeId, newKnowledge);
        setKnowledgeArticles(knowledgeArticles.map(article => 
          article._id === editKnowledgeId ? { ...article, ...updatedArticle } : article
        ));
        setEditKnowledgeId(null);
      } else {
        const response = await knowledgeAPI.createKnowledge(newKnowledge);
        setKnowledgeArticles([...knowledgeArticles, response]);
      }

      setShowModal(false);
      setNewKnowledge({
        title: "",
        content: "",
      });
    } catch (error) {
      alert('Error saving knowledge article: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this knowledge article?")) {
      try {
        setLoading(true);
        await knowledgeAPI.deleteKnowledge(id);
        setKnowledgeArticles(knowledgeArticles.filter(article => article._id !== id));
      } catch (error) {
        alert('Error deleting knowledge article: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (article) => {
    setNewKnowledge({
      title: article.title,
      content: article.content,
    });
    setEditKnowledgeId(article._id);
    setShowModal(true);
  };

  const handleNewKnowledge = () => {
    setNewKnowledge({
      title: "",
      content: "",
    });
    setEditKnowledgeId(null);
    setShowModal(true);
  };

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manage Knowledge Articles</h2>
              <p className="text-sm text-gray-600">Create, edit, and manage trivia & knowledge articles</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Article Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full sm:w-48 appearance-none"
              >
                <option value="all">All Articles</option>
                {knowledgeArticles.map((article) => (
                  <option key={article._id} value={article._id}>{article.title}</option>
                ))}
              </select>
            </div>

            {/* New Article Button */}
            <button
              onClick={handleNewKnowledge}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </button>
          </div>
        </div>
      </div>

      {/* Knowledge Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {filteredArticles.map((article) => (
          <div key={article._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Article Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg line-clamp-1">{article.title}</h3>
                  <p className="text-purple-100 text-sm">
                    {formatDate(article.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Article Content Preview */}
            <div className="p-4">
              <p className="text-gray-700 mb-4 line-clamp-3">
                {article.content?.replace(/<[^>]*>/g, '') || "No content provided"}
              </p>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md py-1.5 hover:bg-blue-100 transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-red-600 bg-red-50 rounded-md py-1.5 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No knowledge articles yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first knowledge article</p>
          <button
            onClick={handleNewKnowledge}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Article</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <SkeletonLoaderForCategory />
      )}

      {/* Modal */}
      <KnowledgeModal
        showModal={showModal}
        setShowModal={setShowModal}
        newKnowledge={newKnowledge}
        setNewKnowledge={setNewKnowledge}
        editKnowledgeId={editKnowledgeId}
        loading={loading}
        handleAddOrEditKnowledge={handleAddOrEditKnowledge}
      />
    </div>
  );
}

