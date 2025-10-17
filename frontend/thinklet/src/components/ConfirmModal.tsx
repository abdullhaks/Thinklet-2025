import React from "react";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
      <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl max-w-xs sm:max-w-sm md:max-w-md w-full border border-gray-100">
        <p className="text-gray-800 text-base sm:text-lg md:text-xl font-medium mb-4 sm:mb-6 leading-relaxed text-center">
          {message}
        </p>
        <div className="flex justify-center sm:justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 sm:px-6 sm:py-3 min-h-[44px] bg-gray-200 text-gray-700 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 sm:px-6 sm:py-3 min-h-[44px] bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:from-red-600 hover:to-red-700 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
            aria-label="Confirm Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
