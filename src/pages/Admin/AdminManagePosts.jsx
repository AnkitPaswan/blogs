import { useState, useEffect } from "react";
import { postsAPI, searchPosts } from "../../services/api";
import { categoryAPI } from "../../services/categoryAPI";
import ManagePostsView from "../../components/Admin/ManagePostsView";

export default function AdminManagePosts({ posts: initialPosts, setPosts: setParentPosts }) {
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    caption: "",
    category: "",
    tag: "",
    image: "",
  });
  const [editPostId, setEditPostId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter posts when search query or category changes
  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, initialPosts]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      if (Array.isArray(response.data)) {
        setCategories(response.data.map(cat => cat.name));
      } else {
        console.error('Categories data is not an array:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const filterPosts = async () => {
    // If there's a search query, use the search API
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      try {
        const searchResults = await searchPosts(searchQuery);
        // Filter by category if selected
        const filtered = selectedCategory 
          ? searchResults.filter(post => post.category === selectedCategory)
          : searchResults;
        setFilteredPosts(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setFilteredPosts([]);
      } finally {
        setIsSearching(false);
      }
    } else if (selectedCategory) {
      // If no search query but category is selected, filter locally
      const filtered = initialPosts.filter(post => post.category === selectedCategory);
      setFilteredPosts(filtered);
    } else {
      // Show all posts
      setFilteredPosts(initialPosts);
    }
  };

  // Add or Update Post
  const handleAddOrEditPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.category) {
      alert("Please fill post title, post content and select category");
      return;
    }

    try {
      if (editPostId) {
        await postsAPI.updatePost(editPostId, newPost);
        setParentPosts(initialPosts.map(p => p.id === editPostId ? { ...p, ...newPost } : p));
        setEditPostId(null);
      } else {
        const response = await postsAPI.createPost(newPost);
        setParentPosts([...initialPosts, response.data]);
      }

      setShowModal(false);
      setNewPost({
        title: "",
        content: "",
        caption: "",
        category: "",
        tag: "",
        image: "",
      });
    } catch (error) {
      alert('Error saving post: ' + error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsAPI.deletePost(id);
        setParentPosts(initialPosts.filter(p => p.id !== id));
      } catch (error) {
        alert('Error deleting post: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const handleEdit = (post) => {
    setNewPost(post);
    setEditPostId(post.id);
    setShowModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  // Determine which posts to display
  const displayPosts = filteredPosts.length > 0 || searchQuery.length >= 2 || selectedCategory ? filteredPosts : initialPosts;

  return (
    <ManagePostsView
      showModal={showModal}
      setShowModal={setShowModal}
      newPost={newPost}
      setNewPost={setNewPost}
      editPostId={editPostId}
      setEditPostId={setEditPostId}
      categories={categories}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      isSearching={isSearching}
      displayPosts={displayPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleClearFilters={handleClearFilters}
      handleAddOrEditPost={handleAddOrEditPost}
    />
  );
}

