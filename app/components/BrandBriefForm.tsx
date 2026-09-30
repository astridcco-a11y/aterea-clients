'use client'

import { useState } from 'react'

interface BrandBriefFormProps {
  clientName: string
  brandName: string
}

interface FormField {
  name: string
  label: string
  type: string
  required: boolean
}

interface FormQuestion {
  title: string
  copy: string
  fields?: FormField[]
  textarea?: {
    name: string
    label: string
    required: boolean
  }
}

const questions: FormQuestion[] = [
  {
    title: 'Empecemos por lo básico.',
    copy: 'Cuéntanos cómo encontramos a tu marca.',
    fields: [
      { name: 'brandName', label: 'Nombre de marca', type: 'text', required: true },
      { name: 'instagram', label: 'Instagram', type: 'text', required: false },
      { name: 'website', label: 'Sitio web', type: 'url', required: false },
    ],
  },
  {
    title: 'CUÉNTANOS\nQUÉ HACES.',
    copy: '¿Qué vende tu marca?',
    textarea: { name: 'whatYouSell', label: 'Describe lo que vendes, ofreces o haces.', required: true },
  },
  {
    title: 'QUÉ TE COMPRA?',
    copy: 'Descríbenos a la persona que más queremos entender.',
    fields: [
      { name: 'customerAge', label: 'Edad aproximada', type: 'text', required: false },
      { name: 'customerLocation', label: 'Ubicación', type: 'text', required: false },
      { name: 'customerInterests', label: 'Intereses', type: 'text', required: false },
      { name: 'customerSeeks', label: 'Qué busca', type: 'text', required: false },
      { name: 'customerWhy', label: 'Por qué compra', type: 'text', required: false },
    ],
  },
  {
    title: "¿QUÉ ESTÁ\nFUNCIONANDO?",
    copy: '¿Qué promociones funcionaron mejor? ¿Qué contenido tuvo mejores resultados?',
    textarea: { name: 'working', label: 'Cuéntanos qué ya tiene tracción.', required: false },
  },
  {
    title: "Y QUÉ\nNO?",
    copy: 'Queremos saberlo para no repetirlo.',
    textarea: { name: 'notWorking', label: '¿Qué probaste y no funcionó?', required: false },
  },
  {
    title: 'IMAGINA QUE HAN PASADO\n90 DÍAS.',
    copy: 'Estamos revisando juntos los resultados y tú piensas: "Esto funcionó." ¿Qué tendría que haber sucedido?',
    textarea: { name: 'ninetyDays', label: 'Describe cómo se vería ese resultado.', required: true },
  },
  {
    title: 'ONE LAST THING.',
    copy: 'Si pudieras pedirle UNA sola cosa a Aterea durante los próximos meses… ¿qué sería?',
    textarea: { name: 'oneThing', label: 'Tu respuesta.', required: true },
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
          {currentQuestion.fields?.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                {field.label} {field.required ? '*' : ''}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={answers[field.name] || ''}
                onChange={handleInputChange}
                required={field.required}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-pink-600"
              />
            </div>
          ))}

          {currentQuestion.textarea && (
            <div>
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                {currentQuestion.textarea.label} {currentQuestion.textarea.required ? '*' : ''}
              </label>
              <textarea
                name={currentQuestion.textarea.name}
                value={answers[currentQuestion.textarea.name] || ''}
                onChange={handleInputChange}
                required={currentQuestion.textarea.required}
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
