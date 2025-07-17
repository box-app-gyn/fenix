
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

export default function Termos() {
  return (
    <>
      <SEOHead 
        title="Termos e Condições - CERRADØ INTERBOX 2025" 
        description="Termos e condições de participação do CERRADØ INTERBOX 2025." 
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 pt-24">
        <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-pink-500/20">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            🧾 Termos e Condições de Participação
          </h1>
          <h2 className="text-xl font-semibold mb-2 text-center">CERRADØ INTERBOX 2025</h2>
          <p className="text-center text-sm text-gray-300 mb-6">
            Ginásio Rio Vermelho – 24 a 26 de outubro de 2025<br/>
            Última atualização: 27/01/2025
          </p>
          <hr className="border-gray-700 mb-6" />

          <h3 className="text-lg font-bold mb-2 text-pink-400">1. 💪 Participação e Responsabilidades</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>Ao confirmar sua inscrição no CERRADØ INTERBOX 2025, o(a) atleta declara estar em plenas condições físicas e mentais para participar da competição.</li>
            <li>A organização <b>não se responsabiliza por acidentes, lesões ou complicações médicas decorrentes da participação</b>, sendo de responsabilidade exclusiva do atleta manter exames e acompanhamento médico atualizados.</li>
            <li>Atletas menores de 18 anos devem apresentar <b>autorização expressa dos responsáveis legais</b>.</li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">2. 🔐 Termos de Inscrição e Pagamento</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>A inscrição será considerada válida somente após a confirmação do pagamento via FlowPay ou canais oficiais autorizados.</li>
            <li>O valor pago <b>não será reembolsado</b> em caso de desistência, ausência ou desclassificação, exceto nos casos previstos no item 3.</li>
            <li>O time inscrito poderá ser substituído ou alterado dentro do prazo estipulado pela organização, mediante regras do lote vigente.</li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">3. 🔄 Cancelamento e Reembolso</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>Cancelamentos solicitados até 15 dias antes do evento poderão receber <b>crédito integral</b> em futuras edições, desde que justificados por meio de documentação médica ou emergencial.</li>
            <li>Após esse prazo, <b>não haverá reembolso</b>. Casos extraordinários serão avaliados pela organização.</li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">4. 📸 Direito de Imagem</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>Ao participar do evento, o(a) atleta autoriza o uso de sua <b>imagem, voz e nome</b> em todo e qualquer material publicitário, institucional ou promocional vinculado ao CERRADØ INTERBOX 2025, incluindo redes sociais, TV, site e peças impressas.</li>
            <li>Essa autorização é concedida <b>de forma gratuita, por tempo indeterminado e em caráter irrevogável</b>.</li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">5. 📜 Regras de Conduta e Penalidades</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>O(a) atleta se compromete a manter conduta ética, respeitosa e segura durante todo o evento, com atletas, árbitros, staff e público.</li>
            <li><b>São motivos para desclassificação imediata</b>:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Uso de substâncias proibidas;</li>
                <li>Conduta agressiva ou desrespeitosa;</li>
                <li>Fraude na inscrição ou substituição de atletas sem comunicação;</li>
                <li>Descumprimento deliberado dos padrões de movimento e regulamento.</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">6. 📘 Regulamento Técnico</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>Todas as categorias devem seguir os <b>padrões de movimento, time caps e estruturas de WODs</b> previstos no Regulamento Oficial do evento.</li>
            <li>O regulamento técnico completo está disponível no <a href="https://drive.google.com/file/d/1wLnETYONkPjPWYjEd2dib9pEJFvvCsag/view?usp=sharing" className="underline text-pink-400 hover:text-pink-300 transition-colors" target="_blank" rel="noopener noreferrer">link do regulamento</a> e pode ser atualizado a qualquer momento com aviso prévio.</li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">7. ⚠️ Riscos e Isenção de Responsabilidade</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>O(a) atleta declara estar ciente de que <b>o CrossFit é uma atividade física de alto rendimento</b>, envolvendo esforço físico intenso, levantamento de peso, obstáculos e exposições climáticas.</li>
            <li>Participar do evento é uma <b>decisão pessoal e voluntária</b>, e a organização não se responsabiliza por danos físicos, emocionais ou materiais durante a competição.</li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">8. 📱 Informações Oficiais</h3>
          <ul className="mb-4 list-disc pl-6 text-gray-200 space-y-2">
            <li>A organização se comunica exclusivamente pelos canais oficiais:</li>
            <li>Instagram: <a href="https://www.instagram.com/cerradointerbox" className="underline text-pink-400 hover:text-pink-300 transition-colors" target="_blank" rel="noopener noreferrer">@cerradointerbox</a></li>
            <li>Site: <a href="https://cerradointerbox.com" className="underline text-pink-400 hover:text-pink-300 transition-colors" target="_blank" rel="noopener noreferrer">cerradointerbox.com</a></li>
            <li>Comunidade WhatsApp: <a href="https://chat.whatsapp.com/FHTqm0l36kc7RWYWMw1Kiz" className="underline text-pink-400 hover:text-pink-300 transition-colors" target="_blank" rel="noopener noreferrer">link de acesso</a></li>
          </ul>

          <h3 className="text-lg font-bold mb-2 text-pink-400">9. ✅ Aceite</h3>
          <blockquote className="border-l-4 border-pink-500 pl-4 italic text-pink-200 bg-pink-900/10 py-2 rounded-r">
            Ao confirmar minha inscrição, declaro que li, compreendi e <b>aceito integralmente</b> todos os termos acima, assumindo responsabilidade pelas decisões, consequências e experiências vividas durante o CERRADØ INTERBOX 2025.
          </blockquote>
        </div>
      </div>
      <Footer />
    </>
  );
} 