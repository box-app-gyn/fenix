
import Header from '../components/Header';
import Sobre from '../components/Sobre';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

export default function SobrePage() {
  return (
    <>
      <SEOHead 
        title="Sobre - CERRADØ INTERBOX 2025" 
        description="Conheça mais sobre o CERRADØ INTERBOX 2025, o maior evento de times da América Latina." 
      />
      <Header />
      <main className="pt-20">
        <Sobre />
      </main>
      <Footer />
    </>
  );
} 