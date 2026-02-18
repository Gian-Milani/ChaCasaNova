import { motion } from 'framer-motion'

const steps = [
  { num: 1, label: 'Dados' },
  { num: 2, label: 'Presentes' },
  { num: 3, label: 'Confirmação' },
]

export default function StepIndicator({ step }) {
  // step 1 = dados, 2 = presentes, 3 = pergunta finalizar, 4 = resumo+envio
  const current = step <= 2 ? step : step === 3 ? 3 : 3
  return (
    <nav className="flex justify-center gap-2 sm:gap-4 mb-6" aria-label="Progresso">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <motion.span
            initial={false}
            animate={{
              scale: current >= s.num ? 1.1 : 1,
              backgroundColor: current >= s.num ? 'rgb(78, 52, 46)' : 'rgb(154, 154, 154)',
            }}
            className="inline-flex h-8 w-8 sm:h-9 sm:w-9 rounded-full items-center justify-center text-white text-sm font-semibold"
          >
            {s.num}
          </motion.span>
          {i < steps.length - 1 && (
            <span
              className={`w-6 sm:w-10 h-0.5 mx-0.5 sm:mx-1 rounded ${
                current > s.num ? 'bg-chocolate' : 'bg-neutral/40'
              }`}
            />
          )}
        </div>
      ))}
    </nav>
  )
}
