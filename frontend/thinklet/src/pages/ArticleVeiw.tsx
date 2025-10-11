// src/pages/ArticleView.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Clock, Share2, MoreVertical, ArrowLeft, ThumbsDown } from 'lucide-react'; // Added ThumbsDown
import { useNavigate, useParams } from 'react-router-dom';
// import { getArticle } from '../services/apis/userApi'; 
import { message } from 'antd';
import { type ArticleResponseDTO } from '../interfaces/article';
import { Navbar } from '../components/Navbar';


export const ArticleView = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<ArticleResponseDTO | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Dummy data for now, replace with API
    const dummyArticle: ArticleResponseDTO = {
      _id: articleId || '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      description: 'Exploring how AI is revolutionizing medical diagnostics, treatment planning, and patient care. From early disease detection to personalized medicine, AI is transforming the healthcare landscape.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      tags: ['AI', 'Healthcare', 'Innovation'],
      category: { _id: 'cat1', name: 'Technology' },
      author: { _id: 'user1', firstName: 'Sarah', lastName: 'Johnson' },
      likesCount: 245,
      dislikesCount: 10,
      userInteraction: { liked: false, disliked: false, blocked: false },
      createdAt: new Date('2024-10-09'),
      updatedAt: new Date('2024-10-09'),
    };
    setArticle(dummyArticle);
    setLiked(dummyArticle.userInteraction.liked);
    setDisliked(dummyArticle.userInteraction.disliked);
    // Later: fetchArticle();
  }, [articleId]);

  const handleBlock = () => {
    if (confirm('Are you sure you want to block this author?')) {
      message.success('Author blocked!');
      navigate(-1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.title, url: window.location.href });
    } else {
      alert('Share link copied!');
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
  const createdDate = article.createdAt.toLocaleDateString();

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
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                <span className="text-white font-semibold">{fullName.charAt(0)}</span>
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
              <span key={index} className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Heart className={`w-6 h-6 ${liked ? 'fill-purple-600 text-purple-600' : ''}`} />
                <span className="font-medium">{article.likesCount}</span>
              </button>
              
              <button
                onClick={() => setDisliked(!disliked)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ThumbsDown className={`w-6 h-6 ${disliked ? 'fill-red-600 text-red-600' : ''}`} />
                <span className="font-medium">{article.dislikesCount}</span>
              </button>
              {/* Removed comments */}
            </div>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-purple-600 text-purple-600' : 'text-gray-600'}`} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};