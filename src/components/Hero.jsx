import { motion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL || '/'

export default function Hero() {
  return (
    <header className="relative">
      <div className="w-full h-[250px] overflow-hidden bg-chocolate">
        <img
          src={`${BASE}images/banner.jpg`}
          alt="Chá de Casa Nova"
          className="w-full h-full object-cover object-[75%_35%]"
        />
      </div>
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto -mt-6 relative z-10"
        >
        <h1 className="font-playfair text-2xl sm:text-3xl text-charcoal text-center mb-4">
          Chá de casa nova Amanda e Gian 🥳
        </h1>
        <p className="text-charcoal/90 text-center mb-4">
          Em mais uma etapa da nossa união, queremos convidar vocês para nosso chá de casa nova 🏠
        </p>
        <hr className="border-t border-pastel-pink/50 my-5" />
        <p className="font-semibold text-charcoal text-center mb-6">
          Abaixo, você encontrará todos os detalhes da programação. Por favor preencher o formulário! 🥰
        </p>
        <div className="space-y-2 text-charcoal/90 text-center text-sm sm:text-base">
          <p>📆 <strong>Data:</strong> 08/03/2026</p>
          <p>⏰ <strong>Horário:</strong> às 12h</p>
          <p>📍 <strong>Local:</strong> chácara REFUGIO SERENE (Taís e Danilo)</p>
        </div>
        <p className="text-neutral text-sm text-center mt-4">
          Obs.: Cada convidado deverá levar apenas o presente escolhido na lista.
        </p>
        <p className="text-charcoal/90 text-sm text-center mt-3">
          Nós ficaremos responsáveis, com muito carinho, por todos os comes e bebes — incluindo bebidas alcoólicas.<br />
          <span className="italic">(Caprichem no presente) 😜</span>
        </p>
        <p className="text-neutral text-sm text-center mt-3">
          Obs.: Fique tranquila(o)! O presente que você escolheu na lista, não ficará mais disponível para os outros convidados.
        </p>
        <p className="text-charcoal font-medium text-center mt-4">
          Vai ter sorteio sim! 😍
        </p>
        <p className="text-charcoal/90 text-sm text-center mt-2">
          Serão 2 cestas recheadas de cosméticos maravilhosos
        </p>
        <ul className="text-charcoal/90 text-sm text-center mt-1 space-y-0.5">
          <li>✨ 1 masculina</li>
          <li>✨ 1 feminina</li>
        </ul>
        <p className="font-semibold text-charcoal text-center mt-3">
          Não fique de fora!
        </p>
        </motion.div>
      </div>
    </header>
  )
}
