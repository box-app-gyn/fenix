
import { motion } from "framer-motion";

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="relative py-20 px-6 md:px-16 text-white"
      style={{
        backgroundImage: "url(/images/bg_1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Sobre o Interbox
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl mb-4"
        >
          Mais que competição, ecossistema de pessoas em comunidade, propósito e pertencimento.
        </motion.p>
      </div>
    </section>
  );
}
