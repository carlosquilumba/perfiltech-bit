function Input({ 
  label, 
  name,
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  error = null
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-dark mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 rounded-md border-2 text-base transition-all duration-200 ${
          error 
            ? 'border-state-error focus:border-state-error focus:ring-2 focus:ring-state-error/20' 
            : 'border-gray-200 focus:border-bit-green focus:ring-2 focus:ring-bit-green/20'
        } outline-none bg-white`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Input


