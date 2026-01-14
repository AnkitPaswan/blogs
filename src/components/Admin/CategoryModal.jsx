import { X, Plus, Edit, Tag, Save } from "lucide-react";

export default function CategoryModal({
  showModal,
  setShowModal,
  newCategory,
  setNewCategory,
  editCategoryId,
  loading,
  handleAddOrEditCategory,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-white/20 relative animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {editCategoryId ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {editCategoryId ? "Edit Category" : "Create New Category"}
                </h3>
                <p className="text-green-100 text-sm">
                  {editCategoryId ? "Update your category details" : "Add a new category to organize your posts"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleAddOrEditCategory} className="p-6">
          <div className="space-y-6">
            {/* Category Name */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Category Name</label>
              </div>
              <input
                type="text"
                placeholder="Enter category name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
            </div>

            {/* Category Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
              </div>
              <textarea
                placeholder="Enter category description"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 min-h-[100px] resize-none"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : (editCategoryId ? "Update Category" : "Create Category")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

