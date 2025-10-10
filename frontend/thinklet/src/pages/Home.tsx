import { useState } from 'react';
import { motion } from 'framer-motion';
import { GridBackground } from '../components/gridBackground';
import { Navbar } from '../components/Navbar';
import { ArticleCard } from '../components/ArticleCard';





export const Home = () => {
    
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "The Future of Artificial Intelligence in Healthcare",
      description: "Exploring how AI is revolutionizing medical diagnostics, treatment planning, and patient care. From early disease detection to personalized medicine, AI is transforming the healthcare landscape.",
      author: { name: "Dr. Sarah Johnson", id: "user123" },
      category: "Technology",
      tags: ["AI", "Healthcare", "Innovation"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      likes: 245,
      comments: 32,
      publishedDate: "2 days ago"
    },
    {
      id: 2,
      title: "10 Essential Tips for Marathon Training",
      description: "Whether you're a beginner or seasoned runner, these training tips will help you prepare for your next marathon. Learn about proper nutrition, rest days, and building endurance.",
      author: { name: "Mike Chen", id: "user456" },
      category: "Sports",
      tags: ["Running", "Fitness", "Marathon"],
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
      likes: 189,
      comments: 24,
      publishedDate: "3 days ago"
    },
    {
      id: 3,
      title: "Understanding Mental Health in the Digital Age",
      description: "The impact of social media and technology on our mental well-being. Discover strategies for maintaining healthy digital habits and protecting your mental health.",
      author: { name: "Emma Williams", id: "user789" },
      category: "Health",
      tags: ["MentalHealth", "Wellness", "Technology"],
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
      likes: 412,
      comments: 67,
      publishedDate: "5 days ago"
    },
    {
      id: 4,
      title: "Breaking: Global Climate Summit Reaches Historic Agreement",
      description: "World leaders have announced a groundbreaking climate agreement aimed at reducing carbon emissions by 50% over the next decade. Details of the implementation plan revealed.",
      author: { name: "James Rodriguez", id: "user321" },
      category: "News",
      tags: ["Climate", "Politics", "Environment"],
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80",
      likes: 567,
      comments: 89,
      publishedDate: "1 day ago"
    },
    {
      id: 5,
      title: "The Rise of Quantum Computing: What You Need to Know",
      description: "Quantum computers are no longer science fiction. Learn how this revolutionary technology works and how it will impact industries from finance to pharmaceuticals.",
      author: { name: "Dr. Lisa Park", id: "user654" },
      category: "Science",
      tags: ["Quantum", "Computing", "Technology"],
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      likes: 334,
      comments: 45,
      publishedDate: "4 days ago"
    },
    {
      id: 6,
      title: "Nutrition Myths Debunked: What Science Really Says",
      description: "Separating fact from fiction in the world of nutrition. We examine common dietary beliefs and what the latest research reveals about healthy eating.",
      author: { name: "Rachel Green", id: "user987" },
      category: "Health",
      tags: ["Nutrition", "Health", "Science"],
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
      likes: 298,
      comments: 56,
      publishedDate: "1 week ago"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    preferences: ["Technology", "Health", "Sports"]
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, fetch more articles from API
      setLoading(false);
      // setHasMore(false); // Set to false when no more articles
    }, 1000);
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <GridBackground />
      
      <Navbar/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">{user.name.split(' ')[0]}</span>!
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
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