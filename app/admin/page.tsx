'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Contraseña admin: aterea2024
    if (password === 'aterea2024') {
      localStorage.setItem('admin-token', 'authenticated')
      router.push('/admin/dashboard')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">ATEREA</h1>
        <p className="text-center text-gray-600 mb-8">Admin Panel</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 py-2 focus:outline-none focus:border-pink-600"
              placeholder="Ingresa la contraseña"
            />
          </div>

          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded font-semibold uppercase tracking-wide hover:bg-pink-600 transition mt-6"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Contraseña por defecto: aterea2024
        </p>
      </div>
    </div>
  )
}
