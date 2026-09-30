'use client'

import { useState } from 'react'

interface BrandBriefFormProps {
  clientName: string
  brandName: string
}

const questions = [
  {
    title: 'Empecemos por lo básico.',
    copy: 'Cuéntanos cómo encontramos a tu marca.',
    fields: [
      ['brandName', 'Nombre de marca', 'text', true],
      ['instagram', 'Instagram', 'text', false],
      ['website', 'Sitio web', 'url', false],
    ],
  },
  {
    title: 'CUÉNTANOS\nQUÉ HACES.',
    copy: '¿Qué vende tu marca?',
    textarea: ['whatYouSell', 'Describe lo que vendes, ofreces o haces.', true],
  },
  {
    title: 'QUÉ TE COMPRA?',
    copy: 'Descríbenos a la persona que más queremos entender.',
    fields: [
      ['customerAge', 'Edad aproximada', 'text', false],
      ['customerLocation', 'Ubicación', 'text', false],
      ['customerInterests', 'Intereses', 'text', false],
      ['customerSeeks', 'Qué busca', 'text', false],
      ['customerWhy', 'Por qué compra', 'text', false],
    ],
  },
  {
    title: "¿QUÉ ESTÁ\nFUNCIONANDO?",
    copy: '¿Qué promociones funcionaron mejor? ¿Qué contenido tuvo mejores resultados?',
    textarea: ['working', 'Cuéntanos qué ya tiene tracción.', false],
  },
  {
    title: "Y QUÉ\nNO?",
    copy: 'Queremos saberlo para no repetirlo.',
    textarea: ['notWorking', '¿Qué probaste y no funcionó?', false],
  },
  {
    title: 'IMAGINA QUE HAN PASADO\n90 DÍAS.',
    copy: 'Estamos revisando juntos los resultados y tú piensas: "Esto funcionó." ¿Qué tendría que haber sucedido?',
    textarea: ['ninetyDays', 'Describe cómo se vería ese resultado.', true],
  },
  {
    title: 'ONE LAST THING.',
    copy: 'Si pudieras pedirle UNA sola cosa a Aterea durante los próximos meses… ¿qué sería?',
    textarea: ['oneThing', 'Tu respuesta.', true],
  },
]

export default function BrandBriefForm({ clientName, brandName }: BrandBriefFormProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const currentQuestion = questions[step]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      // Submit
      await submitBrief()
    }
  }

  const submitBrief = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          brandName,
          ...answers,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Error al enviar. Intenta de nuevo.')
      }
    } catch (error) {
      alert('Error al enviar. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">WE GOT IT.</h1>
          <h2 className="text-4xl font-bold text-pink-600 mb-8">{clientName}</h2>
          <p className="text-xl mb-6">Gracias por confiar en Aterea. Vamos a construir algo que se sienta tuyo.</p>
          <p className="text-2xl text-pink-600">WELCOME TO ATEREA.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <p className="text-sm text-gray-600">
            {String(step + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
          </p>
          <div className="w-full bg-gray-200 rounded h-1 mt-2">
            <div
              className="bg-pink-600 h-1 rounded transition-all"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 whitespace-pre-line">{currentQuestion.title}</h1>
          <p className="text-lg text-gray-700">{currentQuestion.copy}</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-8">
          {currentQuestion.fields?.map(([name, label, type, required]) => (
            <div key={name}>
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                {label} {required ? '*' : ''}
              </label>
              <input
                type={type}
                name={name}
                value={answers[name] || ''}
                onChange={handleInputChange}
                required={required}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-pink-600"
              />
            </div>
          ))}

          {currentQuestion.textarea && (
            <div>
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                {currentQuestion.textarea[1]} {currentQuestion.textarea[2] ? '*' : ''}
              </label>
              <textarea
                name={currentQuestion.textarea[0]}
                value={answers[currentQuestion.textarea[0]] || ''}
                onChange={handleInputChange}
                required={currentQuestion.textarea[2]}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-pink-600 min-h-32"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className="text-sm font-semibold uppercase tracking-wide opacity-50 hover:opacity-100"
            disabled={step === 0}
          >
            ← VOLVER
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-black text-white px-6 py-3 rounded font-semibold uppercase tracking-wide hover:bg-pink-600 disabled:opacity-50"
          >
            {isSubmitting ? 'ENVIANDO...' : step === questions.length - 1 ? 'SEND TO ATEREA →' : 'CONTINUAR →'}
          </button>
        </div>
      </div>
    </div>
  )
}
