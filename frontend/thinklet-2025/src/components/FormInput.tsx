
export const FormInput = ({ label, type = 'text', value, onChange, error, placeholder, name }:any) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-purple-300'
        } focus:outline-none focus:ring-2 transition-all`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};