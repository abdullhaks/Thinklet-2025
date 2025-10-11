// src/pages/Profile.tsx (Settings)
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GridBackground } from "../components/gridBackground";
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { type IUser } from '../interfaces/user';

export const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IUser>({
    _id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    preferences: ['Technology', 'Health', 'Sports'],
  });

  const availablePreferences = ['Sports', 'News', 'Health', 'Technology', 'Business', 'Entertainment', 'Science', 'Politics'];

  const togglePreference = (pref: string) => {
    if (formData.preferences.includes(pref)) {
      setFormData({ ...formData, preferences: formData.preferences.filter(p => p !== pref) });
    } else if (formData.preferences.length < 5) {
      setFormData({ ...formData, preferences: [...formData.preferences, pref] });
    }
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <GridBackground />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Settings</h1>

          {/* Profile Picture */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{formData.firstName.charAt(0)}</span>
              </div>
              <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Change Photo</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            />
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Interests (Select up to 5) - {formData.preferences.length}/5
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availablePreferences.map((pref) => (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                    formData.preferences.includes(pref)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};