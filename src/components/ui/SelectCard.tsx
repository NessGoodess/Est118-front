"use client";

import { useState } from "react";
import { CardOption, CardOptionData } from "./CardOption";

interface SelectCardProps {
  options: CardOptionData[];
  value?: CardOptionData | null;
  onChange?: (value: CardOptionData | null) => void;
  placeholder?: string;
  confirmLabel?: string;
  onConfirm?: (value: CardOptionData) => void;
}

export function SelectCard({
  options,
  value,
  onChange,
  placeholder = "Ningún proceso seleccionado",
  confirmLabel = "Confirmar selección",
  onConfirm,
}: SelectCardProps) {
  const [internalSelected, setInternalSelected] =
    useState<CardOptionData | null>(null);

  // Support both controlled and uncontrolled modes
  const selected = value !== undefined ? value : internalSelected;

  function handleClick(data: CardOptionData) {
    const next = selected?.id === data.id ? null : data;

    if (onChange) {
      onChange(next);
    } else {
      setInternalSelected(next);
    }
  }

  function handleConfirm() {
    if (selected && onConfirm) {
      onConfirm(selected);
    }
  }

  return (
    <div className="w-full">
      {/* Card list */}
      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <CardOption
            key={option.id}
            data={option}
            selected={selected?.id === option.id}
            onClick={handleClick}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
        <p className="text-sm text-zinc-500">
          {selected ? (
            <span>
              <span className="font-medium text-zinc-700">{selected.title}</span>{" "}
              seleccionado
            </span>
          ) : (
            placeholder
          )}
        </p>

        <button
          type="button"
          disabled={!selected}
          onClick={handleConfirm}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-sky-600 text-white hover:bg-sky-700 active:scale-[0.97]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
          "
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
