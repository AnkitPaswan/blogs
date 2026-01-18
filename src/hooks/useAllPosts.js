import { useEffect, useState, useCallback } from "react";
import { fetchPosts, fetchCategories } from "../services/api";

export default function useAllPosts(categoryFromURL) {
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [nextId, setNextId] = useState(null);

  // Sync URL → state
  useEffect(() => {
    setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  // Fetch categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res);
      } catch {
        setCategories(["All", "TECHNOLOGY", "ENTERTAINMENT", "SPORTS"]);
      }
    };
    loadCategories();
  }, []);

  // Reset pagination when category changes
  const resetPagination = useCallback(() => {
    setPosts([]);
    setHasMore(true);
    setNextCursor(null);
    setNextId(null);
    setIsLoadingMore(false);
  }, []);

  // Fetch posts on category change (initial load)
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      resetPagination();
      
      try {
        const data = await fetchPosts(selectedCategory);
        setPosts(data.posts || []);
        setHasMore(data.hasMore || false);
        setNextCursor(data.nextCursor || null);
        setNextId(data.nextId || null);
      } catch {
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [selectedCategory, resetPagination]);

  // Load more posts function
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor || !nextId) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const data = await fetchPosts(selectedCategory, 8, nextCursor, nextId);
      setPosts(prevPosts => [...prevPosts, ...(data.posts || [])]);
      setHasMore(data.hasMore || false);
      setNextCursor(data.nextCursor || null);
      setNextId(data.nextId || null);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedCategory, hasMore, isLoadingMore, nextCursor, nextId]);

  return {
    selectedCategory,
    setSelectedCategory,
    posts,
    categories,
    loading,
    error,
    hasMore,
    isLoadingMore,
    nextCursor,
    nextId,
    loadMorePosts,
  };
}

