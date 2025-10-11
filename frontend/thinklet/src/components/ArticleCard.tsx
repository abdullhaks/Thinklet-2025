// src/components/ArticleCard.tsx
import { useState } from "react";
import { motion } from 'framer-motion';
import { Heart, Bookmark, Clock, ThumbsDown } from 'lucide-react'; // Added ThumbsDown for dislike
import { type ArticleResponseDTO } from '../interfaces/article';
import { useNavigate } from "react-router-dom";

interface ArticleCardProps {
  article: ArticleResponseDTO;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {

  const [liked, setLiked] = useState(article.userInteraction.liked);
  const [disliked, setDisliked] = useState(article.userInteraction.disliked);
  const [bookmarked, setBookmarked] = useState(false); // Local for now, as no bookmark in schema
  const navigate = useNavigate()
  const fullName = `${article.author.firstName} ${article.author.lastName}`;
  const createdDate = article.createdAt.toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-purple-50 overflow-hidden cursor-pointer"
      onClick={()=>navigate(`/article/${article._id}`)}
    >
      {/* Article Thumbnail */}
      {article.thumbnail && (
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full shadow-lg">
              {article.category.name}
            </span>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="p-4 sm:p-6">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
            <span className="text-white font-semibold text-xs sm:text-sm">
              {fullName.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{fullName}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article?.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={() => setLiked(!liked)}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-purple-600 text-purple-600' : ''}`} />
              <span className="text-xs sm:text-sm font-medium">{article.likesCount}</span>
            </button>
            
            <button
              onClick={() => setDisliked(!disliked)}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ThumbsDown className={`w-4 h-4 sm:w-5 sm:h-5 ${disliked ? 'fill-red-600 text-red-600' : ''}`} />
              <span className="text-xs sm:text-sm font-medium">{article.dislikesCount}</span>
            </button>
            {/* Removed comments as not in schema */}
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${bookmarked ? 'fill-purple-600 text-purple-600' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};