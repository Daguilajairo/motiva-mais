import React from "react";

function Estado({ frase, autorLogado, onCurtir, onSalvar }) {
  if (!autorLogado) return null;

  const autorNome = autorLogado.nome;
  const curtido = frase.curtidoPor?.includes(autorNome) || false;
  const salvo = frase.salvos?.includes(autorNome) || false;

  const handleCurtirClick = async () => {
    await onCurtir(frase._id);
  };

  const handleSalvarClick = async () => {
    await onSalvar(frase._id);
  };

  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Curtir */}
        <button onClick={handleCurtirClick} className="flex items-center gap-1 cursor-pointer">
          <img
            className="w-5 h-5 hover:scale-110"
            src={curtido ? "/img/icon-favorite-red.png" : "/img/icon-favorite.png"}
            alt="Curtir"
          />
          <span className="font-bold text-purple-500">{frase.curtidas || 0}</span>
        </button>

        {/* Salvar */}
        <button onClick={handleSalvarClick} className="cursor-pointer">
          <img
            className="w-5 h-5 hover:scale-110"
            src={salvo ? "/img/icon-save-yellow.png" : "/img/icon-save-ligth.png"}
            alt="Salvar"
          />
        </button>
      </div>
    </div>
  );
}

export default Estado;
