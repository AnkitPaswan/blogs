import {
  X,
  Plus,
  Edit,
  FileText,
  Tag,
  Image,
  Save,
  Loader2,
} from "lucide-react";
import TiptapEditor from "../../utils/TipTapEditor";
import { useState, useEffect } from "react";
import { knowledgeAPI } from "../../services/knowledgeAPI";

export default function PostsModal({
  showModal,
  setShowModal,
  newPost,
  setNewPost,
  editPostId,
  categories,
  handleAddOrEditPost,
}) {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);

  // Fetch knowledge list on mount
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        setKnowledgeLoading(true);
        const response = await knowledgeAPI.getAllKnowledge();
        setKnowledgeList(response.data || []);
      } catch (error) {
        console.error("Error fetching knowledge articles:", error);
      } finally {
        setKnowledgeLoading(false);
      }
    };

    if (showModal) {
      fetchKnowledge();
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-white/20 relative animate-fadeIn max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {editPostId ? (
                  <Edit className="w-6 h-6" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {editPostId ? "Edit Post" : "Create New Post"}
                </h3>
                <p className="text-blue-100 text-sm">
                  {editPostId
                    ? "Update your blog post details"
                    : "Share your thoughts with the world"}
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

        <form
          onSubmit={handleAddOrEditPost}
          className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto"
        >
          <div className="space-y-6">
            {/* Post Title */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Post Title
                </label>
              </div>
              <input
                type="text"
                placeholder="Enter post title"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
            </div>

            {/* Category & Tags - Row wise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                </div>
                <select
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">
                    Tags
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                  value={newPost.tag}
                  onChange={(e) =>
                    setNewPost({ ...newPost, tag: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Featured Image
                </label>
              </div>
              <input
                type="text"
                placeholder="Image URL"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                value={newPost.image}
                onChange={(e) =>
                  setNewPost({ ...newPost, image: e.target.value })
                }
              />
            </div>

            {/* Post Content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Post Content
                </label>
              </div>
              <TiptapEditor
                value={newPost.content}
                onChange={(html) => setNewPost({ ...newPost, content: html })}
              />
            </div>

            {/* Caption */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Caption
                </label>
              </div>
              <input
                type="text"
                placeholder="Post caption (optional)"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                value={newPost.caption}
                onChange={(e) =>
                  setNewPost({ ...newPost, caption: e.target.value })
                }
              />
            </div>

            {/* trivia */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Trivia Content(optional)
                </label>
              </div>
              <TiptapEditor
                value={newPost.trivia.content}
                onChange={(html) =>
                  setNewPost({
                    ...newPost,
                    trivia: {
                      ...newPost.trivia,
                      content: html,
                    },
                  })
                }
              />
            </div>
            <select
              value={newPost.trivia.knowledgeArticleId || ""}
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  trivia: {
                    ...newPost.trivia,
                    knowledgeArticleId: e.target.value || null,
                  },
                })
              }
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
              disabled={knowledgeLoading}
            >
              <option value="">
                {knowledgeLoading
                  ? "Loading knowledge articles..."
                  : "Select Knowledge Article (optional)"}
              </option>
              {!knowledgeLoading &&
                knowledgeList.map((k) => (
                  <option key={k._id} value={k._id}>
                    {k.title}
                  </option>
                ))}
            </select>
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              <span>{editPostId ? "Update Post" : "Create Post"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
