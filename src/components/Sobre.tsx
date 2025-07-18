
import { motion } from "framer-motion";

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="relative py-20 px-6 md:px-16 text-white"
      style={{
        backgroundImage: "url(/images/bg_1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            🔥 CERRADO INTERBØX 2025
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            SOBRE O EVENTO
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl leading-relaxed mb-8 text-center"
        >
          <p className="mb-6">
            O Cerrado Interbøx é o maior evento de times de CrossFit da América Latina. Em 2025, chega à sua 9ª edição com um projeto ousado, disruptivo e com o Cerrado como tema central. Mais do que uma competição, o Interbøx é uma celebração da comunidade crossfiteira: une atletas, árbitros, marcas, expositores, mídia e torcida em uma experiência única, que mistura esporte, tecnologia e entretenimento.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-4 text-center">📅 Informações Gerais</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <strong>Data:</strong> 24, 25 e 26 de outubro de 2025
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <strong>Local:</strong> Ginásio Rio Vermelho – Goiânia/GO
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <strong>Público estimado:</strong> 6.000 pessoas
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">💪</span>
                <div>
                  <strong>Times participantes:</strong> 100
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏋️‍♀️</span>
                <div>
                  <strong>Atletas previstos:</strong> +1.000
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏷️</span>
                <div>
                  <strong>Box participantes:</strong> +100 afiliados
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-4 text-center">🏟️ Estrutura da Arena</h3>
            <div className="space-y-2 text-left">
              <div>• Arena externa e interna</div>
              <div>• Espaço recovery</div>
              <div>• Training Center</div>
              <div>• Espaço pet</div>
              <div>• Praça de alimentação</div>
              <div>• Expositores, lojas e muito mais</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-center">🎥 Transmissão ao Vivo</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Equipe profissional:</h4>
              <ul className="space-y-1">
                <li>• Narradores e repórteres</li>
                <li>• Câmeras em 4K</li>
                <li>• Drones</li>
                <li>• Integração com redes sociais</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ativações interativas:</h4>
              <ul className="space-y-1">
                <li>• QR Code</li>
                <li>• Campanhas de engajamento</li>
                <li>• Tempo real</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">🌐 Plataforma de Visibilidade</h3>
            <p className="text-lg leading-relaxed">
              O evento também é uma plataforma de visibilidade para marcas e patrocinadores, com oportunidades de exposição digital e física, geração de negócios, e ações diretamente com o público-alvo.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
