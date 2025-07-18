import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { useTransitionNavigate } from './useTransitionNavigate';

export const useRoleRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useTransitionNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Evitar múltiplas execuções simultâneas
      if (isRedirecting) {
        console.log('🔄 useRoleRedirect: Redirecionamento já em andamento, ignorando...');
        return;
      }
      console.log('🔄 useRoleRedirect: Iniciando verificação...', {
        hasUser: !!user,
        loading,
        userEmail: user?.email,
        userRole: user?.role,
        currentPath: location.pathname,
      });

      if (!user || loading) {
        console.log('🔄 useRoleRedirect: Aguardando usuário ou loading...', {
          hasUser: !!user,
          loading,
        });
        return;
      }

              // Se estamos na página de login e já temos usuário, redirecionar para /hub
        if (location.pathname === '/login') {
          console.log('🔄 useRoleRedirect: Na página de login com usuário logado, redirecionando para /hub');
          setIsRedirecting(true);
          navigate('/hub', { replace: true });
          return;
        }

      console.log('🎯 useRoleRedirect: Verificando perfil do usuário...', {
        uid: user.uid,
        email: user.email,
        role: user.role,
        profileComplete: user.profileComplete,
      });

      try {
        console.log('🔍 useRoleRedirect: Buscando dados no Firestore...', { uid: user.uid });
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        const data = snap.data();

        console.log('📊 useRoleRedirect: Dados do usuário:', {
          exists: snap.exists(),
          profileComplete: data?.profileComplete,
          categoria: data?.categoria,
          role: data?.role,
          isActive: data?.isActive,
          displayName: data?.displayName,
        });

        console.log('🎯 useRoleRedirect: Decidindo redirecionamento...', {
          profileComplete: data?.profileComplete,
          categoria: data?.categoria,
          currentPath: location.pathname,
        });

        // Se não tem dados no Firestore, criar usuário básico
        if (!snap.exists()) {
          console.log('🆕 useRoleRedirect: Usuário não existe no Firestore, redirecionando para seleção');
          navigate('/selecao-cadastro', { replace: true });
          return;
        }

        // Se não tem perfil completo, redirecionar para setup
        if (!data?.profileComplete) {
          // Se não tem categoria definida, vai para seleção
          if (!data?.categoria || data?.categoria === 'publico') {
            console.log('🎯 useRoleRedirect: Redirecionando para seleção de categoria');
            navigate('/selecao-cadastro', { replace: true });
            return;
          }

          // Se tem categoria, vai direto para o cadastro específico
          console.log('🎯 useRoleRedirect: Redirecionando para cadastro específico:', data?.categoria);
          switch (data?.categoria) {
          case 'atleta':
            navigate('/cadastro-atleta', { replace: true });
            return;
          case 'jurado':
          case 'judge':
            navigate('/cadastro-jurado', { replace: true });
            return;
          case 'midia':
            navigate('/cadastro-midialouca', { replace: true });
            return;
          case 'espectador':
            navigate('/cadastro-curioso', { replace: true });
            return;
          default:
            console.log('⚠️ useRoleRedirect: Categoria desconhecida, indo para setup-profile');
            navigate('/setup-profile', { replace: true });
            return;
          }
        }

        // Se já tá completo, verificar se está em uma página válida
        console.log('✅ useRoleRedirect: Perfil completo, verificando se precisa redirecionar');
        
        // Lista de páginas válidas que não precisam de redirecionamento
        const validPages = [
          '/home', '/hub', '/perfil', '/audiovisual', '/audiovisual/form', 
          '/sobre', '/leaderboard', '/links', '/cluster', '/admin', '/dev', 
          '/marketing', '/admin-painel', '/dashboard-evento', '/termos'
        ];
        
        // Se está na raiz, redirecionar para /hub
        if (location.pathname === '/') {
          console.log('🔄 useRoleRedirect: Na raiz, redirecionando para /hub');
          navigate('/hub', { replace: true });
          return;
        }
        
        // Se não está em uma página válida, redirecionar para /hub
        if (!validPages.includes(location.pathname)) {
          console.log('🔄 useRoleRedirect: Página inválida, redirecionando para /hub');
          navigate('/hub', { replace: true });
        } else {
          console.log('✅ useRoleRedirect: Página válida, mantendo na página atual');
        }
      } catch (error) {
        console.error('❌ useRoleRedirect: Erro ao verificar perfil:', error);
        // Em caso de erro, vai para /hub
        navigate('/hub', { replace: true });
      }
    };

    // Só executar se não estiver carregando
    if (!loading) {
      console.log('🚀 useRoleRedirect: Executando verificação...', {
        loading,
        currentPath: location.pathname,
        hasUser: !!user,
      });
      checkAndRedirect();
    }
  }, [user, loading, location.pathname]);
};
