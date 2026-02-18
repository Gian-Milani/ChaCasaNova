import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ItemCard from './ItemCard'
import SacolaPresentes from './SacolaPresentes'

const BASE = import.meta.env.BASE_URL || '/'

function getItensDoComodo(itensPorComodo, nomeComodo) {
  const key = Object.keys(itensPorComodo).find(
    (k) => k.toLowerCase() === nomeComodo.toLowerCase()
  )
  return key ? itensPorComodo[key] || [] : []
}

/** Normaliza nome para comparação (colapsa espaços como na planilha vs itens.json). */
function normalizarNome(str) {
  return (str || '').trim().replace(/\s+/g, ' ')
}

function isBloqueado(bloqueados, comodoKey, nomeItem) {
  const c = (comodoKey || '').toLowerCase().trim()
  const n = normalizarNome(nomeItem).toLowerCase()
  if (!c || !n) return false
  return bloqueados.some((b) => {
    const bc = (b.comodo || '').toLowerCase().trim()
    const bn = (b.nomeItem || '').trim().replace(/\s+/g, ' ').toLowerCase()
    if (bc !== c) return false
    if (bn === n) return true
    // Compatível com planilha: nome pode vir completo ou truncado (ignora maiúsculas)
    return bn.includes(n) || n.includes(bn)
  })
}

export default function EscolhaPresentes({
  comodos,
  itensPorComodo,
  bloqueados,
  itensSelecionados,
  setItensSelecionados,
  onProximo,
  onRefetchBloqueados,
}) {
  const [comodoSelecionado, setComodoSelecionado] = useState('')

  // Ao escolher um cômodo no combo, recarrega itens já selecionados para marcar no front
  useEffect(() => {
    if (comodoSelecionado && typeof onRefetchBloqueados === 'function') {
      onRefetchBloqueados()
    }
  }, [comodoSelecionado])

  const comodoNome = comodoSelecionado
    ? comodos.find((c) => c.nome === comodoSelecionado)?.nome
    : ''

  const itens = useMemo(
    () => getItensDoComodo(itensPorComodo, comodoNome || comodoSelecionado),
    [itensPorComodo, comodoNome, comodoSelecionado]
  )

  const keyComodo = useMemo(() => {
    if (!comodoSelecionado) return ''
    return Object.keys(itensPorComodo).find(
      (k) => k.toLowerCase() === (comodoSelecionado || '').toLowerCase()
    ) || ''
  }, [comodoSelecionado, itensPorComodo])

  const toggleItem = (item) => {
    const nome = (item.nome || '').trim()
    if (!nome || !keyComodo) return
    const ja = itensSelecionados.find(
      (p) => p.comodo.toLowerCase() === keyComodo.toLowerCase() && (p.nome || '').trim() === nome
    )
    if (ja) {
      setItensSelecionados((prev) =>
        prev.filter(
          (p) =>
            !(p.comodo.toLowerCase() === keyComodo.toLowerCase() && (p.nome || '').trim() === nome)
        )
      )
    } else {
      setItensSelecionados((prev) => [
        ...prev,
        { comodo: keyComodo, nome: item.nome, link: item.link },
      ])
    }
  }

  const isSelecionado = (item) => {
    const nome = (item.nome || '').trim()
    return itensSelecionados.some(
      (p) => p.comodo.toLowerCase() === keyComodo.toLowerCase() && (p.nome || '').trim() === nome
    )
  }

  const removerDaSacola = (p, index) => {
    setItensSelecionados((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="bg-chocolate text-white font-playfair text-lg sm:text-xl font-semibold py-3 px-4 rounded-t-2xl">
        Vamos escolher o(s) presentinho(s) 🏠
      </div>
      <div className="p-5 sm:p-6 space-y-4">
        <p className="text-charcoal/90 text-sm">
          Primeiro você escolherá o cômodo desejado e, em seguida, selecionará algum item relacionado
          ao cômodo escolhido, tudo bem?
        </p>
        <p className="text-charcoal/80 text-sm">
          Obs.: caso queira nos alegrar com mais de um presente, é possível escolher mais de um
          apenas no mesmo cômodo.
        </p>
        <ul className="list-disc list-inside text-charcoal/80 text-sm space-y-1">
          <li>
            O presente que você escolher será reservado apenas para você, garantindo que não seja
            repetido por outro convidado.
          </li>
          <li>
            Todas as fotos abaixo são tiradas do aplicativo de vendas da SHOPEE onde vocês irão comprar os presentes. Vocês irão entrar na Shopee, procurar pelo nome do presente (título do item) e achar conforme a referência da foto do presente!
          </li>
        </ul>

        {/* Preferência de cor dos presentes */}
        <div className="rounded-xl overflow-hidden border border-pastel-pink/30 bg-champagne-light/50">
          <div className="bg-chocolate text-white font-playfair text-base sm:text-lg font-semibold py-2.5 px-4 flex items-center gap-2">
            Preferência de cor dos presentes 🎁 ❤️
          </div>
          <div className="p-4">
            <img
              src={`${BASE}images/cores.jpg`}
              alt="Bambu + cores pastéis e Bambu + off white + cinza"
              className="w-full max-w-md mx-auto rounded-lg shadow-inner object-contain"
            />
          </div>
        </div>

        <div>
          <label className="block text-charcoal font-medium mb-2">
            Escolha um cômodo 🏠 <span className="text-red-500">*</span>
          </label>
          <select
            value={comodoSelecionado}
            onChange={(e) => setComodoSelecionado(e.target.value)}
            className="w-full rounded-xl border border-neutral/40 px-4 py-3 focus:ring-2 focus:ring-pastel-teal focus:border-pastel-teal outline-none transition bg-white"
          >
            <option value="">Escolher</option>
            {comodos.map((c) => (
              <option key={c.nome} value={c.nome}>
                {c.nome} {c.icone}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence mode="wait">
          {itens.length > 0 && (
            <motion.div
              key={comodoSelecionado}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
            >
              {itens.map((item, i) => (
                <ItemCard
                  key={(item.nome || '').trim() + i}
                  item={item}
                  comodo={keyComodo}
                  selecionado={isSelecionado(item)}
                  bloqueado={isBloqueado(bloqueados, keyComodo, item.nome)}
                  onToggle={toggleItem}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setComodoSelecionado('')}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-pastel-teal text-pastel-teal font-medium hover:bg-pastel-teal/10 transition"
        >
          Adicionar mais itens de outro cômodo
        </button>

        <SacolaPresentes itens={itensSelecionados} onRemover={removerDaSacola} />

        <button
          type="button"
          onClick={onProximo}
          className="w-full py-3 rounded-xl bg-chocolate text-white font-semibold hover:bg-chocolate-dark transition shadow-md"
        >
          Próximo →
        </button>
      </div>
    </motion.div>
  )
}
