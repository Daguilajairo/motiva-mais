import React, { useState, useEffect } from "react";

function Estado({ frase, autorLogado, onCurtir }) {
  const [curtido, setCurtido] = useState(false);
  const [numCurtidas, setNumCurtidas] = useState(0);

  // Sincroniza estado local sempre que a frase muda (useEffect seguro)
  useEffect(() => {
    if (!autorLogado) return;
    setCurtido(!!frase.curtidoPor?.includes(autorLogado.nome));
    setNumCurtidas(frase.curtidas ?? 0);
  }, [frase, autorLogado]);

  if (!autorLogado) return null;

  const handleCurtirClick = async () => {
    if (!autorLogado) return;
    const res = await onCurtir(frase._id);
    if (res) {
      // atualiza estado local imediato
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
