import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { message } from "antd";
import { GridBackground } from "../components/gridBackground";
import { FormInput } from "../components/FormInput";
import { getCategories, signupUser } from "../services/apis/userApi";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../redux/slices/userSlice";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    preferences: string[];
  }>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: []
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferences: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [category,setCategories] = useState<any>([]);

  useEffect(()=>{

    let fetchingCategories = async ()=>{
      const response = await getCategories();
      if(response.categories.length){
        setCategories(response.categories)
      }
    };

    fetchingCategories()
    
  },[])

  const availablePreferences = ['Sports', 'News', 'Health', 'Technology', 'Business', 'Entertainment', 'Science', 'Politics'];

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.firstName = 'First name must be less than 50 characters';
        } else {
          newErrors.firstName = '';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.lastName = 'Last name must be less than 50 characters';
        } else {
          newErrors.lastName = '';
        }
        break;
      case 'phone':
        const phoneRegex = /^[0-9]{10}$/;
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(value.trim())) {
          newErrors.phone = 'Enter a valid 10-digit phone number';
        } else {
          newErrors.phone = '';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = 'Enter a valid email';
        } else if (value.trim().length > 100) {
          newErrors.email = 'Email must be less than 100 characters';
        } else {
          newErrors.email = '';
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (value.length > 128) {
          newErrors.password = 'Password must be less than 128 characters';
        } else {
          newErrors.password = '';
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword) {
          newErrors.confirmPassword = '';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirm password is required';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          newErrors.confirmPassword = '';
        }
        break;
      case 'preferences':
        if (value.length !== 3) {
          newErrors.preferences = 'Select exactly 3 preferences';
        } else {
          newErrors.preferences = '';
        }
        break;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = validateField('firstName', formData.firstName) &&
                      validateField('lastName', formData.lastName) &&
                      validateField('phone', formData.phone) &&
                      validateField('email', formData.email) &&
                      validateField('password', formData.password) &&
                      validateField('confirmPassword', formData.confirmPassword) &&
                      validateField('preferences', formData.preferences);

      if (!isValid) {
        message.error("Please fix the form errors");
        return;
      }

      const response = await signupUser(formData);
      if (response) {
        dispatch(logoutUser());
        dispatch(loginUser({ user: response }));
        message.success("Signed up successfully");
        navigate("/user/home");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorCode = error.code || "SERVER_ERROR";
      switch (errorCode) {
        case "USER_EXISTS":
          setErrors(prev => ({ ...prev, email: "This email is already registered" }));
          break;
        case "PASSWORD_MISMATCH":
          setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
          break;
        case "MISSING_FIELDS":
          message.error("Please provide all required fields");
          break;
        default:
          message.error(error.message || "Failed to sign up");
      }
    }
   
  };


  const togglePreference = (pref: string) => {
    let newPreferences: string[];
    if (formData.preferences.includes(pref)) {
      newPreferences = formData.preferences.filter(p => p !== pref);
    } else if (formData.preferences.length < 3) {
      newPreferences = [...formData.preferences, pref];
    } else {
      return; // Prevent adding more than 3 preferences
    }
    setFormData({ ...formData, preferences: newPreferences });
    validateField('preferences', newPreferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative py-8 sm:py-12">
      <GridBackground />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10"
        >
          <button 
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:text-purple-700 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base"
          >
            ← Back
          </button>
          
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Join <span className="text-md sm:text-base font-bold text-violet-600">Thinklet</span> and start sharing your ideas
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="John"
                maxLength={50}
              />
              <FormInput
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Doe"
                maxLength={50}
              />
            </div>

            <FormInput
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="1234567890"
              maxLength={10}
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              maxLength={100}
            />

            <FormInput
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Min 8 characters"
              maxLength={128}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <FormInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Re-enter password"
              maxLength={128}
              showPasswordToggle={true}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select 3 Preferences ({formData.preferences.length}/3)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {category.map((pref:any) => (
                  <button
                    key={pref._id}
                    type="button"
                    onClick={() => togglePreference(pref._id)}
                    disabled={formData.preferences.length >= 3 && !formData.preferences.includes(pref._id)}
                    className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all text-sm sm:text-base ${
                      formData.preferences.includes(pref._id)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {pref.name}
                  </button>
                ))}
              </div>
              {errors.preferences && <p className="text-red-500 text-xs mt-1">{errors.preferences}</p>}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.values(errors).some(error => error) || !formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword || formData.preferences.length !== 3}
            >
              Sign Up
            </button>
          </div>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-purple-600 hover:text-purple-700 font-medium">
              Login
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};