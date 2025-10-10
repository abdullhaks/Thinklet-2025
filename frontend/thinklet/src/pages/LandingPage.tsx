import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import thinkletLogo from "../assets/thinklet.png"
import { GridBackground } from "../components/gridBackground";


// Landing Page
export const LandingPage = () => {

    const onNavigate = useNavigate()


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative">
      <GridBackground />
      
      {/* Navbar */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            {/* <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg sm:text-xl">T</span>
            </div> */}

      
            <span className="text-xl sm:text-2xl font-bold text-gray-800">thinklet</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 sm:gap-3"
          >
            <button 
              onClick={() => onNavigate('/login')}
              className="px-4 sm:px-6 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('/signup')}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <motion.img src={thinkletLogo} className="mb-10 w-96 ">
            
            </motion.img>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">Think</span>, Write & Share
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join a community of thinkers and writers. Share your insights, discover amazing content, and engage with ideas that matter.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button 
                onClick={() => onNavigate('/signup')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base sm:text-lg"
              >
                Get Started Free
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-purple-300 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all text-base sm:text-lg">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full"></div>
                        <div className="h-4 bg-purple-200 rounded w-24"></div>
                      </div>
                      <div className="h-3 bg-purple-100 rounded w-full mb-2"></div>
                      <div className="h-3 bg-purple-100 rounded w-3/4"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {[
            { icon: '💭', title: 'Think Deeply', desc: 'Explore ideas and perspectives' },
            { icon: '✍️', title: 'Write Freely', desc: 'Express yourself without limits' },
            { icon: '🌐', title: 'Share Widely', desc: 'Connect with like-minded readers' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border border-purple-100"
            >
              <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};