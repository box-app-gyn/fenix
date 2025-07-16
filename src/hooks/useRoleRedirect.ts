import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export const useRoleRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAndRedirect = async () => {
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

      // Se estamos na página de login e já temos usuário, redirecionar baseado no perfil
      if (location.pathname === '/login') {
        console.log('🔄 useRoleRedirect: Na página de login com usuário logado, verificando perfil...');
        // Não retornar aqui, continuar para verificar o perfil e redirecionar
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
          navigate('/selecao-cadastro');
          return;
        }

        if (!data?.profileComplete) {
          // Se não tem categoria definida, vai para seleção
          if (!data?.categoria || data?.categoria === 'publico') {
            console.log('🎯 useRoleRedirect: Redirecionando para seleção de categoria');
            navigate('/selecao-cadastro');
            return;
          }

          // Se tem categoria, vai direto para o cadastro específico
          console.log('🎯 useRoleRedirect: Redirecionando para cadastro específico:', data?.categoria);
          switch (data?.categoria) {
          case 'atleta':
            navigate('/cadastro-atleta');
            return;
          case 'jurado':
          case 'judge':
            navigate('/cadastro-jurado');
            return;
          case 'midia':
            navigate('/cadastro-midialouca');
            return;
          case 'espectador':
            navigate('/cadastro-curioso');
            return;
          default:
            console.log('⚠️ useRoleRedirect: Categoria desconhecida, indo para setup-profile');
            navigate('/setup-profile');
            return;
          }
        }

        // Se já tá completo, vai para Home
        console.log('✅ useRoleRedirect: Perfil completo, redirecionando para home');
        navigate('/home');
      } catch (error) {
        console.error('❌ useRoleRedirect: Erro ao verificar perfil:', error);
        // Em caso de erro, vai para seleção de categoria
        navigate('/selecao-cadastro');
      }
    };

    // Só executar se não estiver carregando e se não estivermos na página de login
    if (!loading && location.pathname !== '/login') {
      console.log('🚀 useRoleRedirect: Executando verificação...', {
        loading,
        currentPath: location.pathname,
        hasUser: !!user,
      });
      checkAndRedirect();
    }
  }, [user, loading, navigate, location.pathname]);
};
