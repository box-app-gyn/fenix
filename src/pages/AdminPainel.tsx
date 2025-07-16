import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirestoreUser, UserRole } from '../types/firestore';


const USER_TYPES: Record<string, { color: string; icon: string; label: string }> = {
  atleta: { color: '#10B981', icon: '🏃‍♂️', label: 'Atleta' },
  espectador: { color: '#6B7280', icon: '👥', label: 'Espectador' },
  judge: { color: '#F59E0B', icon: '⚖️', label: 'Juiz' },
  jurado: { color: '#F59E0B', icon: '⚖️', label: 'Jurado' },
  midia: { color: '#8B5CF6', icon: '📸', label: 'Mídia' },
  publico: { color: '#3B82F6', icon: '👤', label: 'Público' },
  admin: { color: '#EF4444', icon: '🛡️', label: 'Admin' },
  patrocinador: { color: '#F472B6', icon: '💼', label: 'Patrocinador' },
  apoio: { color: '#6366F1', icon: '🤝', label: 'Apoio' },
};

export default function AdminPainel() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FirestoreUser>>({});
  const [accessDenied, setAccessDenied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Carregar e proteger acesso
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
      const userData = userDoc.docs[0]?.data() as FirestoreUser;
      if (!userData || userData.role !== 'admin') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      // Carregar todos os usuários
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map((d) => d.data() as FirestoreUser));
      setLoading(false);
    };
    load();
  }, [user]);

  // Filtro por tipo
  const filteredUsers = filter
    ? users.filter((u) => u.role === filter)
    : users;

  // Iniciar edição
  const startEdit = (u: FirestoreUser) => {
    setEditingId(u.uid);
    setEditData({
      displayName: u.displayName,
      email: u.email,
      telefone: u.telefone,
      role: u.role,
    });
  };

  // Salvar edição
  const saveEdit = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), editData);
      setUsers(users.map((u) => (u.uid === uid ? { ...u, ...editData } : u)));
      setEditingId(null);
      setMessage('Usuário atualizado com sucesso!');
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage('Erro ao atualizar usuário.');
    }
  };

  // Excluir usuário
  const deleteUser = async (uid: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(users.filter((u) => u.uid !== uid));
      setMessage('Usuário excluído.');
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage('Erro ao excluir usuário.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (accessDenied) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🛡️</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: USER_TYPES.admin.color }}>Acesso Negado</h1>
        <p className="text-gray-600">Apenas administradores podem acessar este painel.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="text-3xl" style={{ color: USER_TYPES.admin.color }}>{USER_TYPES.admin.icon}</span>
          <h1 className="text-3xl font-bold text-gray-900">Modo Admin - Gerenciar Usuários</h1>
        </div>
        {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-200">{message}</div>}
        <div className="mb-4 flex gap-2 items-center">
          <label className="font-medium">Filtrar por tipo:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded px-2 py-1">
            <option value="">Todos</option>
            {Object.entries(USER_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded bg-white">
            <thead>
              <tr>
                <th className="py-2 px-2">Nome</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Tipo</th>
                <th className="py-2 px-2">Telefone</th>
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.uid} style={{ background: USER_TYPES[u.role]?.color + '10' }} className="border-b">
                  <td className="py-2 px-2 font-medium">
                    {editingId === u.uid ? (
                      <input value={editData.displayName || ''} onChange={(e) => setEditData((ed) => ({ ...ed, displayName: e.target.value }))} className="border rounded px-1" />
                    ) : u.displayName}
                  </td>
                  <td className="py-2 px-2">
                    {editingId === u.uid ? (
                      <input value={editData.email || ''} onChange={(e) => setEditData((ed) => ({ ...ed, email: e.target.value }))} className="border rounded px-1" />
                    ) : u.email}
                  </td>
                  <td className="py-2 px-2">
                    {editingId === u.uid ? (
                      <select value={editData.role || u.role} onChange={(e) => setEditData((ed) => ({ ...ed, role: e.target.value as UserRole }))} className="border rounded px-1">
                        {Object.entries(USER_TYPES).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-1 rounded" style={{ background: USER_TYPES[u.role]?.color + '30', color: USER_TYPES[u.role]?.color }}>{USER_TYPES[u.role]?.icon} {USER_TYPES[u.role]?.label}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editingId === u.uid ? (
                      <input value={editData.telefone || ''} onChange={(e) => setEditData((ed) => ({ ...ed, telefone: e.target.value }))} className="border rounded px-1" />
                    ) : u.telefone}
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    {editingId === u.uid ? (
                      <>
                        <button onClick={() => saveEdit(u.uid)} className="px-2 py-1 bg-green-600 text-white rounded">Salvar</button>
                        <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-400 text-white rounded">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(u)} className="px-2 py-1 bg-blue-600 text-white rounded">Editar</button>
                        <button onClick={() => deleteUser(u.uid)} className="px-2 py-1 bg-red-600 text-white rounded">Excluir</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
