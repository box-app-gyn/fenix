import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirestoreUser, FirestoreTeam } from '../types/firestore';

// Estrutura do grafo para 3d-force-graph
export interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'team';
  group?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Busca usuários e times do Firestore e monta o grafo
export async function fetchGraphData(): Promise<GraphData> {
  // Buscar usuários
  const usersSnap = await getDocs(collection(db, 'users'));
  const users: FirestoreUser[] = usersSnap.docs.map((doc) => ({ ...doc.data(), uid: doc.id }) as FirestoreUser);

  // Buscar times
  const teamsSnap = await getDocs(collection(db, 'teams'));
  const teams: FirestoreTeam[] = teamsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as FirestoreTeam);

  // Montar nós
  const userNodes: GraphNode[] = users.map((u) => ({
    id: u.uid,
    label: u.displayName || u.email || u.uid,
    type: 'user',
    group: u.role,
  }));
  const teamNodes: GraphNode[] = teams.map((t) => ({
    id: t.id,
    label: t.nome,
    type: 'team',
    group: t.categoria,
  }));

  // Montar arestas: usuário -> time
  const links: GraphLink[] = [];
  teams.forEach((team) => {
    team.atletas.forEach((userId) => {
      links.push({
        source: userId,
        target: team.id,
        label: 'participa',
      });
    });
    // Capitão
    if (team.captainId) {
      links.push({
        source: team.captainId,
        target: team.id,
        label: 'capitao',
      });
    }
  });

  return {
    nodes: [...userNodes, ...teamNodes],
    links,
  };
}
