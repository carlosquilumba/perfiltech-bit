function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  type = 'button'
}) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200'
  
  const variantClasses = {
    primary: 'bg-bit-green text-bit-black hover:bg-bit-green-hover active:scale-95 shadow-md hover:shadow-lg',
    secondary: 'bg-bit-black text-white hover:bg-gray-800 active:scale-95 shadow-md hover:shadow-lg',
    outline: 'bg-transparent text-bit-black border-2 border-bit-green hover:bg-bit-green hover:text-bit-black active:scale-95'
  }
  
  const widthClasses = fullWidth ? 'w-full' : ''
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${disabledClasses}`}
    >
      {children}
    </button>
  )
}

export default Button


