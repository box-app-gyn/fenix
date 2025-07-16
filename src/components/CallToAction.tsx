import { motion } from 'framer-motion'
import { useState } from 'react'

export function AudiovisualInvite() {
  return (
    <section className="w-full py-8 bg-black border-t border-neutral-700 flex flex-col items-center justify-center">
      <h1 className="text-xl md:text-3xl font-bold text-white mb-1 text-center">
        Fotógrafos, videomakers, criadores e mídia:
      </h1>
      <h3 className="text-base md:text-xl font-bold text-white mb-4 text-center">
        Quer fazer parte da cobertura oficial do evento?
      </h3>
      <p className="text-base md:text-lg text-pink-600 mb-4 text-center">
        Clique abaixo e saiba mais!
      </p>
      <a
        href="/audiovisual"
        className="inline-block bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25 text-lg"
      >
        Quero participar
      </a>
    </section>
  )
}

export default function CallToAction() {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    categoria: 'patrocinador',
    valor: '',
    mensagem: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
    setFormData({
      nome: '',
      empresa: '',
      email: '',
      telefone: '',
      categoria: 'patrocinador',
      valor: '',
      mensagem: '',
    })
  }

  return (
    <section id="patrocinadores" className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Sua marca no centro da força.
            </h2>
            <p className="text-xl md:text-2xl text-neutral-300 mb-6 leading-relaxed">
              O Cerrado Interbox 2025 será o maior palco do fitness competitivo na América Latina.
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Alcance, comunidade e presença física com impacto real.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 relative overflow-hidden"
          >
            <img
              src="/images/corner.png"
              alt=""
              className="absolute top-0 left-0 w-32 h-auto z-10 select-none pointer-events-none"
              draggable="false"
            />
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Seja um Patrocinador
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Empresa *</label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Telefone *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Tipo de Parceria *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  <option value="patrocinador">Patrocinador</option>
                  <option value="apoiador">Apoiador</option>
                  <option value="parceiro">Parceiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Mensagem</label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
                  placeholder="Conte-nos sobre sua proposta de parceria..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-pink-600 text-white text-lg font-semibold rounded-xl shadow-[0_0_20px_#E50914] hover:shadow-[0_0_40px_#E50914] transition-all duration-300 hover:bg-pink-700"
              >
                ENVIAR PROPOSTA
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
