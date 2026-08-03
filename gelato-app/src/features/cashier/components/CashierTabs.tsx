'use client'

import { Banknote, History } from 'lucide-react'
import type { ReactNode } from 'react'
import HistoryTable from './HistoryTable'

export type CashierTab = 'collect' | 'history'

type Props = {
  activeTab: CashierTab
  onChange: (tab: CashierTab) => void
  collectCount: number
  children: ReactNode
}

export function CashierTabs({ activeTab, onChange, collectCount, children }: Props) {
  return (
    <div>
      <div
        role="tablist"
        aria-label="Caja"
        className="grid grid-cols-2 gap-1.5 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'collect'}
          onClick={() => onChange('collect')}
          className={`flex h-11 items-center justify-center gap-2 rounded-xl px-3 font-sans text-sm font-bold transition-colors ${
            activeTab === 'collect'
              ? 'bg-emerald-100 text-emerald-900 shadow-sm'
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Banknote className="h-4 w-4" aria-hidden />
          Por Cobrar
          <span
            className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 font-sans text-xs font-bold tabular-nums ${
              activeTab === 'collect'
                ? 'bg-white/80 text-emerald-900'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            {collectCount}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'history'}
          onClick={() => onChange('history')}
          className={`flex h-11 items-center justify-center gap-2 rounded-xl px-3 font-sans text-sm font-bold transition-colors ${
            activeTab === 'history'
              ? 'bg-stone-200 text-stone-800 shadow-sm'
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <History className="h-4 w-4" aria-hidden />
          Historial de Hoy
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'collect' ? children : <HistoryTable />}
      </div>
    </div>
  )
}
