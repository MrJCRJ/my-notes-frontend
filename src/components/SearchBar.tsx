// components/SearchBar.tsx
"use client";

interface SearchBarProps {
  busca: string;
  setBusca: (value: string) => void;
}

export default function SearchBar({ busca, setBusca }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Buscar notas..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
    />
  );
}
