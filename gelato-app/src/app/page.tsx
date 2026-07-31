import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[#FEFCF3] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-outfit font-semibold text-4xl md:text-5xl text-amber-950 tracking-tight">
        Punto Glaceal
      </h1>
      <p className="text-stone-500 font-sans mt-3 text-base max-w-md">
        Heladería & Dulcería Artesanal
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-accent text-white font-sans font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          Ver Menú
        </Link>
        <Link
          href="/cocina"
          className="inline-flex items-center gap-2 border border-amber-200 bg-white/60 text-amber-950 font-sans font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          Cocina
        </Link>
      </div>
    </main>
  )
}
