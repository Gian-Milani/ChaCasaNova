import { motion } from 'framer-motion'

export default function SacolaPresentes({ itens, onRemover }) {
  if (!itens.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-xl bg-white/90 border border-pastel-pink/50 shadow-md"
    >
      <p className="font-semibold text-charcoal mb-2">🎁 Você escolheu:</p>
      <ul className="space-y-1 text-sm text-charcoal/90">
        {itens.map((p, i) => (
          <li key={`${p.comodo}-${p.nome}-${i}`} className="flex items-center justify-between gap-2">
            <span className="truncate flex-1" title={p.nome}>
              {p.nome}
            </span>
            <button
              type="button"
              onClick={() => onRemover(p, i)}
              className="text-red-500 hover:text-red-700 shrink-0"
              aria-label="Remover"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
