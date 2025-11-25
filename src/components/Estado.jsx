import { useState } from "react";

function Estado({ frase, autorLogado, onCurtir, onSalvar }) {
  const autorNome = autorLogado?.nome;

  const [curtido, setCurtido] = useState(frase.curtidoPor?.includes(autorNome) || false);
  const [salvo, setSalvo] = useState(frase.salvos?.includes(autorNome) || false);
  const [numCurtidas, setNumCurtidas] = useState(frase.curtidas || 0);

  const handleCurtirClick = async () => {
    setCurtido(prev => !prev); // ícone muda imediatamente
    setNumCurtidas(prev => curtido ? prev - 1 : prev + 1); // contador muda imediatamente

    await onCurtir(); // chama função do Feed.jsx que atualiza backend e array do feed
  };

  const handleSalvarClick = async () => {
    setSalvo(prev => !prev); // ícone muda imediatamente
    await onSalvar(); // atualiza backend
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
          <span className="font-bold text-purple-500">{numCurtidas}</span>
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
