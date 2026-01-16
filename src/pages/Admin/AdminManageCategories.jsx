import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Filter } from "lucide-react";
import { categoryAPI } from "../../services/categoryAPI";
import CategoryModal from "../../components/Admin/CategoryModal";
import {SkeletonLoaderForCategory} from "../../utils/SkeletonLoader";
import { formatDate } from "../../utils/formatDate";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories when filterBy or categories change
  useEffect(() => {
    let filtered = [...categories];
    if (filterBy && filterBy !== "all") {
      filtered = categories.filter(cat => cat._id === filterBy);
    }
    setFilteredCategories(filtered);
  }, [categories, filterBy]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories();
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Categories data is not an array:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories: ' + error.response?.data?.message || error.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      setLoading(true);
      if (editCategoryId) {
        await categoryAPI.updateCategory(editCategoryId, newCategory);
        setCategories(categories.map(cat => cat._id === editCategoryId ? { ...cat, ...newCategory } : cat));
        setEditCategoryId(null);
      } else {
        const response = await categoryAPI.createCategory(newCategory);
        setCategories([...categories, response.data]);
      }

      setShowModal(false);
      setNewCategory({
        name: "",
        description: "",
      });
    } catch (error) {
      alert('Error saving category: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setLoading(true);
        await categoryAPI.deleteCategory(id);
        setCategories(categories.filter(cat => cat._id !== id));
      } catch (error) {
        alert('Error deleting category: ' + error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (category) => {
    setNewCategory({
      name: category.name,
      description: category.description,
    });
    setEditCategoryId(category._id);
    setShowModal(true);
  };

  const handleNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
    });
    setEditCategoryId(null);
    setShowModal(true);
  };

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manage Categories</h2>
              <p className="text-sm text-gray-600">Create, edit, and manage your blog categories</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full sm:w-48 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* New Category Button */}
            <button
              onClick={handleNewCategory}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {filteredCategories.map((category) => (
          <div key={category._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                  <p className="text-green-100 text-sm">
                    Created: {formatDate(category.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Content */}
            <div className="p-4">
              <p className="text-gray-700 mb-4 line-clamp-3">
                {category.description || "No description provided"}
              </p>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md py-1.5 hover:bg-blue-100 transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
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
      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No categories yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first category</p>
          <button
            onClick={handleNewCategory}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Category</span>
          </button>
        </div>
      )}


      {/* Loading State */}
      {loading && (
       <SkeletonLoaderForCategory/>
      )}

      {/* Modal */}
      <CategoryModal
        showModal={showModal}
        setShowModal={setShowModal}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        editCategoryId={editCategoryId}
        loading={loading}
        handleAddOrEditCategory={handleAddOrEditCategory}
      />
    </div>
  );
}
