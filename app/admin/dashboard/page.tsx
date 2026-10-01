'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

interface Client {
  id: string
  slug: string
  client_name: string
  brand_name: string
  package_name: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    brand_name: '',
    slug: '',
    package_name: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin')
    }

    loadClients()
  }, [router])

  const loadClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'clients'))
      const clientsList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as Client[]
      setClients(clientsList)
    } catch (err) {
      console.error('Error loading clients:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.client_name || !formData.brand_name || !formData.slug || !formData.package_name) {
      setError('Todos los campos son requeridos')
      return
    }

    try {
      await addDoc(collection(db, 'clients'), {
        ...formData,
        created_at: new Date().toISOString(),
      })

      setSuccess('Cliente creado exitosamente')
      setFormData({
        client_name: '',
        brand_name: '',
        slug: '',
        package_name: '',
      })
      setShowForm(false)
      loadClients()
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    router.push('/admin')
  }

  const copyLink = (slug: string) => {
    const link = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(link)
    alert('Link copiado: ' + link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">ATEREA Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Create Client Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-6 py-3 rounded font-semibold uppercase tracking-wide hover:bg-pink-600 transition"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Cliente'}
          </button>

          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
              <h2 className="text-2xl font-bold mb-6">Crear Nuevo Cliente</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre del Cliente *</label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-600"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre de la Marca *</label>
                    <input
                      type="text"
                      value={formData.brand_name}
                      onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-600"
                      placeholder="Ej: Mi Negocio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Slug (URL) *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-600"
                      placeholder="Ej: mi-negocio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Paquete *</label>
                    <input
                      type="text"
                      value={formData.package_name}
                      onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-600"
                      placeholder="Ej: Branding + Web"
                    />
                  </div>
                </div>

                {error && <p className="text-red-600 font-semibold">{error}</p>}

                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded font-semibold uppercase tracking-wide hover:bg-pink-600 transition"
                >
                  Crear Cliente
                </button>
              </form>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-6">
              {success}
            </div>
          )}
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Clientes ({clients.length})</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-600">Cargando clientes...</div>
          ) : clients.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No hay clientes creados aún</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Marca</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Paquete</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Link</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{client.client_name}</td>
                      <td className="px-6 py-4">{client.brand_name}</td>
                      <td className="px-6 py-4">{client.package_name}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => copyLink(client.slug)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Copiar link
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(client.created_at).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
