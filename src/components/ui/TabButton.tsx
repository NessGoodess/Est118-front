"use client";

type TabItem = {
  key: string;
  name: string;
};

type TabButtonProps = {
  tab: TabItem;
  idx: number;
  selected: number;
  onClick: (idx: number) => void;
};

export default function TabButton({ tab, idx, selected, onClick }: TabButtonProps) {
  const isActive = selected === idx;

  return (
    <button
      id={`tab-${idx}`}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${idx}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onClick(idx)}
      className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors duration-200 sm:py-4 ${
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-fg-muted hover:border-border hover:text-foreground"
      }`}
    >
      {tab.name}
    </button>
  );
}
