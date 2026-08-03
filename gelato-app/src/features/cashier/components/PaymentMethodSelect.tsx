'use client'

import { Banknote } from 'lucide-react'
import type { PaymentMethod } from '../types'

type Props = {
  methods: PaymentMethod[]
  value: string
  onChange: (id: string) => void
}

export function PaymentMethodSelect({ methods, value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="font-outfit text-xs font-semibold uppercase tracking-wider text-stone-500">
        Método de pago
      </legend>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {methods.map((method) => {
          const selected = method.id === value
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(method.id)}
              className={`flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 font-sans text-xs font-semibold transition-colors duration-150 ${
                selected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-700'
              }`}
            >
              <Banknote className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{method.name}</span>
            </button>
          )
        })}
        {methods.length === 0 && (
          <p className="col-span-3 rounded-xl border border-dashed border-stone-200 bg-white/50 px-3 py-4 text-center font-sans text-xs text-stone-400">
            No hay métodos de pago disponibles
          </p>
        )}
      </div>
    </fieldset>
  )
}
