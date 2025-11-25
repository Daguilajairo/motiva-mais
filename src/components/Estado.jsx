import { useState } from "react";

function Estado({ frase, autorLogado, onCurtir, onSalvar }) {
  // compute autor's name safely so hooks run on every render
  const autorNome = autorLogado?.nome;

  // Deriva direto da prop
  const curtidoInicial = frase.curtidoPor?.includes(autorNome) || false;
  const salvoInicial = frase.salvos?.includes(autorNome) || false;

  // Estados locais apenas para otimista
  const [curtido, setCurtido] = useState(curtidoInicial);
  const [salvo, setSalvo] = useState(salvoInicial);

  if (!autorLogado) {
    return null;
  }

  const handleCurtirClick = () => {
    setCurtido(prev => !prev); // muda ícone imediatamente
    onCurtir(); // atualiza backend e Feed
  };

  const handleSalvarClick = () => {
    setSalvo(prev => !prev);
    onSalvar();
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
