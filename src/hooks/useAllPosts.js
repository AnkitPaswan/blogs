import { useEffect, useState } from "react";
import { fetchPosts, fetchCategories } from "../services/api";

export default function useAllPosts(categoryFromURL) {
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch posts on category change
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPosts(selectedCategory);
        setPosts(data);
      } catch {
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    posts,
    categories,
    loading,
    error,
  };
}
