import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Copy, Eye, Save } from "lucide-react";
import { Navbar } from "../components/Navbar";
import type { RootState } from "../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import {
  getCategories,
  updateProfile,
  updateProfileImage,
} from "../services/apis/userApi";
import { updateUser } from "../redux/slices/userSlice";
import { z } from "zod";
import { message } from "antd";
import EditProfileModal from "../components/EditProfileModal";
import PasswordChange from "../components/PasswordChange";

// Define Zod schema for validation
const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Invalid phone number format (e.g., +1234567890)"
    )
    .optional()
    .or(z.literal("")),
  preferences: z
    .array(z.string())
    .min(3, "Select at least 3 interests")
    .max(5, "Select at most 5 interests"),
});

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [profileData, setProfileData] = useState<any>({
    _id: user?._id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    preferences: user?.preferences.map((item: any) => item._id) || [],
    profile: user?.profile || "",
  });
  const [availablePreferences, setAvailablePreferences] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    profileData.profile || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    const fetchingCategories = async () => {
      const response = await getCategories();
      if (response.categories.length) {
        setAvailablePreferences(response.categories);
      }
    };
    fetchingCategories();
  }, []);

  useEffect(() => {
    // Update profileData when user changes (e.g., after profile update)
    setProfileData({
      _id: user?._id || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      preferences: user?.preferences.map((item: any) => item._id) || [],
      profile: user?.profile || "",
    });
    setPreviewImage(user?.profile || null);
  }, [user]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, profilePic: "File must be an image" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "Image size must be less than 5MB",
        }));
        return;
      }
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profilePic: "" }));
    }
  };

  const handleCancelImageUpdate = () => {
    setSelectedImage(null);
    setPreviewImage(profileData.profile || null);
    setErrors((prev) => ({ ...prev, profilePic: "" }));
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    message.loading("Profile updating...");
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profile", selectedImage);
      formData.append("userId", user?._id || "");

      const response = await updateProfileImage(formData);
      const updatedUser = response.userData;

      dispatch(updateUser(updatedUser));
      message.success("Profile image updated!");
    } catch (error) {
      message.error("Failed to update image.");
    } finally {
      setIsUploading(false);
      handleCancelImageUpdate();
    }
  };

  const handleCopyReferID = () => {
    navigator.clipboard.writeText(
      `www.thinklet.abdullhakalamban.online/id:${profileData._id}`
    );
    message.success("Refer ID copied to clipboard!");
  };

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      const result = profileSchema.safeParse(updatedData);
      if (!result.success) {
        const fieldErrors: { [key: string]: string } = {};
        result.error.issues.forEach((err) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const response = await updateProfile(updatedData);
      const updatedUser = response.userData;

      dispatch(updateUser(updatedUser));
      setProfileData(updatedUser);
      message.success("Profile updated successfully!");
      setIsEditProfileModalOpen(false);
    } catch (error) {
      message.error("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchQuery={""} setSearchQuery={null}/>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Profile
            </h1>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex-shrink-0">
                {previewImage || user?.profile ? (
                  <img
                    src={previewImage || user?.profile}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-purple-100 shadow-md"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-6xl">
                      {String(
                        profileData.firstName.charAt(0)
                      ).toLocaleUpperCase()}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-purple-500 text-white rounded-full shadow-md cursor-pointer hover:bg-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-purple-300">
                  <Camera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                {Object.values(errors).map((item, idx) => (
                  <p key={idx} className="text-red-600 text-sm">
                    {item}
                  </p>
                ))}
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <div className="mt-2 sm:mt-3 space-y-2 text-gray-600">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[300px]">
                      referral: www.thinklet.abdullhakalamban.online/id:
                      {profileData._id}
                    </span>
                    <button
                      onClick={handleCopyReferID}
                      className="p-1.5 text-purple-500 hover:text-purple-700 rounded-full hover:bg-purple-50 transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
                      title="Copy Refer ID"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[300px]">
                      interests:{" "}
                      {profileData.preferences
                        .map(
                          (id: string) =>
                            availablePreferences.find((p: any) => p._id === id)
                              ?.name || ""
                        )
                        .filter(Boolean)
                        .join(", ") || "None"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedImage && (
                <div className="flex flex-col items-center gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={handleSaveImage}
                    disabled={isUploading}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-all disabled:opacity-50 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {isUploading ? "Saving..." : "Save Image"}
                  </button>
                  <button
                    onClick={handleCancelImageUpdate}
                    disabled={isUploading}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="mt-4 sm:mt-0 sm:ml-auto ">
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 mb-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <Save size={16} />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setPasswordModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <Eye size={16} />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                <p className="text-sm sm:text-base text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">
                  {profileData.email || "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                <p className="text-sm sm:text-base text-gray-900 truncate">
                  {profileData.phone || "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-500">Interests</p>
                <p className="text-sm sm:text-base text-gray-900">
                  {profileData.preferences
                    .map(
                      (id: string) =>
                        availablePreferences.find((p: any) => p._id === id)
                          ?.name || ""
                    )
                    .filter(Boolean)
                    .join(", ") || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={handleProfileUpdate}
          initialData={{
            userId: user?._id || "",
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            phone: profileData.phone,
            preferences: profileData.preferences,
          }}
          availablePreferences={availablePreferences}
        />
      </div>

      {isPasswordModalOpen && (
        <PasswordChange setPasswordModalOpen={setPasswordModalOpen} />
      )}
    </div>
  );
};
