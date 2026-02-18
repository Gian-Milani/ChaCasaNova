import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GOOGLE_SCRIPT_URL } from './config'
import { fetchItensSelecionados, confirmarPresente } from './services/sheetsService'
import Hero from './components/Hero'
import StepIndicator from './components/StepIndicator'
import DadosPessoais from './components/DadosPessoais'
import EscolhaPresentes from './components/EscolhaPresentes'
import ConfirmacaoFinal from './components/ConfirmacaoFinal'
import Agradecimento from './components/Agradecimento'
import comodosData from '../comodos.json'
import itensData from '../itens.json'

const comodos = comodosData
const itensPorComodo = itensData.itens[0] || {}

export default function App() {
  const [step, setStep] = useState(1)
  const [itensSelecionados, setItensSelecionados] = useState([])
  const [nome, setNome] = useState('')
  const [presenca, setPresenca] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bloqueados, setBloqueados] = useState([]) // [{ comodo, nomeItem }]
  const [bloqueadosError, setBloqueadosError] = useState(null) // erro ao carregar itens já selecionados (produção)

  /** Carrega itens já selecionados (planilha ItensSelecionados) ao montar a página. */
  useEffect(() => {
    setBloqueadosError(null)
    fetchItensSelecionados()
      .then((data) => {
        if (Array.isArray(data)) setBloqueados(data)
        else if (data && Array.isArray(data.data)) setBloqueados(data.data)
        setBloqueadosError(null)
      })
      .catch((err) => {
        setBloqueados([])
        setBloqueadosError(err?.message || 'Erro ao carregar itens já escolhidos')
      })
  }, [])

  /** Recarrega itens bloqueados (ex.: ao escolher cômodo) para marcar corretamente no front. */
  const refetchBloqueados = () => {
    setBloqueadosError(null)
    fetchItensSelecionados()
      .then((data) => {
        if (Array.isArray(data)) setBloqueados(data)
        else if (data && Array.isArray(data.data)) setBloqueados(data.data)
        setBloqueadosError(null)
      })
      .catch((err) => {
        setBloqueados([])
        setBloqueadosError(err?.message || 'Erro ao carregar itens já escolhidos')
      })
  }

  const debugItens = typeof window !== 'undefined' && window.location.search.includes('debug=1')

  const handleProximoDados = (nomeVal, presencaVal) => {
    setNome(nomeVal)
    setPresenca(presencaVal)
    setError(null)
    setStep(2)
  }

  const handleProximoPresentes = () => {
    setStep(3)
  }

  const handleVoltarEtapa3 = () => {
    setStep(2)
  }

  const handleFinalizarEscolha = (querFinalizar) => {
    if (querFinalizar) setStep(4)
    else setStep(2)
  }

  const handleEnviar = async () => {
    setError(null)
    setLoading(true)
    const payload = {
      nome,
      presenca: presenca === 'sim' ? 'sim' : 'nao',
      presentes: itensSelecionados.map((p) => ({
        comodo: p.comodo,
        nomeItem: p.nome,
        linkItem: p.link || '',
      })),
    }
    const novosBloqueados = itensSelecionados.map((p) => ({
      comodo: (p.comodo || '').toLowerCase().trim(),
      nomeItem: (p.nome || '').trim(),
    })).filter((p) => p.comodo && p.nomeItem)

    try {
      await confirmarPresente(payload)
      setBloqueados((prev) => [...prev, ...novosBloqueados])
      setEnviado(true)
    } catch (err) {
      // CORS bloqueia a resposta mesmo com 200; o POST costuma gravar na planilha — tratar como sucesso
      const msg = err.message || ''
      const isCorsOrNetwork =
        err.name === 'TypeError' ||
        msg.includes('Failed to fetch') ||
        msg.includes('CORS') ||
        msg.includes('NetworkError')
      if (isCorsOrNetwork) {
        setBloqueados((prev) => [...prev, ...novosBloqueados])
        setEnviado(true)
      } else {
        setError(msg || 'Falha ao enviar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLimpar = () => {
    setStep(1)
    setNome('')
    setPresenca('')
    setItensSelecionados([])
    setEnviado(false)
    setError(null)
  }

  if (enviado) {
    return <Agradecimento onLimpar={handleLimpar} />
  }

  return (
    <div className="min-h-screen bg-champagne pb-12">
      {debugItens && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-charcoal text-white text-xs sm:text-sm py-2 px-3 text-center font-mono space-y-1">
          <div>
            Diagnóstico itens já escolhidos: {bloqueadosError ? (
              <span className="text-red-300">Erro — {bloqueadosError}</span>
            ) : (
              <span><strong>{bloqueados.length}</strong> itens carregados da planilha</span>
            )}
            {' '}(<a href={window.location.pathname} className="underline">sair</a>)
          </div>
          {bloqueados.length === 0 && !bloqueadosError && (
            <div className="text-amber-200 text-xs">
              Se deveria ter itens: confira a URL em config.js e a aba &quot;ItensSelecionados&quot; na planilha. Abra o Console (F12) e a aba Network ao recarregar.{' '}
              <a target="_blank" rel="noopener noreferrer" href={`${GOOGLE_SCRIPT_URL}?action=getItensSelecionados`} className="underline">Testar resposta do script</a> (abre em nova aba; deve mostrar um array JSON com os itens).
            </div>
          )}
        </div>
      )}
      {debugItens && <div className="h-10" />}
      <Hero />
      <main className="max-w-2xl mx-auto px-4 -mt-6 relative z-10">
        <StepIndicator step={step} />
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DadosPessoais onProximo={handleProximoDados} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <EscolhaPresentes
                comodos={comodos}
                itensPorComodo={itensPorComodo}
                bloqueados={bloqueados}
                itensSelecionados={itensSelecionados}
                setItensSelecionados={setItensSelecionados}
                onProximo={handleProximoPresentes}
                onRefetchBloqueados={refetchBloqueados}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <ConfirmacaoFinal
                nome={nome}
                presenca={presenca}
                itensSelecionados={itensSelecionados}
                onVoltar={handleVoltarEtapa3}
                onFinalizar={handleFinalizarEscolha}
              />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <ConfirmacaoFinal
                nome={nome}
                presenca={presenca}
                itensSelecionados={itensSelecionados}
                etapaResumo
                onVoltar={() => setStep(3)}
                onEnviar={handleEnviar}
                onLimpar={handleLimpar}
                loading={loading}
                error={error}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
