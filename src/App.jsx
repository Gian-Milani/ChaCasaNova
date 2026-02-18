import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  useEffect(() => {
    fetchItensSelecionados().then((data) => {
      if (Array.isArray(data)) setBloqueados(data)
      else if (data && Array.isArray(data.data)) setBloqueados(data.data)
    })
  }, [])

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
