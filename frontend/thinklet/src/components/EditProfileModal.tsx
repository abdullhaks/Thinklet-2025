import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { z } from 'zod';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: any) => void;
  initialData: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferences: string[];
  };
  availablePreferences: any[];
}

const profileSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50, "First name must be at most 50 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50, "Last name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890)").optional().or(z.literal("")),
  preferences: z.array(z.string()).min(3, "Select at least 3 interests").max(5, "Select at most 5 interests"),
});

const EditProfileModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  availablePreferences,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error: string | undefined;
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.trim().length < 2) error = "First name must be at least 2 characters";
        else if (value.trim().length > 50) error = "First name must be at most 50 characters";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (value.trim().length < 2) error = "Last name must be at least 2 characters";
        else if (value.trim().length > 50) error = "Last name must be at most 50 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
        break;
      case "phone":
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) error = "Invalid phone number format";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error ?? "" }));
  };

  const togglePreference = (pref: string) => {
    let newPreferences: string[];
    if (formData.preferences.includes(pref)) {
      newPreferences = formData.preferences.filter((p: string) => p !== pref);
    } else if (formData.preferences.length < 5) {
      newPreferences = [...formData.preferences, pref];
    } else {
      return;
    }
    setFormData({ ...formData, preferences: newPreferences });
    const error = newPreferences.length < 3 ? "Select at least 3 interests" : undefined;
    setErrors((prev) => ({ ...prev, preferences: error ?? "" }));
  };

  const validateForm = (): boolean => {
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto relative transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-5 sm:space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1234567890"
                className={`w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Preferences */}
            <div>
              <label
                htmlFor="preferences"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
              >
                Interests (Select 3 to 5) - {formData.preferences.length}/5
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availablePreferences.map((pref: any) => (
                  <button
                    key={pref._id}
                    onClick={() => togglePreference(pref._id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                      formData.preferences.includes(pref._id)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {pref.name}
                  </button>
                ))}
              </div>
              {errors.preferences && (
                <p className="mt-1 text-sm text-red-600">{errors.preferences}</p>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;