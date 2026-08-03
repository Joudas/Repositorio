'use client'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function PaymentReferenceInput({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-stone-500">
        Referencia de pago
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: número de celular o referencia"
        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 font-sans text-sm text-cacao outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />
      <span className="mt-1 block font-sans text-[11px] text-stone-400">
        Este método requiere el número de referencia para confirmar el pago
      </span>
    </label>
  )
}
