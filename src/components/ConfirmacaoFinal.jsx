import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ConfirmacaoFinal({
  nome,
  presenca,
  itensSelecionados,
  etapaResumo,
  onVoltar,
  onFinalizar,
  onEnviar,
  onLimpar,
  loading,
  error,
}) {
  const [finalizar, setFinalizar] = useState(null)

  if (etapaResumo) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-chocolate text-white font-playfair text-lg sm:text-xl font-semibold py-3 px-4 rounded-t-2xl">
          Confirme para nós. Por favor! ✅
        </div>
        <div className="p-5 sm:p-6 space-y-5">
          <p className="font-semibold text-charcoal">Resumo do seu cadastro</p>
          <div className="bg-champagne/60 rounded-xl p-4 space-y-2 text-charcoal/90">
            <p><strong>Nome:</strong> {nome}</p>
            <p><strong>Presença:</strong> {presenca === 'sim' ? '✅ Eu vou!' : '❌ Não vou!'}</p>
            <p className="font-medium mt-2">Presentes escolhidos:</p>
            <ul className="list-disc list-inside text-sm">
              {itensSelecionados.length
                ? itensSelecionados.map((p, i) => (
                    <li key={i}>
                      {p.nome} <span className="text-neutral">({p.comodo})</span>
                    </li>
                  ))
                : <li>Nenhum item selecionado</li>}
            </ul>
          </div>
          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{error}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onVoltar}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border-2 border-chocolate text-chocolate font-semibold hover:bg-chocolate/10 transition disabled:opacity-50"
            >
              ← Voltar
            </button>
            <button
              type="button"
              onClick={onEnviar}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-chocolate text-white font-semibold hover:bg-chocolate-dark transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar 🎁'}
            </button>
            <button
              type="button"
              onClick={onLimpar}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-neutral text-charcoal font-semibold hover:bg-neutral/10 transition disabled:opacity-50"
            >
              Limpar formulário
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="bg-chocolate text-white font-playfair text-lg sm:text-xl font-semibold py-3 px-4 rounded-t-2xl">
        Confirme para nós. Por favor! ✅
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <p className="font-semibold text-charcoal">Você quer finalizar seu cadastro?</p>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="finalizar"
              checked={finalizar === true}
              onChange={() => setFinalizar(true)}
              className="w-4 h-4 text-chocolate focus:ring-chocolate"
            />
            <span className="text-charcoal">Sim! Já escolhi os presentes que vou abençoar!</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="finalizar"
              checked={finalizar === false}
              onChange={() => setFinalizar(false)}
              className="w-4 h-4 text-chocolate focus:ring-chocolate"
            />
            <span className="text-charcoal">Não! Quero voltar e olhar presentes de outros cômodos também</span>
          </label>
        </div>
        <div className="flex gap-3">
          {finalizar === true && (
            <button
              type="button"
              onClick={() => onFinalizar(true)}
              className="flex-1 py-3 rounded-xl bg-chocolate text-white font-semibold hover:bg-chocolate-dark transition"
            >
              Confirmar e ver resumo
            </button>
          )}
          {finalizar === false && (
            <button
              type="button"
              onClick={() => onFinalizar(false)}
              className="flex-1 py-3 rounded-xl border-2 border-chocolate text-chocolate font-semibold hover:bg-chocolate/10"
            >
              Voltar aos presentes
            </button>
          )}
          {finalizar === null && (
            <button
              type="button"
              disabled
              className="flex-1 py-3 rounded-xl bg-neutral/40 text-white font-semibold cursor-not-allowed"
            >
              Escolha uma opção
            </button>
          )}
        </div>
        {finalizar === false && (
          <p className="text-sm text-charcoal/80">Você será levado de volta à escolha de presentes.</p>
        )}
      </div>
    </motion.div>
  )
}
