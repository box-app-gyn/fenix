import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { fetchGraphData, GraphData } from '../utils/graphData';

const Graph3D: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchGraphData()
      .then((graphData) => {
        setData(graphData);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erro ao carregar dados do grafo: ' + err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data || !ref.current) return;

    // @ts-ignore
    graphRef.current = ForceGraph3D(ref.current)
      .graphData(data)
      .nodeLabel('label')
      .nodeColor((node: any) => node.type === 'user' ? '#ff6b6b' : '#4ecdc4')
      .nodeRelSize(6)
      .linkWidth(2)
      .linkColor('#666')
      .backgroundColor('#1a1a1a')
      .showNavInfo(true)
      .enableNodeDrag(true)
      .enableNavigationControls(true);

    return () => {
      if (graphRef.current) {
        graphRef.current._destructor?.();
      }
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-pink-500">Carregando grafo 3D...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-red-500">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 border-2 border-pink-300 rounded-lg overflow-hidden">
      <div ref={ref} className="w-full h-full" />
    </div>
  );
};

export default Graph3D;
