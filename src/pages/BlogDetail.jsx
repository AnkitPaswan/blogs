import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tag, MessageCircle, ArrowLeft, Calendar, EyeIcon } from "lucide-react";
import { postsAPI, commentsAPI } from "../services/api";
import ShareButton from "../utils/ShareButton";
import { SkeletonLoaderForPostDetails } from "../utils/SkeletonLoader";
import ErrorState from "../utils/ErrorState";
import notFoundImage from "/assets/notfound.webp";
import TriviaModal from "../components/TriviaModal";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentFormData, setCommentFormData] = useState({
    name: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getPost(id);
        setPost(response.data);
        console.log(response);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Post not found");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Track view when post is loaded
  useEffect(() => {
    if (!post?.id) return;

    const viewed = localStorage.getItem(`post-viewed-${post.id}`);
    if (!viewed) {
      postsAPI.incrementView(post.id).catch(console.error);
      localStorage.setItem(`post-viewed-${post.id}`, "true");
    }
  }, [post?.id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentsAPI.getComments(id);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  const handleCommentInputChange = (e) => {
    const { name, value } = e.target;
    setCommentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentFormData.comment.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await commentsAPI.addComment({
        name: commentFormData.name.trim() || "Anonymous",
        comment: commentFormData.comment,
        postId: id,
      });
      setCommentFormData({ name: "", comment: "" });
      setShowCommentForm(false);

      // Refresh comments list
      const response = await commentsAPI.getComments(id);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const [showTrivia, setShowTrivia] = useState(false);
  const [activeTrivia, setActiveTrivia] = useState(null);

  const openTrivia = (triviaData) => {
    setActiveTrivia(triviaData);
    setShowTrivia(true);
  };

  const closeTrivia = () => {
    setShowTrivia(false);
    setActiveTrivia(null);
  };

  if (loading) {
    return <SkeletonLoaderForPostDetails />;
  }

  if (error || !post) {
    return (
      <ErrorState
        title="Post Not Found"
        message={
          error ||
          "The post you're looking for doesn't exist or has been removed."
        }
        onRetry={() => window.location.reload()}
        showRetry={true}
        showHome={true}
        className="min-h-screen bg-gray-50"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Post Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Post Image */}
          {post.image && (
            <div className="relative h-64 md:h-80 lg:h-96">
              <img
                src={post.image}
                alt="Post"
                onError={(e) => {
                  e.currentTarget.src = notFoundImage;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="p-6 md:p-8">
            {/* Post Text - Rendered from TipTap HTML content */}
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 leading-snug">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>

              {post.views && (
                <span className="inline-flex items-center gap-1.5">
                  <EyeIcon size={14} />
                  {post.views} views
                </span>
              )}
            </div>

            <div
              className="prose prose-lg max-w-none mb-6 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Caption */}
            {post.caption && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 italic">{post.caption}</p>
              </div>
            )}

            {/* Tags and Stats */}
            <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                {/* Trivia Button (Tag ke LEFT me) */}
                {post.trivia && post.trivia.length > 0 && (
                  <button
                    onClick={() => openTrivia(post.trivia)}
                    className="
    inline-flex items-center gap-2
    px-3.5 py-1.5
    text-xs font-semibold
    rounded-md
    bg-blue-600 text-white
    hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500/40
    transition-all
  "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    Trivia
                  </button>
                )}

                {/* Tag */}
                {post.tag && (
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{post.tag}</span>
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <button
                  onClick={toggleCommentForm}
                  className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="text-gray-500" />
                  <span>{comments.length}</span>
                </button>

                <ShareButton
                  url={`/blog/${post.id || post._id}`}
                  title={post.title || "Check out this post!"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts Section (Optional) */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">More from {post.category}</h3>
          <p className="text-gray-600">
            Check out more posts in the <span className="font-medium">{post.category}</span> category.
          </p>
          <Link
            to={`/AllPosts?category=${post.category}`}
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All {post.category} Posts
          </Link>
        </div> */}

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Comments ({comments.length})
            </h3>
            <button
              onClick={toggleCommentForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showCommentForm ? "Cancel" : "Add Comment"}
            </button>
          </div>

          {/* Comment Form */}
          {showCommentForm && (
            <form
              onSubmit={handleCommentSubmit}
              className="mb-8 p-6 bg-gray-50 rounded-xl"
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={commentFormData.name}
                  onChange={handleCommentInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={commentFormData.comment}
                  onChange={handleCommentInputChange}
                  placeholder="Write your comment here..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Comment"}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={comment.id || index}
                  className="p-4 bg-gray-50 rounded-lg flex gap-3"
                >
                  {/* User Icon */}
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
                    {comment.name?.charAt(0) || "U"}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {comment.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>

                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <TriviaModal
          isOpen={showTrivia}
          onClose={closeTrivia}
          trivia={activeTrivia}
        />
      </div>
    </div>
  );
}
