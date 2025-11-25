import { useState } from "react";

function Estado({ frase, autorLogado, onCurtir }) {
  const [curtido, setCurtido] = useState(frase.curtidoPor?.includes(autorLogado?.nome) || false);
  const [curtidas, setCurtidas] = useState(frase.curtidas || 0);

  const handleCurtir = async () => {
    if (!autorLogado) return;
    const atualizado = await onCurtir(frase._id);
    if (atualizado) {
      setCurtido(atualizado.curtidoPor.includes(autorLogado.nome));
      setCurtidas(atualizado.curtidas);
    }
  };

  return (
    <div className="flex gap-4 items-center mt-3">
      <button onClick={handleCurtir}>
        {curtido ? "💜" : "🤍"} {curtidas}
      </button>
    </div>
  );
}

export default Estado;
