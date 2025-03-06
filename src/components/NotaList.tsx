// components/NotaList.tsx
"use client";

import React from "react";
import NotaCard from "./NotaCard";
import { Nota } from "../hooks/useNotas";

interface NotaListProps {
  notas: Nota[];
  onDeletar: (id: string) => void;
  onEditar: (nota: Nota) => void;
}

export default function NotaList({
  notas,
  onDeletar,
  onEditar,
}: NotaListProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {notas.map((nota) => (
        <NotaCard
          key={nota._id}
          nota={nota}
          onDeletar={onDeletar}
          onEditar={onEditar}
        />
      ))}
    </div>
  );
}
