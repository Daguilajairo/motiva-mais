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

  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-full w-full flex flex-col items-center">
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
          <div key={f._id} className="bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            <div>
              <h1 className="font-bold text-base">{f.autor}</h1>
              <p className="text-sm text-stone-500">{new Date(f.created_at).toLocaleString()}</p>
            </div>
            <div className="mt-4"><p className="text-base">{f.texto}</p></div>
            <div className="flex mt-4 gap-2 text-purple-500">{f.hashtags.map((tag,i)=><p key={i}>#{tag}</p>)}</div>
            <Estado frase={f} autorLogado={usuarioLogado} onCurtir={handleCurtir} />
          </div>
        ))
      )}
    </section>
  );
}

export default Feed;
