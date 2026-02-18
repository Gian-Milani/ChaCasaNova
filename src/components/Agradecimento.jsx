import { motion } from 'framer-motion'

export default function Agradecimento({ onLimpar }) {
  return (
    <div className="min-h-screen bg-champagne py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="bg-chocolate text-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <p className="font-playfair text-lg sm:text-xl leading-relaxed">
            Estamos felizes demais por tudo o que vem acontecendo conosco! E pelo fato de você
            contribuir com esta nova fase que estamos vivendo! Obrigado de coração! 💗
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-4">
          <p className="text-charcoal text-center">
            Esperamos você em nosso Chá de Casa Nova, vamos juntos desfrutar desse momento tão
            especial!
          </p>
          <p className="text-charcoal/90 text-center text-sm">
            Segue abaixo as informações novamente:
          </p>
          <div className="text-charcoal/90 text-center space-y-1 text-sm">
            <p>📅 <strong>Data:</strong> 08/03/2026</p>
            <p>⏰ <strong>Horário:</strong> 12:00</p>
            <p>📍 <strong>Local:</strong> Chácara Refugio Serene (Taís e Danilo)</p>
          </div>
          <p className="text-charcoal text-center pt-2">Nosso MUITO OBRIGADO mais uma vez! 💗</p>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={onLimpar}
            className="py-2.5 px-6 rounded-xl border border-chocolate text-chocolate font-medium hover:bg-chocolate/10 transition"
          >
            Preencher novamente
          </button>
        </div>
      </motion.div>
    </div>
  )
}
