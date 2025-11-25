import { useState, useEffect } from "react";
import Menu from "./Menu.jsx";
import Estado from "./Estado.jsx";
import axios from "axios";

function Feed({ novaFrase }) {
  const [frases, setFrases] = useState([]);
  const [autorLogado, setAutorLogado] = useState(null);

  useEffect(() => {
    const carregarFeed = async () => {
      try {
        // Pega token
        const token = sessionStorage.getItem("token");
        if (!token) {
          window.location.href = "/";
          return;
        }

        // Pega usuário do localStorage
        const usuarioStr = localStorage.getItem("usuario");
        const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : null;

        // Atualiza estado dentro da função
        setAutorLogado(usuarioObj);

        // Busca frases
        const res = await axios.get("https://motiva-mais-3.onrender.com/frases");
        setFrases(res.data.frases);
      } catch (error) {
        console.error("Erro ao buscar frases:", error);
      }
    };

    carregarFeed(); // chama a função
  }, []);

  // Se houver nova frase publicada, adiciona no início do feed
  useEffect(() => {
    if (novaFrase) {
        const atualizarFrases = () =>{
      setFrases(prev => [novaFrase, ...prev]);
    };
    setTimeout(atualizarFrases, 0);
}
  }, [novaFrase]);

  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full flex flex-col items-center">
      <Menu />

      <div className="flex items-center justify-between h-20 w-85 ">
        <h2 className="font-bold text-2xl">Feed</h2>
      </div>

      {frases.length === 0 ? (
        <div className="bg-zinc-50 w-85 h-80 mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-10 items-center justify-center">
          <h3 className="font-semibold text-lg">Nenhuma frase publicada ainda</h3>
        </div>
      ) : (
        frases.map((frase) => (
          <div key={frase._id} className="bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            <div className="flex gap-2">
              <img className="w-12 h-12 hover:scale-110 cursor-pointer" src="src/assets/img/icon-avatar.png" alt="avatar" />
              <div>
                <h1 className="font-bold text-base">
                  {frase.autor}
                  {autorLogado && frase.autor === autorLogado.nome ? " (Você)" : ""}
                </h1>
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

            <Estado />
          </div>
        ))
      )}
    </section>
  );
}

export default Feed;
