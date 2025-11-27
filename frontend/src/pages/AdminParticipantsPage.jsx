import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import DataTable from '../components/DataTable'
import Button from '../components/Button'
import Input from '../components/Input'
import { getParticipants, deleteParticipant } from '../services/adminApi'

function AdminParticipantsPage() {
  const navigate = useNavigate()
  const [participants, setParticipants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfile, setSelectedProfile] = useState('')

  useEffect(() => {
    loadParticipants()
  }, [selectedProfile])

  const loadParticipants = async () => {
    try {
      setIsLoading(true)
      const filters = {}
      if (selectedProfile) filters.perfil = selectedProfile
      
      const data = await getParticipants('ESPOCH_2025', filters)
      setParticipants(data.participants || data || [])
    } catch (error) {
      console.error('Error loading participants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (row) => {
    const nombre = row.nombre || row.email || row.id
    if (!window.confirm(`¿Eliminar el registro de "${nombre}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      const evento = row.evento || 'ESPOCH_2025'
      await deleteParticipant(evento, row.id)
      // Recargar lista después de eliminar
      await loadParticipants()
    } catch (error) {
      console.error('Error eliminando participante:', error)
      alert('No se pudo eliminar el participante. Intenta nuevamente.')
    }
  }

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'carrera',
      label: 'Carrera',
    },
    {
      key: 'perfil',
      label: 'Perfil',
      render: (value, row) => {
        const perfil = row.perfil?.nombre || row.perfil_codigo || 'N/A'
        return (
          <span className="px-2 py-1 bg-bit-green-light text-bit-black rounded text-xs font-medium">
            {perfil}
          </span>
        )
      },
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) => {
        if (!value) return 'N/A'
        return (
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">{'⭐'.repeat(value)}</span>
            <span className="text-xs text-gray-600">({value})</span>
          </div>
        )
      },
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value) => {
        if (!value) return 'N/A'
        return new Date(value).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_value, row) => (
        <button
          onClick={() => handleDelete(row)}
          className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      ),
    },
  ]

  const uniqueProfiles = [
    ...new Set(participants.map((p) => p.perfil?.nombre || p.perfil_codigo).filter(Boolean)),
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bit-black">
              Lista de Participantes
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredParticipants.length} participante(s) encontrado(s)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Buscar"
              name="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o email..."
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Perfil
              </label>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-bit-green focus:ring-2 focus:ring-bit-green-light outline-none"
              >
                <option value="">Todos los perfiles</option>
                {uniqueProfiles.map((profile) => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando participantes...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredParticipants} />
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminParticipantsPage
