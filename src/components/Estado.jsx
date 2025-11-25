import React, { useState, useMemo } from "react";

function Estado({ frase, autorLogado, onCurtir }) {
    
    // Calcula o status de curtida inicial a partir das props (sem useEffect)
    const isCurtidoInicial = useMemo(() => {
        if (!autorLogado) return false;
        // Verifica se o nome do autor logado está na lista de curtidoPor
        return frase.curtidoPor?.includes(autorLogado.nome) || false;
    }, [frase.curtidoPor, autorLogado]);

    // Calcula o número de curtidas inicial (sem useEffect)
    const numCurtidasInicial = frase.curtidas ?? 0;
    
    // Inicializa o estado local APENAS uma vez com os valores iniciais
    const [curtido, setCurtido] = useState(isCurtidoInicial);
    const [numCurtidas, setNumCurtidas] = useState(numCurtidasInicial);

    // Se o autor não estiver logado, não mostra o componente de interação
    if (!autorLogado) return null;

    const handleCurtirClick = async () => {
        // Chama a função do pai (Feed.jsx) que faz a requisição à API
        const res = await onCurtir(frase._id);
        
        if (res) {
            // Atualiza o estado local (coração e contagem) imediatamente com a resposta da API
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