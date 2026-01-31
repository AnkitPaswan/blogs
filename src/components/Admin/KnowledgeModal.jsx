import { X, Plus, Edit, FileText, Save } from "lucide-react";
import TiptapEditor from "../../utils/TipTapEditor";

export default function KnowledgeModal({
  showModal,
  setShowModal,
  newKnowledge,
  setNewKnowledge,
  editKnowledgeId,
  loading,
  handleAddOrEditKnowledge,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-white/20 relative animate-fadeIn max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {editKnowledgeId ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {editKnowledgeId ? "Edit Knowledge Article" : "Create New Knowledge Article"}
                </h3>
                <p className="text-purple-100 text-sm">
                  {editKnowledgeId ? "Update your knowledge article" : "Share additional knowledge/trivia with your readers"}
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

        <form onSubmit={handleAddOrEditKnowledge} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Article Title */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Title</label>
              </div>
              <input
                type="text"
                placeholder="Enter article title"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
                value={newKnowledge.title}
                onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                required
              />
            </div>
            {/* Article Category */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Category</label>
              </div>
              <input
                type="text"
                placeholder="Enter article category"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
                value={newKnowledge.category}
                onChange={(e) => setNewKnowledge({ ...newKnowledge, category: e.target.value })}
                required
              />
            </div>

            {/* Article Content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Content</label>
              </div>
              <TiptapEditor
                value={newKnowledge.content}
                onChange={(html) => setNewKnowledge({ ...newKnowledge, content: html })}
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : (editKnowledgeId ? "Update Article" : "Create Article")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

