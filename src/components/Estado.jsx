function Estado({ frase, autorLogado, onCurtir, onSalvar }) {
  const curtido = autorLogado ? frase.curtidoPor?.includes(autorLogado.nome) : false;
  const salvo = autorLogado ? frase.salvos?.includes(autorLogado.nome) : false;

  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex items-center gap-4">

        {/* Curtir */}
        <button
          onClick={onCurtir}
          className="flex items-center gap-1 cursor-pointer"
        >
          <img
            className="w-5 h-5 hover:scale-110"
            src={curtido ? "/img/icon-favorite-red.png" : "/img/icon-favorite.png"}
            alt="Curtir"
          />
          <span className="font-bold text-purple-500">{frase.curtidas || 0}</span>
        </button>

        {/* Salvar */}
        <button
          onClick={onSalvar}
          className="cursor-pointer"
        >
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
