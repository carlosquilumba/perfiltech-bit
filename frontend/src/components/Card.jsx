function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-card p-6 border border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export default Card

