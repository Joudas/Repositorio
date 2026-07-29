import type { Card } from '@/services/card';
import React from 'react'

type Props = {
    containerRef: React.RefObject<HTMLDivElement | null>;
    handleBack: () => void;
    currentModeZenCard: string;
    cards: Card[];
    onSelectModeZenCard: (cardTitle: string) => void;
    onClose: () => void;
}

export default function ZenCard({containerRef, handleBack, currentModeZenCard, cards, onSelectModeZenCard, onClose}: Props) {
  return (
    <div
        ref={containerRef}
        className="absolute right-0 top-10 bg-gray-6 rounded-lg shadow-2xl border border-gray-5 z-50 w-56 py-3"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 pb-2 text-gray-3 text-xs hover:text-gray-1 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <p className="text-gray-3 text-xs font-semibold px-4 pb-2 uppercase tracking-wide">
          Zen Focus Card
        </p>
        <ul className="text-gray-2 text-sm">
          {cards.map((card) => {
            const isSelected = card.title === currentModeZenCard;
            return (
              <li
                key={card.id}
                onClick={() => {
                  onSelectModeZenCard(card.title);
                  onClose();
                }}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-5 ${
                  isSelected ? "text-brand-primary font-medium" : ""
                }`}
              >
                <span>{card.title}</span>
                {isSelected && (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
    </div>
  )
}
