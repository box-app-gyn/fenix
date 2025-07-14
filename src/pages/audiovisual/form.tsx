import React, { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAnalytics } from '../../hooks/useAnalytics'

interface FormData {
  nome: string
  email: string
  telefone: string
  cidade: string
  areaAtuacao: string
  experiencia: string
  portfolio: string
  disponibilidade: string
  mensagem: string
}

export default function AudiovisualFormPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    areaAtuacao: '',
    experiencia: '',
    portfolio: '',
    disponibilidade: '',
    mensagem: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { trackPage, trackFormSubmit, trackAudiovisual } = useAnalytics()

  useEffect(() => {
    trackPage('audiovisual_form')
    trackAudiovisual('view_form', 'candidatura_audiovisual')
  }, [trackPage, trackAudiovisual])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await setDoc(doc(db, 'audiovisual', `${Date.now()}-${formData.email}`), {
        ...formData,
        status: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      trackFormSubmit('formulario_audiovisual')
      trackAudiovisual('submit_form', `${formData.areaAtuacao}_${formData.cidade}`)
      setSuccess(true)
      setTimeout(() => window.close(), 3000)
    } catch (err) {
      setError('Erro ao enviar formulário.')
      trackAudiovisual('form_error', 'erro_envio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <head>
        <title>Candidatura Audiovisual - CERRADØ INTERBOX 2025</title>
        <meta name="description" content="Candidate-se para fazer parte..." />
        <meta property="og:image" content="/images/og-interbox.png" />
      </head>

      <div className="min-h-screen bg-white relative overflow-hidden">
        <Header />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto relative z-10">
            {/* Remove next/image do logo — usa <img> */}
            {success ? (
              <div className="text-center py-12 text-2xl font-bold text-green-600">
                🎬 Candidatura Enviada! Fechando...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    required
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label htmlFor="areaAtuacao" className="block text-sm font-medium text-gray-700 mb-2">
                    Área de Atuação *
                  </label>
                  <select
                    id="areaAtuacao"
                    name="areaAtuacao"
                    required
                    value={formData.areaAtuacao}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Selecione uma área</option>
                    <option value="fotografia">Fotografia</option>
                    <option value="video">Vídeo</option>
                    <option value="edicao">Edição</option>
                    <option value="drone">Drone</option>
                    <option value="social_media">Social Media</option>
                    <option value="design">Design</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência *
                  </label>
                  <textarea
                    id="experiencia"
                    name="experiencia"
                    required
                    rows={4}
                    value={formData.experiencia}
                    onChange={handleChange}
                    placeholder="Conte sobre sua experiência na área..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio/Links
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilidade *
                  </label>
                  <select
                    id="disponibilidade"
                    name="disponibilidade"
                    required
                    value={formData.disponibilidade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Selecione</option>
                    <option value="todos_dias">Todos os dias</option>
                    <option value="finais_semana">Finais de semana</option>
                    <option value="flexivel">Horário flexível</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem Adicional
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={3}
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Alguma informação adicional..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <span>Enviando...</span> : 'Enviar Candidatura'}
                </button>
              </form>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
} 