import React, { useState } from "react";

function Estado({ frase, autorLogado, onCurtir }) {
  // hooks SEMPRE no topo
  const [curtido, setCurtido] = useState(frase.curtidoPor?.includes(autorLogado?.nome) || false);
  const [numCurtidas, setNumCurtidas] = useState(frase.curtidas || 0);

  // se não tiver usuário logado, retorna null
  if (!autorLogado) return null;

  const handleCurtirClick = async () => {
    const res = await onCurtir(frase._id);
    if (res) {
      setCurtido(res.curtidoPor.includes(autorLogado.nome));
      setNumCurtidas(res.curtidas);
    }
  };

  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={handleCurtirClick} className="flex items-center gap-1 cursor-pointer">
          <img
            className="w-5 h-5 hover:scale-110"
            src={curtido ? "/img/icon-favorite-red.png" : "/img/icon-favorite.png"}
            alt="Curtir"
          />
          <span className="font-bold text-purple-500">{numCurtidas}</span>
        </button>
      </div>
    </div>
  );
}

export default Estado;
