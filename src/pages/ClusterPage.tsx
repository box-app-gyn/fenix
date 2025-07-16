import Header from '../components/Header';
import Footer from '../components/Footer';
import Graph3D from '../components/Graph3D';
import SEOHead from '../components/SEOHead';

export default function ClusterPage() {
  return (
    <>
      <SEOHead title="Cluster 3D - Visualização de Relações" description="Visualização interativa das relações do App Fenix em 3D." />
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-pink-500">Cluster 3D - Relações do Projeto</h1>
        <Graph3D />
      </main>
      <Footer />
    </>
  );
}
