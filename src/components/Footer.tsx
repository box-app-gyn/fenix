import { useAuth } from '../hooks/useAuth';

export default function Footer() {
  const { user } = useAuth();

  const handleAdminClick = (e: React.MouseEvent) => {
    if (!user || user.role !== 'admin') {
      e.preventDefault();
      window.location.href = '/';
      return;
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
        <div className="mt-4 space-x-4">
          <a
            href="/sobre"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Sobre
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="/hub"
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
          {user && user.role === 'admin' && (
            <>
              <span className="text-gray-600">•</span>
              <a
                href="/admin"
                onClick={handleAdminClick}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Admin
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  )
} 