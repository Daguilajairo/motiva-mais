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
      const token = sessionStorage.getItem("token");
      if (!token) return window.location.href = "/";

      const usuarioStr = localStorage.getItem("usuario");
      const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : null;
      if (!usuarioObj) return;
      setUsuarioLogado(usuarioObj);

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
    const id = setTimeout(() => setFrases(prev => [novaFrase, ...prev]), 0);
    return () => clearTimeout(id);
  }, [novaFrase]);

 // Feed.jsx
// Feed.jsx
// ...
const handleCurtir = async (fraseId) => {
  if (!usuarioLogado) {
    console.log("Usuário não logado, abortando curtir.");
    return; // Retorna undefined
  }

  try {
    const res = await axios.post(`${BASE_URL}/frases/${fraseId}/curtir`, { usuario: usuarioLogado.nome });
    const fraseAtualizada = res.data;

    // LOG DE DEBUG ESSENCIAL: O QUE O BACKEND RESPONDEU
    console.log("Resposta do Backend (fraseAtualizada):", fraseAtualizada); 

    if (fraseAtualizada) {
        // Atualiza o feed globalmente
        setFrases(prev => prev.map(f => f._id === fraseId ? { ...f, ...fraseAtualizada } : f));
    }
    
    return fraseAtualizada; // Retorna a frase para o Estado.jsx

  } catch (err) {
    // ESTE É O LOG MAIS IMPORTANTE: SE O BOTÃO NÃO FAZ NADA, HÁ UM ERRO NO BACKEND/REDE
    console.error("ERRO COMPLETO AO CURTIR FRASE:", err); 
    return null; // Garante que Estado.jsx não tentará usar um erro
  }
};
// ...
// ...





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
        frases.map(f => (
          <div key={f._id} className="bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            <div>
              <h1 className="font-bold text-base">{f.autor}</h1>
              <p className="text-sm text-stone-500">{new Date(f.created_at).toLocaleString()}</p>
            </div>

            <div className="mt-4"><p className="text-base">{f.texto}</p></div>
            <div className="flex mt-4 gap-2 text-purple-500">{f.hashtags.map((tag, i) => <p key={i}>#{tag}</p>)}</div>
            <Estado frase={f} autorLogado={usuarioLogado} onCurtir={handleCurtir} />
          </div>
        ))
      )}
    </section>
  );
}

export default Feed;
