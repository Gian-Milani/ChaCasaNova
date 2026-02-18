import { motion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL || '/'

export default function ItemCard({ item, comodo, selecionado, bloqueado, onToggle }) {
  const imgSrc = item.imagem?.startsWith('http') ? item.imagem : `${BASE}${item.imagem}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-xl overflow-hidden bg-white shadow-md border-2 transition ${
        bloqueado ? 'border-neutral/30 opacity-75' : selecionado ? 'border-pastel-teal ring-2 ring-pastel-teal/30' : 'border-transparent hover:border-pastel-pink/50'
      }`}
    >
      {bloqueado && (
        <div className="absolute inset-0 bg-charcoal/50 z-10 flex items-center justify-center">
          <span className="text-white font-semibold text-sm sm:text-base">💝 Já escolhido</span>
        </div>
      )}
      <div className="aspect-square relative">
        <img
          src={imgSrc}
          alt={item.nome}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!bloqueado && (
          <button
            type="button"
            onClick={() => onToggle(item)}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center border border-neutral/30 hover:bg-pastel-teal/20 transition"
            aria-label={selecionado ? 'Desmarcar' : 'Selecionar'}
          >
            {selecionado ? '✓' : ''}
          </button>
        )}
      </div>
      <div className="p-3">
        <p
          className="text-charcoal text-sm font-medium line-clamp-2 min-h-[2.5rem]"
          title={item.nome}
        >
          {item.nome?.trim() || 'Item'}
        </p>
        {!bloqueado && item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-pastel-teal hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Ver na Shopee 🛍️
          </a>
        )}
      </div>
    </motion.div>
  )
}
