// src/pages/Home.tsx (assuming pages folder)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GridBackground } from '../components/gridBackground';
import { Navbar } from '../components/Navbar';
import { ArticleCard } from '../components/ArticleCard';
import { type ArticleResponseDTO } from '../interfaces/article';
import { type IUser } from '../interfaces/user';

export const Home = () => {
  const [articles] = useState<ArticleResponseDTO[]>([
    {
      _id: '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      description: 'Exploring how AI is revolutionizing medical diagnostics, treatment planning, and patient care.',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      tags: ['AI', 'Healthcare', 'Innovation'],
      category: { _id: 'cat1', name: 'Technology' },
      author: { _id: 'user1', firstName: 'Sarah', lastName: 'Johnson' },
      likesCount: 245,
      dislikesCount: 10,
      userInteraction: { liked: false, disliked: false, blocked: false },
      createdAt: new Date('2024-10-09'),
      updatedAt: new Date('2024-10-09'),
    },
    {
      _id: '2',
      title: '10 Essential Tips for Marathon Training',
      description: 'Whether you\'re a beginner or seasoned runner, these training tips will help you prepare.',
      thumbnail: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
      tags: ['Running', 'Fitness', 'Marathon'],
      category: { _id: 'cat2', name: 'Sports' },
      author: { _id: 'user2', firstName: 'Mike', lastName: 'Chen' },
      likesCount: 189,
      dislikesCount: 5,
      userInteraction: { liked: false, disliked: false, blocked: false },
      createdAt: new Date('2024-10-08'),
      updatedAt: new Date('2024-10-08'),
    },
    // Add more dummy articles as needed
  ]);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const user: IUser = {
    _id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    preferences: ['Technology', 'Health', 'Sports'],
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate API, later replace
    setTimeout(() => {
      setLoading(false);
      // setHasMore(false); when no more
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <GridBackground />
      
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 z-20">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">{user.firstName}</span>!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Discover articles based on your interests</p>
        </motion.div>

        {/* Preferences Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">Your Interests:</span>
            {user.preferences.map((pref, index) => (
              <span
                key={index}
                className="px-3 py-1 sm:px-4 sm:py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md"
              >
                {pref}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles available</h3>
            <p className="text-gray-600">Check back later or adjust your preferences.</p>
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
                'Load More Articles'
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};