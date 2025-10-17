// src/pages/ArticleView.tsx
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Bookmark,
  Clock,
  Share2,
  MoreVertical,
  ArrowLeft,
  ThumbsDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { debounce } from "lodash";
import {
  getArticle,
  likeArticle,
  dislikeArticle,
} from "../services/apis/userApi";
import { type ArticleResponseDTO } from "../interfaces/article";
import { Navbar } from "../components/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";

export const ArticleView = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [article, setArticle] = useState<ArticleResponseDTO | null>(null);
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        message.error("Article ID is missing");
        return;
      }

      try {
        const response = await getArticle(articleId, user?._id);
        console.log("Article from frontend:", response);
        setArticle(response.article);
        setLiked(response.article.userInteraction.liked);
        setDisliked(response.article.userInteraction.disliked);
      } catch (error: any) {
        message.error(error.message || "Failed to fetch article");
      }
    };

    fetchArticle();
  }, [articleId, user?._id]);

  // Debounced like handler
  const handleLike = useCallback(
    debounce(async () => {
      if (!user?._id) {
        message.error("Please log in to like this article");
        return;
      }
      if (!articleId) return;

      try {
        const response = await likeArticle(articleId, user._id);
        setLiked(response.liked);
        setDisliked(false); // Ensure mutually exclusive
        setArticle((prev) =>
          prev
            ? {
                ...prev,
                likesCount: response.likesCount,
                dislikesCount: response.dislikesCount,
                userInteraction: {
                  ...prev.userInteraction,
                  liked: response.liked,
                  disliked: false,
                },
              }
            : prev
        );
        message.success(response.liked ? "Article liked!" : "Like removed");
      } catch (error: any) {
        message.error(error.message || "Failed to like article");
      }
    }, 500),
    [articleId, user?._id]
  );

  // Debounced dislike handler
  const handleDislike = useCallback(
    debounce(async () => {
      if (!user?._id) {
        message.error("Please log in to dislike this article");
        return;
      }
      if (!articleId) return;

      try {
        const response = await dislikeArticle(articleId, user._id);
        setDisliked(response.disliked);
        setLiked(false); // Ensure mutually exclusive
        setArticle((prev) =>
          prev
            ? {
                ...prev,
                likesCount: response.likesCount,
                dislikesCount: response.dislikesCount,
                userInteraction: {
                  ...prev.userInteraction,
                  liked: false,
                  disliked: response.disliked,
                },
              }
            : prev
        );
        message.success(
          response.disliked ? "Article disliked!" : "Dislike removed"
        );
      } catch (error: any) {
        message.error(error.message || "Failed to dislike article");
      }
    }, 500),
    [articleId, user?._id]
  );

  const handleBlock = () => {
    if (confirm("Are you sure you want to block this author?")) {
      message.success("Author blocked!");
      navigate(-1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.title, url: window.location.href });
    } else {
      message.success("Share link copied!");
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <p className="text-gray-600">Article not found</p>
      </div>
    );
  }

  const fullName = `${article.author.firstName} ${article.author.lastName}`;
  const createdDate = new Date(article.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={handleBlock}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600 text-sm"
                    >
                      Block Author
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category */}
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full mb-4">
            {article.category.name}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Author & Meta */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {fullName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{fullName}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{createdDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.thumbnail && (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-64 sm:h-96 object-cover rounded-2xl mb-6"
            />
          )}

          {/* Description/Content */}
          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {article.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={!user?._id}
                className={`flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors ${
                  !user?._id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    liked ? "fill-purple-600 text-purple-600" : ""
                  }`}
                />
                <span className="font-medium">{article.likesCount}</span>
              </button>
              <button
                onClick={handleDislike}
                disabled={!user?._id}
                className={`flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors ${
                  !user?._id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ThumbsDown
                  className={`w-6 h-6 ${
                    disliked ? "fill-red-600 text-red-600" : ""
                  }`}
                />
                <span className="font-medium">{article.dislikesCount}</span>
              </button>
            </div>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Bookmark
                className={`w-6 h-6 ${
                  bookmarked
                    ? "fill-purple-600 text-purple-600"
                    : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
