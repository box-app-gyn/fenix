import { useAuth } from '../hooks/useAuth';

export default function Footer() {
  const { user } = useAuth();

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'admin') {
      alert('Acesso negado. Apenas administradores podem acessar esta área.');
      return;
    }

    // Confirmar se realmente é admin
    const isConfirmed = window.confirm(
      `🔐 Confirmação de Admin\n\n` +
      `Usuário: ${user.displayName || user.email}\n` +
      `Role: ${user.role}\n\n` +
      `Deseja acessar o painel administrativo?`
    );

    if (isConfirmed) {
      window.location.href = '/admin';
    }
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'admin') {
      alert('Acesso negado. Apenas administradores podem acessar esta área.');
      return;
    }

    // Confirmar acesso ao dashboard
    const isConfirmed = window.confirm(
      `📊 Dashboard Administrativo\n\n` +
      `Usuário: ${user.displayName || user.email}\n` +
      `Role: ${user.role}\n\n` +
      `Deseja acessar o dashboard de eventos?`
    );

    if (isConfirmed) {
      window.location.href = '/dashboard-evento';
    }
  };

  const handleDevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'dev') {
      alert('Acesso negado. Apenas desenvolvedores podem acessar esta área.');
      return;
    }

    // Confirmar acesso ao painel de desenvolvimento
    const isConfirmed = window.confirm(
      `🛠️ Painel do Desenvolvedor\n\n` +
      `Usuário: ${user.displayName || user.email}\n` +
      `Role: ${user.role}\n\n` +
      `Deseja acessar o painel de desenvolvimento?`
    );

    if (isConfirmed) {
      window.location.href = '/dev';
    }
  };

  return (
    <footer className="py-6 bg-black text-center">
      {/* Linha visual no topo do footer */}
      <img
        src="/images/twolines.png"
        alt=""
        className="w-full h-3 object-cover select-none pointer-events-none mb-4"
        draggable="false"
        width={400}
        height={12}
      />

      {/* Slogan + Linha lado a lado */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 mt-8 w-full">
        <img
          src="/images/twolines.png"
          alt=""
          className="h-10 md:h-12 max-w-[120px] object-contain select-none pointer-events-none"
          draggable="false"
          width={120}
          height={48}
        />
        <p className="text-lg md:text-2xl font-semibold text-gray-500 font-tech text-center md:text-left leading-tight">
          ᴄᴏᴍᴘᴇᴛɪçãᴏ. ᴄᴏᴍᴜɴɪᴅᴀᴅᴇ. ᴘʀᴏᴘóꜱɪᴛᴏ.
          <br />
          <span className="text-white">Interbox 2025</span>
        </p>
      </div>

      {/* Linha visual compondo com o texto */}
      <img
        src="/images/twolines.png"
        alt=""
        className="w-full h-3 object-cover select-none pointer-events-none my-4"
        draggable="false"
        width={400}
        height={12}
      />

      {/* Footer */}
      <div className="mt-32 text-sm border-t border-neutral-800 pt-6 w-full text-center">
        <p className="text-white">
          © {new Date().getFullYear()} Interbox 2025. Todos os direitos reservados.
        </p>
        <p className="mt-1 italic text-neutral-500">
          Desenvolvido por Protocolo <span className="text-pink-500">NEØ</span>
        </p>
        
        {/* Informações do Admin */}
        {user && user.role === 'admin' && (
          <div className="mt-4 p-3 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/20 rounded-lg max-w-md mx-auto">
            <p className="text-xs text-pink-400 font-medium mb-1">
              🔐 Sessão Administrativa Ativa
            </p>
            <p className="text-xs text-gray-400">
              {user.displayName || user.email} • {user.role}
            </p>
          </div>
        )}
        <div className="mt-4 space-x-4">
          <a
            href="/sobre"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Sobre
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="/home"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Hub
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="/audiovisual"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Audiovisual
          </a>
          {user && (user.role === 'admin' || user.role === 'dev') && (
            <>
              <span className="text-gray-600">•</span>
              <a
                href="/admin"
                onClick={handleAdminClick}
                className="text-xs text-pink-500 hover:text-pink-400 transition-colors font-medium"
                title="Painel Administrativo"
              >
                🔐 Admin
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="/dashboard-evento"
                onClick={handleDashboardClick}
                className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-medium"
                title="Dashboard de Eventos"
              >
                📊 Dashboard
              </a>
            </>
          )}
          {user && user.role === 'dev' && (
            <>
              <span className="text-gray-600">•</span>
              <a
                href="/dev"
                onClick={handleDevClick}
                className="text-xs text-green-500 hover:text-green-400 transition-colors font-medium"
                title="Painel do Desenvolvedor"
              >
                🛠️ Dev
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  )
} 