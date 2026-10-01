'use client'

import { db } from '../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import BrandBriefForm from '../components/BrandBriefForm'

interface Client {
  client_name: string
  brand_name: string
  package_name: string
  services?: any
}

export default function ClientPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('')
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBrief, setShowBrief] = useState(false)
  const [envelopeOpened, setEnvelopeOpened] = useState(false)

  useEffect(() => {
    async function loadClient() {
      const { slug: resolvedSlug } = await params
      setSlug(resolvedSlug)

      try {
        const q = query(collection(db, 'clients'), where('slug', '==', resolvedSlug))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setClient(querySnapshot.docs[0].data() as Client)
        }
      } catch (err) {
        console.error('Error loading client:', err)
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [params])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">Cargando...</div>
  }

  if (!client) {
    return <div className="min-h-screen flex items-center justify-center bg-white">Cliente no encontrado</div>
  }

  if (showBrief) {
    return <BrandBriefForm clientName={client.client_name} brandName={client.brand_name} />
  }

  if (!envelopeOpened) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .pulse-animation {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <svg className="w-24 h-24 mx-auto text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Private Invitation</h1>
          <p className="text-lg text-amber-800 mb-8">Haz click para abrir tu invitación</p>
          <button
            onClick={() => setEnvelopeOpened(true)}
            className="bg-amber-900 text-white px-8 py-4 rounded-lg font-bold uppercase hover:bg-amber-800 transition transform hover:scale-105"
          >
            Abrir Invitación
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">ATEREA</div>
          <div></div>
        </div>
      </nav>

      {/* Welcome Section */}
      <section className="min-h-screen flex items-end pt-20 px-6">
        <div className="max-w-4xl mx-auto mb-20 w-full">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-pink-600 mb-6">Welcome to ATEREA</p>
            <h1 className="text-7xl md:text-8xl font-bold leading-tight mb-6">
              HOLA,<br />
              <span className="text-pink-600">{client.client_name}</span>.
            </h1>
            <p className="text-xl text-gray-700 mb-6">Qué bueno tenerte de este lado.</p>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl">
            Tu proyecto con Aterea comienza aquí. Antes de crear, queremos entender tu negocio, tu visión y hacia dónde quieres llevarlo. Porque antes de diseñar, necesitamos entender.
          </p>
        </div>
      </section>

      {/* Dark Section */}
      <section className="bg-gray-900 text-white py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">Private Collaboration</p>
          <h2 className="text-7xl md:text-8xl font-bold leading-tight mb-8">
            YOU'RE<br />
            OFFICIALLY<br />
            IN.
          </h2>
          <p className="text-2xl">
            <span className="text-gray-400">{client.brand_name}</span> <span className="text-orange-500">×</span> ATEREA
          </p>
        </div>
      </section>

      {/* Package Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-600 mb-6">Tu Paquete ATEREA</p>
          <h2 className="text-6xl md:text-7xl font-bold mb-8">THIS IS WHAT WE'RE BUILDING.</h2>
          <p className="text-lg text-gray-600 mb-12">El alcance de tu proyecto:</p>

          <div className="space-y-8 border-t border-gray-200">
            {client.services && Array.isArray(client.services) ? (
              client.services.map((service: any, i: number) => (
                <div key={i} className="py-6 border-b border-gray-200">
                  <p className="text-sm text-pink-600 font-bold uppercase tracking-wide mb-2">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.detail}</p>
                </div>
              ))
            ) : (
              <div className="py-6">
                <p className="text-gray-600">
                  Los servicios se mostrarán aquí cuando se configure el paquete.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-600 mb-6">What Happens Now?</p>
          <h2 className="text-6xl md:text-7xl font-bold mb-4">OK. ¿Y AHORA QUÉ?</h2>
          <h3 className="text-5xl md:text-6xl font-bold text-pink-600 mb-8">CUÉNTANOS TODO DE TI.</h3>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Completa tu Brand Brief y cuéntanos lo que hace diferente a tu marca.
          </p>
          <button
            onClick={() => setShowBrief(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-pink-600 transition text-lg"
          >
            START MY BRAND BRIEF →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-8">Descubre más sobre nosotros</p>
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest">Contacto</p>
            <a href="https://aterea.agency" className="text-gray-400 hover:text-white transition">
              www.aterea.agency
            </a>
            <a href="https://instagram.com/aterea.agency" className="block text-gray-400 hover:text-white transition">
              IG: @aterea.agency
            </a>
            <a href="tel:2311386494" className="block text-gray-400 hover:text-white transition">
              TEL. 2311386494
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
