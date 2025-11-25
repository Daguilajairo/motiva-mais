import { useState, useEffect } from "react";
import Menu from "./Menu.jsx";
import axios from "axios";

function Salvos() {
  const [frasesSalvas, setFrasesSalvas] = useState([]);
 // const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const carregarSalvos = async () => {
      // Pega usuário do localStorage
      const usuarioStr = localStorage.getItem("usuario");
      const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : null;
      if (!usuarioObj) return;

      //setUsuarioLogado(usuarioObj);

      try {
        const res = await axios.get("https://motiva-mais-3.onrender.com/frases");
        // Filtra apenas frases que o usuário salvou
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
          </div>
        ))
      )}
    </section>
  );
}

export default Salvos;
