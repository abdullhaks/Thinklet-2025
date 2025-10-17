import { useState } from "react";
import { FormInput } from "./FormInput"
import { X } from "lucide-react";
import { changePassword } from "../services/apis/userApi";
import { message } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";


function PasswordChange({setPasswordModalOpen}:{setPasswordModalOpen:any}) {
    
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const user = useSelector((state: RootState) => state.user.user);



    const [formData, setFormData] = useState<{
    userId: string;
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }>({
    userId: user?._id || '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });
const [errors, setErrors] = useState<{ [key: string]: string }>({});




    
const validateField = (name: string, value: any) => {
        const newErrors = { ...errors };
    
        switch (name) {

          case 'oldPassword':
            if (!value) {
              newErrors.oldPassword = 'old Password is required';
            } else if (value.length < 8) {
              newErrors.oldPassword = 'old Password must be at least 8 characters';
            } else if (value.length > 128) {
              newErrors.oldPassword = 'old Password must be less than 128 characters';
            } else {
              newErrors.oldPassword = '';
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
      const isValid = validateField('password', formData.password) &&
                      validateField('confirmPassword', formData.confirmPassword)&&
                      validateField('oldPassword', formData.oldPassword);

      if (!isValid) {
        message.error("Please fix the form errors");
        return;
      }

      const response = await changePassword(formData);
      if (response) {
        message.success("Password changed successfully");
        setPasswordModalOpen(false);
      }
    } catch (error: any) {
      console.error("password changing error:", error);
      const errorCode = error.code || "SERVER_ERROR";
      switch (errorCode) {
        case "INVALID_OLD_PASSWORD":
          setErrors(prev => ({ ...prev, oldPassword: "old password not matching" }));
          break;
        case "PASSWORD_MISMATCH":
          setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
          break;
       
        default:
          message.error(error.message || "Failed to change password");
      }
    }
   
  };

  
    
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto relative transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Change Password
          </h2>
          <button
            onClick={()=> setPasswordModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-5 sm:space-y-6">

            <FormInput
                label="Old Password"
                type={"text"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                error={errors.oldPassword}
                placeholder="Min 8 characters"
                maxLength={128}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
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


          </div>


          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={()=>setPasswordModalOpen(false)}
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


  )
}

export default PasswordChange