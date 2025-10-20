// src/pages/ArticleList.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { type ArticleResponseDTO } from "../interfaces/article";
import { deleteArticle, getMyArticles } from "../services/apis/userApi";
import type { RootState } from "../redux/store/store";
import { useSelector } from "react-redux";
import { message, Popconfirm } from "antd";

export const ArticleList = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleResponseDTO[]>([]);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    let fetchMyArticles = async () => {
      message.loading("fetching your articles...");
      try {
        let response = await getMyArticles(user?._id || "");
        if (response.articles.length) {
          setArticles(response.articles);
        } else {
          message.warning("no articles yet");
        }
      } catch (error) {
        message.error("fetching your articles failed. please try later!");
      }
    };

    fetchMyArticles();
  }, [user?._id]);

  const handleDelete = async (id: string) => {
    let response = await deleteArticle(id);

    if (response) {
      message.success(response.message || "article deleted");
      setArticles((prev) => prev.filter((article) => article._id !== id));
    } else {
      message.error("deleting article failed. please try later!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar searchQuery={""} setSearchQuery={null}/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Articles
            </h1>
          </div>
          <button
            onClick={() => navigate("/create")}
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
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-purple-50 overflow-hidden "
            >
              <div
                className="relative h-48 cursor-pointer"
                onClick={() => navigate(`/article/${article._id}`)}
              >
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

                <h3
                  className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2 cursor-pointer"
                  onClick={() => navigate(`/article/${article._id}`)}
                >
                  {article.title}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{article.likesCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
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

                  <Popconfirm
                    title="Delete Article"
                    description={`Are you sure about delete this article ?`}
                    onConfirm={() => handleDelete(article._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2 text-sm font-semibold">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </Popconfirm>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start writing your first article!
            </p>
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
