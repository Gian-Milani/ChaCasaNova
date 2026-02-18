import { useState } from 'react'
import { motion } from 'framer-motion'

export default function DadosPessoais({ onProximo }) {
  const [nome, setNome] = useState('')
  const [presenca, setPresenca] = useState('')
  const [erros, setErros] = useState({})

  const validar = () => {
    const e = {}
    if (!nome.trim()) e.nome = 'Informe seu nome.'
    if (!presenca) e.presenca = 'Confirme sua presença.'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validar()) return
    onProximo(nome.trim(), presenca)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="bg-chocolate text-white font-playfair text-lg sm:text-xl font-semibold py-3 px-4 rounded-t-2xl">
        Dados pessoais e confirmação de presença
      </div>
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        <div>
          <label className="block text-charcoal font-medium mb-2">
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Sua resposta"
            className="w-full rounded-xl border border-neutral/40 px-4 py-3 focus:ring-2 focus:ring-pastel-teal focus:border-pastel-teal outline-none transition"
          />
          {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
        </div>
        <div>
          <label className="block text-charcoal font-medium mb-2">
            Confirme sua presença <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="presenca"
                checked={presenca === 'sim'}
                onChange={() => setPresenca('sim')}
                className="w-4 h-4 text-chocolate focus:ring-chocolate"
              />
              <span className="text-charcoal">✅ Eu vou!</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="presenca"
                checked={presenca === 'nao'}
                onChange={() => setPresenca('nao')}
                className="w-4 h-4 text-chocolate focus:ring-chocolate"
              />
              <span className="text-charcoal">❌ Não vou!</span>
            </label>
          </div>
          {erros.presenca && <p className="text-red-500 text-sm mt-1">{erros.presenca}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-chocolate text-white font-semibold hover:bg-chocolate-dark transition shadow-md"
        >
          Próximo →
        </button>
      </form>
    </motion.div>
  )
}
