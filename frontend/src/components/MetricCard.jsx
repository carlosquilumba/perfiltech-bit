function MetricCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 border-l-4 border-bit-green">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-bit-black">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-4xl text-bit-green-light opacity-50">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard
