import { useState, useEffect, useRef, useCallback } from "react";
import { FileText } from "lucide-react";
import { postsAPI, fetchCategories } from "../../services/api";
import { debounce } from "../../utils/debounce";
import ManagePostsView from "../../components/Admin/ManagePostsView";

export default function AdminManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal states
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

  // Ref for intersection observer
  const observerTarget = useRef(null);
  const observer = useRef(null);

  // Debounced search setter (500ms delay)
  const debouncedSetSearch = useCallback(
    debounce(() => {
      // Reset pagination when search query changes
      resetPagination();
    }, 500),
    []
  );

  // Reset pagination state
  const resetPagination = useCallback(() => {
    setPosts([]);
    setHasMore(true);
    setNextCursor(null);
    setNextId(null);
    setIsLoadingMore(false);
  }, []);

  // Fetch initial data (categories and posts)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Fetch initial posts
        await fetchPostsInternal(selectedCategory, "", true);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch posts function (handles both initial load and load more)
  const fetchPostsInternal = async (category, search, isInitial = false) => {
    const currentIsSearching = search.trim().length > 0;
    setIsSearching(currentIsSearching);

    if (isInitial) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let response;
      
      if (currentIsSearching) {
        // Search posts with pagination
        response = await postsAPI.searchPosts(
          search,
          8,
          isInitial ? null : nextCursor,
          isInitial ? null : nextId
        );
      } else {
        // Get posts by category with pagination
        response = await postsAPI.getPosts(
          category || "All",
          8,
          isInitial ? null : nextCursor,
          isInitial ? null : nextId
        );
      }

      const { posts: newPosts, hasMore: moreAvailable, nextCursor: cursor, nextId: id } = response.data;

      if (isInitial) {
        setPosts(newPosts || []);
      } else {
        setPosts(prevPosts => [...prevPosts, ...(newPosts || [])]);
      }

      setHasMore(moreAvailable || false);
      setNextCursor(cursor || null);
      setNextId(id || null);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || isLoadingMore || (!nextCursor && !nextId)) {
      return;
    }

    await fetchPostsInternal(selectedCategory, searchQuery, false);
  }, [hasMore, isLoadingMore, nextCursor, nextId, selectedCategory, searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // Cleanup previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    // Observe target if exists
    if (observerTarget.current) {
      observer.current.observe(observerTarget.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMorePosts]);

  // Handle search query change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    debouncedSetSearch(value);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    resetPagination();
  };

  // Fetch posts when filters change (after reset)
  useEffect(() => {
    // Skip initial mount, only react to filter changes after initial load
    if (!loading) {
      fetchPostsInternal(selectedCategory, searchQuery, true);
    }
  }, [selectedCategory, searchQuery]); // Trigger on both category and search changes

  // Handle add or edit post
  const handleAddOrEditPost = async (e) => {
    e.preventDefault();
    try {
      if (editPostId) {
        // Update existing post
        await postsAPI.updatePost(editPostId, newPost);
        setPosts(prevPosts =>
          prevPosts.map((post) =>
            post.id === editPostId ? { ...post, ...newPost } : post
          )
        );
      } else {
        // Create new post
        const response = await postsAPI.createPost(newPost);
        const createdPost = response.data;
        setPosts(prevPosts => [createdPost, ...prevPosts]);
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
      setEditPostId(null);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  };

  // Handle edit post
  const handleEdit = (post) => {
    setNewPost({
      title: post.title || "",
      content: post.content || "",
      caption: post.caption || "",
      category: post.category || "",
      tag: post.tag || "",
      image: post.image || "",
    });
    setEditPostId(post.id);
    setShowModal(true);
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    resetPagination();
  };

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
      setSearchQuery={handleSearchChange}
      selectedCategory={selectedCategory}
      setSelectedCategory={handleCategoryChange}
      posts={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleClearFilters={handleClearFilters}
      handleAddOrEditPost={handleAddOrEditPost}
      loading={loading}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      observerTarget={observerTarget}
      isSearching={isSearching}
    />
  );
}

