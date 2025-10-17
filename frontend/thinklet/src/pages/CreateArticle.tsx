import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, X, Trash2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { message } from "antd";
import { z } from "zod";
import {
  createArticle,
  getArticle,
  getCategories,
  updateArticle,
} from "../services/apis/userApi";
import { useSelector } from "react-redux";
import type { IUser } from "../interfaces/user";
import type { ArticleResponseDTO } from "../interfaces/article";

interface CreateArticleProps {
  editMode?: boolean;
}

// Validation schema
const articleSchema = z.object({
  author: z.string().min(1, "User credentials missing, please try again"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .refine((val) => val.trim() === val, {
      message: "No leading or trailing spaces allowed",
    }),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be at most 2000 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  thumbnail: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
});

type ArticleData = z.infer<typeof articleSchema>;

interface RootState {
  user: {
    user: IUser;
  };
}

interface Category {
  _id: string;
  name: string;
}

export const CreateArticle = ({ editMode = false }: CreateArticleProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const { articleId } = useParams<{ articleId: string }>();
  const [articleForEdit, setArticleForEdit] =
    useState<ArticleResponseDTO | null>(null);
  const [originalThumbnail, setOriginalThumbnail] = useState<string>("");
  const [formData, setFormData] = useState<Partial<ArticleData>>({
    title: "",
    description: "",
    category: "",
    tags: [],
    thumbnail: null,
    author: user?._id || "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ArticleData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ArticleData, boolean>>
  >({});
  const [thumbnailError, setThumbnailError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.categories?.length) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        message.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (editMode && articleId) {
        try {
          const response = await getArticle(articleId, user?._id);
          console.log("Article from frontend:", response);
          const article = response.article;
          setArticleForEdit(article);
          console.log(articleForEdit?.title);
          setFormData({
            title: article.title,
            description: article.description,
            category: article.category._id,
            tags: article.tags || [],
            thumbnail: null, // null means no change
            author: article.author._id,
          });
          if (article.thumbnail) {
            setThumbnailPreview(article.thumbnail);
            setOriginalThumbnail(article.thumbnail);
          }
        } catch (error: any) {
          message.error(error.message || "Failed to fetch article");
        }
      }
    };

    fetchArticle();
  }, [editMode, articleId, user?._id]);

  useEffect(() => {
    const result = articleSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ArticleData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ArticleData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  }, [formData]);

  const handleInputChange = (
    field: keyof ArticleData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    handleInputChange("tags", tags);
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setThumbnailError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setThumbnailError("File size must be less than 5MB");
        return;
      }

      // Revoke previous blob URL if exists
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setThumbnailFile(file);
      setThumbnailPreview(previewUrl);
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailError("");
      setTouched((prev) => ({ ...prev, thumbnail: true }));
    },
    [thumbnailPreview]
  );

  const cancelImage = useCallback(() => {
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview(originalThumbnail || undefined);
    setFormData((prev) => ({ ...prev, thumbnail: null })); // null means no change
    setThumbnailError("");
    setTouched((prev) => ({ ...prev, thumbnail: true }));
  }, [thumbnailPreview, originalThumbnail]);

  const removeImage = useCallback(() => {
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview(undefined);
    setFormData((prev) => ({ ...prev, thumbnail: "" })); // '' means remove
    setThumbnailError("");
    setTouched((prev) => ({ ...prev, thumbnail: true }));
  }, [thumbnailPreview]);

  const handleSubmit = async () => {
    if (!user?._id) {
      message.error("Please log in to create an article");
      navigate("/login");
      return;
    }

    const result = articleSchema.safeParse({ ...formData, author: user._id });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ArticleData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ArticleData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setTouched({
        title: true,
        description: true,
        category: true,
        tags: true,
        thumbnail: true,
        author: true,
      });
      message.error("Please fix the errors before submitting!");
      return;
    }

    if (thumbnailFile) {
      if (thumbnailFile.size > 5 * 1024 * 1024) {
        setThumbnailError("Thumbnail file size exceeds 5MB");
        message.error("Please fix the thumbnail error!");
        return;
      }
      if (!thumbnailFile.type.startsWith("image/")) {
        setThumbnailError("Thumbnail must be an image file");
        message.error("Please fix the thumbnail error!");
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "tags" && Array.isArray(value)) {
          formDataToSend.append(key, value.join(","));
        } else if (key === "thumbnail") {
          if (value instanceof File) {
            formDataToSend.append(key, value);
          } else if (typeof value === "string") {
            formDataToSend.append(key, value);
          }
          // If null, don't append (no change)
        } else if (key === "author") {
          formDataToSend.append(key, user._id);
        } else {
          formDataToSend.append(key, value as string);
        }
      }
    });

    if (editMode && articleId) {
      formDataToSend.append("articleId", articleId);
    }

    try {
      if (editMode) {
        const response = await updateArticle(formDataToSend);
        if (response) {
          message.success("Article updated successfully!");
          navigate("/articles");
        }
      } else {
        const response = await createArticle(formDataToSend);
        if (response) {
          message.success("Article published successfully!");
          navigate("/articles");
        }
      }
    } catch (error: any) {
      console.error("Article operation failed:", error);
      const errorMessage = error.message || "Failed to process article";
      const errorCode = error.code || "SERVER_ERROR";
      switch (errorCode) {
        case "MISSING_FIELDS":
          message.error("Please provide all required fields");
          break;
        default:
          message.error(errorMessage);
      }
    }
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 z-30">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {editMode ? "Edit Article" : "Create New Article"}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter article title..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-lg ${
                  touched.title && errors.title
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.title && errors.title && (
                <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.title}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent ${
                  touched.category && errors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {touched.category && errors.category && (
                <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="thumbnail-upload"
                />
                {!thumbnailPreview ? (
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 bg-gray-50"
                  >
                    <Camera className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload thumbnail
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex gap-3">
                        <label
                          htmlFor="thumbnail-upload"
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors duration-200 text-sm"
                        >
                          <Camera className="w-5 h-5" /> Change
                        </label>
                        {thumbnailFile ? (
                          <button
                            onClick={cancelImage}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm"
                          >
                            <X className="w-5 h-5" /> Cancel
                          </button>
                        ) : (
                          <button
                            onClick={removeImage}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm"
                          >
                            <Trash2 className="w-5 h-5" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {thumbnailError && (
                <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {thumbnailError}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Write your article description here..."
                rows={12}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none ${
                  touched.description && errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.description && errors.description && (
                <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.description}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(", ") || ""}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="AI, Technology, Innovation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                {editMode ? "Update Article" : "Publish Article"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
