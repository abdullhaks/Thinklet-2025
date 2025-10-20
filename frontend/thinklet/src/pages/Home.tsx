// src/pages/Home.tsx
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GridBackground } from "../components/gridBackground";
import { Navbar } from "../components/Navbar";
import { ArticleCard } from "../components/ArticleCard";
import { type ArticleResponseDTO } from "../interfaces/article";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { getPreferenceArticles, getSearchedArticles } from "../services/apis/userApi";
import { message } from "antd";
import { debounce } from "lodash";

export const Home = () => {
  const limit = 3;
  const [articleSet, setArticleSet] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [articles, setArticles] = useState<ArticleResponseDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state: RootState) => state.user.user);

  // Debounced fetch function for search
  const debouncedFetchSearchArticles = useCallback(
    debounce(async (query: string, set: number, userId: string) => {
      if (!query.trim()) return; // Skip if query is empty
      setLoading(true);
      try {
        console.log("Fetching searched articles with query:", query);
        const response = await getSearchedArticles(query, limit, set, userId);
        console.log("Search API Response:", response);
        if (response.articles.length === 0) {
          setHasMore(false);
        } else {
          setArticles((prev) =>
            set === 1 ? response.articles : [...prev, ...response.articles]
          );
          setHasMore(response.articles.length === limit);
        }
      } catch (error: any) {
        console.error("Error fetching searched articles:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce delay
    [limit] // Dependency for debounce
  );

  // Fetch articles (preference or search-based)
  useEffect(() => {
    const fetchArticles = async () => {
      if (!user?._id) {
        console.log("No user ID, skipping fetch");
        setArticles([]);
        setHasMore(false);
        return;
      }

      if (searchQuery.trim()) {
        // Trigger debounced search
        debouncedFetchSearchArticles(searchQuery, articleSet, user._id);
      } else {
        // Fetch preference-based articles
        if (!user?.preferences || user.preferences.length === 0) {
  
          setArticles([]);
          setHasMore(false);
          return;
        }
        setLoading(true);
        message.loading("Fetching articles...");
        try {
          console.log("Fetching articles with preferences:", user.preferences);
          const response = await getPreferenceArticles(
            user.preferences,
            limit,
            articleSet,
            user._id
          );
          console.log("Preference API Response:", response);
          if (response.articles.length === 0) {
            setHasMore(false);
          } else {
            setArticles((prev) =>
              articleSet === 1
                ? response.articles
                : [...prev, ...response.articles]
            );
            setHasMore(response.articles.length === limit);
          }
        } catch (error: any) {
          console.error("Error fetching preference articles:", error);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticles();
  }, [user?._id, user?.preferences, articleSet, searchQuery, debouncedFetchSearchArticles]);

  // Reset pagination and articles when searchQuery changes
  useEffect(() => {
    setArticles([]);
    setArticleSet(1);
    setHasMore(true);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setArticleSet((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <GridBackground />
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 z-20">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
              {user ? user.firstName : "User"}
            </span>
            !
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover articles based on your interests
          </p>
        </motion.div>

        {/* Preferences Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              Your Interests:
            </span>
            {user?.preferences?.length && user?.preferences?.length > 0 ? (
              user.preferences.map((pref, index) => (
                <span
                  key={index}
                  className="px-3 py-1 sm:px-4 sm:py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md"
                >
                  {pref.name}
                </span>
              ))
            ) : (
              <span className="text-xs sm:text-sm text-gray-600">
                No preferences set
              </span>
            )}
          </div>
        </motion.div>

        {/* Articles Grid */}
        {articles.length === 0 && !loading ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles available
            </h3>
            <p className="text-gray-600">
              {searchQuery.trim()
                ? "No results found for your search. Try adjusting your query."
                : "Check back later or adjust your preferences."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </span>
              ) : (
                "Load More Articles"
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};