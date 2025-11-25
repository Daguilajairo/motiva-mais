import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu.jsx";
import Estado from "./Estado.jsx";
import axios from "axios";

const BASE_URL = "https://motiva-mais-3.onrender.com";

function Feed() {
  const location = useLocation();
  const { novaFrase } = location.state || {};
  const [frases, setFrases] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const carregarFeed = async () => {
      const usuarioStr = localStorage.getItem("usuario");
      if (!usuarioStr) return window.location.href = "/";
      setUsuarioLogado(JSON.parse(usuarioStr));

      try {
        const res = await axios.get(`${BASE_URL}/frases`);
        setFrases(res.data.frases);
      } catch (err) {
        console.error(err);
      }
    };
    carregarFeed();
  }, []);

  useEffect(() => {
    if (!novaFrase) return;
    setFrases(prev => [novaFrase, ...prev]);
  }, [novaFrase]);

  const handleCurtir = async (fraseId) => {
    try {
      const res = await axios.post(`${BASE_URL}/frases/${fraseId}/curtir`, { usuario: usuarioLogado.nome });
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  
  // NOVO: função para excluir fraseconsole.log("Excluindo frase:", fraseId);

  const handleExcluir = async (fraseId) => {
    if (!confirm("Tem certeza que deseja excluir esta frase?")) return;
    try {
      console.log("Excluindo frase:", fraseId);

      await axios.delete(`${BASE_URL}/frases/${fraseId}`);
      // Remove do estado local para atualizar a tela
      setFrases(prev => prev.filter(f => f._id !== fraseId));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir a frase");
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen w-full flex flex-col items-center pb-5">
      <Menu />
      <div className="flex items-center justify-between h-20 w-85">
        <h2 className="font-bold text-2xl">Feed</h2>
      </div>

      {frases.length === 0 ? (
        <div className="bg-zinc-50 w-85 h-80 mt-4 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-lg">Nenhuma frase publicada ainda</h3>
        </div>
      ) : (
        frases.map(f => (
          <div key={f._id} className="relative bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            {/* Botão de exclusão só aparece para o autor */}
            {usuarioLogado?.nome === f.autor && (
              <button
                onClick={() => handleExcluir(f._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Excluir frase"
              >
                🗑️
              </button>
            )}

            <div>
              <h1 className="font-bold text-base">{f.autor}</h1>
              <p className="text-sm text-stone-500">{new Date(f.created_at).toLocaleString()}</p>
            </div>
            <div className="mt-4"><p className="text-base">{f.texto}</p></div>
            <div className="flex mt-4 gap-2 text-purple-500">{f.hashtags.map((tag,i)=><p key={i}>{tag}</p>)}</div>
            <Estado frase={f} autorLogado={usuarioLogado} onCurtir={handleCurtir} />
          </div>
        ))
      )}
    </section>
  );
}

export default Feed;
