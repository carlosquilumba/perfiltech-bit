function ProtectedRoute({ children }) {
  // 🔓 Seguridad mínima desactivada temporalmente para desarrollo local.
  // TODO: Re-activar validación de token cuando el login esté funcionando.
  return children
}

export default ProtectedRoute

