// src/pages/ArticleList.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Heart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { type ArticleResponseDTO } from '../interfaces/article';

export const ArticleList = () => {
  const navigate = useNavigate()
  const [articles] = useState<ArticleResponseDTO[]>([
    {
      _id: '1',
      title: 'The Future of Artificial Intelligence',
      description: 'Description here',
      tags: [],
      category: { _id: 'cat1', name: 'Technology' },
      author: { _id: 'user123', firstName: 'John', lastName: 'Doe' },
      likesCount: 245,
      dislikesCount: 10,
      userInteraction: { liked: false, disliked: false, blocked: false },
      createdAt: new Date('2024-10-05'),
      updatedAt: new Date('2024-10-05'),
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
    },
    // Add more
  ]); // Dummy, later API. Removed status/views as not in schema

  const handleDelete = (/*id: string*/) => {
    if (confirm('Are you sure you want to delete this article?')) {
      // setArticles(articles.filter(a => a._id !== id));
      alert('Article deleted!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
    
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Articles</h1>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Article</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-purple-50 overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  {article.category.name}
                </span>
                
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{article.likesCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/edit/${article._id}`)}
                    className="flex-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center space-x-2 text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(/*article._id*/)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2 text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600 mb-6">Start writing your first article!</p>
            <button
              onClick={() => navigate("/create")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
};