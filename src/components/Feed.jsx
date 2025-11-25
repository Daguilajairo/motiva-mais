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

  // Carrega feed e usuário
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
      } catch (err) {
        console.error("Erro ao buscar frases:", err);
      }
    };

    carregarFeed();
  }, []);

  // Adiciona nova frase vindo de outra página
 useEffect(() => {
  if (!novaFrase) return;

  // Cria uma função assíncrona interna ou timeout para evitar render síncrono
  const adicionarFrase = () => {
    setFrases(prev => [novaFrase, ...prev]);
  };

  // Chamada imediata, mas agora não diretamente no corpo do useEffect
  adicionarFrase();
}, [novaFrase]);

  // Curtir frase
  const handleCurtir = async (fraseId) => {
    if (!autorLogado) return;
    try {
      const res = await axios.post(
        `https://motiva-mais-3.onrender.com/frases/${fraseId}/curtir`,
        { usuario: autorLogado.nome }
      );

      setFrases(prev =>
        prev.map(f =>
          f._id === fraseId
            ? { ...f, curtidas: res.data.curtidas, curtidoPor: res.data.curtidoPor }
            : f
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Salvar frase
  const handleSalvar = async (fraseId) => {
    if (!autorLogado) return;
    try {
      const res = await axios.post(
        `https://motiva-mais-3.onrender.com/frases/${fraseId}/salvar`,
        { usuario: autorLogado.nome }
      );

      setFrases(prev =>
        prev.map(f =>
          f._id === fraseId
            ? { ...f, salvos: res.data.salvos }
            : f
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full flex flex-col items-center">
      <Menu />

      <div className="flex items-center justify-between h-20 w-85">
        <h2 className="font-bold text-2xl">Feed</h2>
      </div>

      {frases.length === 0 ? (
        <div className="bg-zinc-50 w-85 h-80 mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-10 items-center justify-center">
          <h3 className="font-semibold text-lg">Nenhuma frase publicada ainda</h3>
        </div>
      ) : (
        frases.map(frase => (
          <div key={frase._id} className="bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            <div className="flex gap-2">
              <img
                className="w-12 h-12 hover:scale-110 cursor-pointer"
                src="/img/icon-avatar.png"
                alt="avatar"
              />
              <div>
                <h1 className="font-bold text-base">
                  {frase.autor}{autorLogado && frase.autor === autorLogado.nome ? " (Você)" : ""}
                </h1>
                <p className="text-sm text-stone-500">{new Date(frase.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4"><p className="text-base">{frase.texto}</p></div>

            <div className="flex mt-4 gap-2 text-purple-500">
              {frase.hashtags.map((tag, i) => <p key={i}>#{tag}</p>)}
            </div>

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
