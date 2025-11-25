import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu.jsx";
import Estado from "./Estado.jsx";
import axios from "axios";

function Feed() {
  const location = useLocation();
  const { novaFrase } = location.state || {};

  const [frases, setFrases] = useState([]);
  const [autorLogado, setAutorLogado] = useState(null);

  useEffect(() => {
    const carregarFeed = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          window.location.href = "/";
          return;
        }

        const usuarioStr = localStorage.getItem("usuario");
        const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : null;
        setAutorLogado(usuarioObj);

        const res = await axios.get("https://motiva-mais-3.onrender.com/frases");
        setFrases(res.data.frases);
      } catch (error) {
        console.error("Erro ao buscar frases:", error);
      }
    };

    carregarFeed();
  }, []);

  useEffect(() => {
    if (novaFrase) {
      const timeout = setTimeout(() => {
        setFrases(prev => [novaFrase, ...prev]);
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [novaFrase]);

  const handleCurtir = async (fraseId) => {
    try {
      await axios.post(`https://motiva-mais-3.onrender.com/frases/${fraseId}/curtir`);
      setFrases(prev => prev.map(f => f._id === fraseId ? { ...f, curtidas: f.curtidas + 1, curtidoPor: [...(f.curtidoPor || []), autorLogado.nome] } : f));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSalvar = async (fraseId) => {
    try {
      const usuario = autorLogado?.nome;
      if (!usuario) return;

      await axios.post(`https://motiva-mais-3.onrender.com/frases/${fraseId}/salvar`, { usuario });

      setFrases(prev => prev.map(f => f._id === fraseId
        ? { ...f, salvos: f.salvos?.includes(usuario) ? f.salvos.filter(u => u !== usuario) : [...(f.salvos || []), usuario] }
        : f
      ));
    } catch (error) {
      console.error(error);
    }
  };

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
              <img
                className="w-12 h-12 hover:scale-110 cursor-pointer"
                src="src/assets/img/icon-avatar.png"
                alt="avatar"
              />
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

            {/* Componente Estado com curtidas e salvos */}
            <Estado
              frase={frase}
              autorLogado={autorLogado}
              onCurtir={() => handleCurtir(frase._id)}
              onSalvar={() => handleSalvar(frase._id)}
            />
          </div>
        ))
      )}
    </section>
  );
}

export default Feed;
