import { useState, useEffect } from "react";
import Menu from "./Menu.jsx";
import axios from "axios";

function Salvos() {
  const [frasesSalvas, setFrasesSalvas] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
  const usuarioStr = localStorage.getItem("usuario");
  const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : null;
  if (!usuarioObj) return;

  // Encapsula dentro de uma função async para evitar warnings
  const carregarSalvos = async () => {
    setUsuarioLogado(usuarioObj); // agora dentro da função
    try {
      const res = await axios.get("https://motiva-mais-3.onrender.com/frases");
      const salvosDoUsuario = res.data.frases.filter(frase =>
        frase.salvos?.includes(usuarioObj.nome)
      );
      setFrasesSalvas(salvosDoUsuario);
    } catch (error) {
      console.error("Erro ao buscar frases salvas:", error);
    }
  };

  carregarSalvos();
}, []);


  // Função para remover ou salvar novamente em tempo real
  const handleSalvar = async (fraseId) => {
    if (!usuarioLogado) return;

    try {
      const res = await axios.post(`https://motiva-mais-3.onrender.com/frases/${fraseId}/salvar`, {
        usuario: usuarioLogado.nome
      });

      // Atualiza a lista localmente
      setFrasesSalvas(prev =>
        prev.some(f => f._id === fraseId)
          ? prev.filter(f => f._id !== fraseId) // remove se já estava salvo
          : [...prev, { ...res.data.frase, salvos: [usuarioLogado.nome] }] // adiciona se salvou
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full flex flex-col items-center">
      <Menu />

      <div className="flex flex-col pt-10 h-20 w-85">
        <h2 className="font-bold text-2xl">Frases Salvas</h2>
        <p className="text-stone-600">Suas frases favoritas em um só lugar</p>
      </div>

      {frasesSalvas.length === 0 ? (
        <div className="bg-zinc-50 w-85 h-80 mt-10 rounded-xl shadow-lg p-6 flex flex-col pt-10 items-center justify-center">
          <img
            className="w-20 h-20 hover:scale-110 cursor-pointer"
            src="src/assets/img/icon-save-ligth.png"
            alt="save"
          />
          <h3 className="font-semibold text-lg">Nenhuma frase salva ainda</h3>
          <p className="text-stone-600 text-center mt-2">
            Quando você salvar frases, elas aparecerão aqui para que você possa acessá-las facilmente.
          </p>
        </div>
      ) : (
        frasesSalvas.map((frase) => (
          <div key={frase._id} className="bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            <div className="flex gap-2">
              <img
                className="w-12 h-12 hover:scale-110 cursor-pointer"
                src="src/assets/img/icon-avatar.png"
                alt="avatar"
              />
              <div>
                <h1 className="font-bold text-base">{frase.autor}</h1>
                <p className="text-sm text-stone-500">{new Date(frase.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-base">{frase.texto}</p>
            </div>

            <div className="flex mt-4 gap-2 text-purple-500">
              {frase.hashtags.map((tag, index) => (
                <p key={index}>#{tag}</p>
              ))}
            </div>

            {/* Botão para remover dos salvos */}
            <div className="mt-4 flex">
              <button onClick={() => handleSalvar(frase._id)} className="flex items-center gap-1 cursor-pointer">
                <img
                  className="w-5 h-5 hover:scale-110"
                  src="src/assets/img/icon-save-yellow.png"
                  alt="Remover dos salvos"
                />
                <span className="font-bold text-purple-500">Remover</span>
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default Salvos;
