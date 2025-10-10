import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { GridBackground } from "../components/gridBackground";
import { FormInput } from "../components/FormInput";
import thinkletLogo from "../assets/thinklet.png";
import { loginUser } from "../services/apis/userApi";
import { useDispatch } from "react-redux";
import { logoutUser, loginUser as welcome } from "../redux/slices/userSlice";
import { message } from "antd";

export const Login = () => {
const navigate = useNavigate();
const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'emailOrPhone':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        if (!value.trim()) {
          newErrors.emailOrPhone = 'Email or phone number is required';
        } else if (!emailRegex.test(value.trim()) && !phoneRegex.test(value.trim())) {
          newErrors.emailOrPhone = 'Enter a valid email or 10-digit phone number';
        } else if (value.trim().length > 100) {
          newErrors.emailOrPhone = 'Input must be less than 100 characters';
        } else {
          newErrors.emailOrPhone = '';
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

  const handleSubmit = async() => {
    const isValid = validateField('emailOrPhone', formData.emailOrPhone) &&
                    validateField('password', formData.password);

    if (isValid) {

      try{

        const response = await loginUser(formData);
      if (response) {
        dispatch(logoutUser());
        dispatch(welcome({ user: response.user }));
        message.success("Signed up successfully");
        navigate("/user/home");
      }
      }catch(error:any){
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

    
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative flex items-center py-8 sm:py-12">
      <GridBackground />
      
      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 w-full">
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
            <div className="flex justify-center mb-4">
              <img className="w-48" src={thinkletLogo} alt="Thinklet Logo" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-sm sm:text-base text-gray-600">Login to continue your journey</p>
          </div>

          <div className="space-y-5">
            <FormInput
              label="Email or Phone"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              error={errors.emailOrPhone}
              placeholder="Enter email or phone number"
              maxLength={100}
            />

            <FormInput
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              maxLength={128}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.values(errors).some(error => error) || !formData.emailOrPhone || !formData.password}
            >
              Login
            </button>
          </div>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-purple-600 hover:text-purple-700 font-medium">
              Sign Up
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};