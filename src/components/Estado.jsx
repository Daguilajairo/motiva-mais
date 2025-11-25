import { useState, useEffect } from "react";

function Estado({ frase, autorLogado, onCurtir, onSalvar }) {
  const autorNome = autorLogado?.nome;

  const [curtido, setCurtido] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [numCurtidas, setNumCurtidas] = useState(0);

  // Sincroniza estado com backend sempre que a frase mudar
  useEffect(() => {
    const atualizarEstado = () => {
      setCurtido(frase.curtidoPor?.includes(autorNome) || false);
      setSalvo(frase.salvos?.includes(autorNome) || false);
      setNumCurtidas(frase.curtidas || 0);
    };

    atualizarEstado();
  }, [frase, autorNome]);

  const handleCurtirClick = async () => {
    setCurtido(prev => !prev);
    setNumCurtidas(prev => curtido ? prev - 1 : prev + 1);
    await onCurtir();
  };

  const handleSalvarClick = async () => {
    setSalvo(prev => !prev);
    await onSalvar();
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
