import { signInWithRedirect } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';

export default function TestLogin() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔐 Teste de Login Google</h1>
      <button
        onClick={() => {
          console.log('🔁 Iniciando login Google...');
          signInWithRedirect(auth, provider);
        }}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          background: '#4285f4',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Entrar com Google
      </button>
    </div>
  );
}
