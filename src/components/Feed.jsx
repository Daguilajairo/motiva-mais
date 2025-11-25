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

  const handleCurtir = async (fraseId) => {
    if (!usuarioLogado) return;
    try {
      const res = await axios.post(`${BASE_URL}/frases/${fraseId}/curtir`, { usuario: usuarioLogado.nome });
      setFrases(prev => prev.map(f => f._id === fraseId ? { ...f, ...res.data } : f));
    } catch (err) { console.error(err); }
  };

  const handleSalvar = async (fraseId) => {
    if (!usuarioLogado) return;
    try {
      const res = await axios.post(`${BASE_URL}/frases/${fraseId}/salvar`, { usuario: usuarioLogado.nome });
      setFrases(prev => prev.map(f => f._id === fraseId ? { ...f, ...res.data } : f));
    } catch (err) { console.error(err); }
  };

  const handleAvatarChange = async (event, usuarioNome) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${BASE_URL}/usuarios/${usuarioNome}/upload-foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const usuarioAtualizado = { ...usuarioLogado, foto: res.data.foto_url };
      setUsuarioLogado(usuarioAtualizado);
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

      setFrases(prev => prev.map(f => f.autor === usuarioAtualizado.nome ? { ...f, foto: usuarioAtualizado.foto } : f));
    } catch (err) { console.error(err); }
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
        frases.map(f => (
          <div key={f._id} className="bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            <div className="flex gap-2 items-center">
              <label htmlFor={`avatar-${f._id}`}>
                <img className="w-12 h-12 hover:scale-110 cursor-pointer rounded-full"
                  src={f.foto || `${BASE_URL}/img/icon-avatar.png`}
                  alt="avatar"
                />
              </label>

              {f.autor === usuarioLogado?.nome && (
                <input
                  id={`avatar-${f._id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarChange(e, f.autor)}
                />
              )}

              <div>
                <h1 className="font-bold text-base">{f.autor}{f.autor === usuarioLogado?.nome ? " (Você)" : ""}</h1>
                <p className="text-sm text-stone-500">{new Date(f.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4"><p className="text-base">{f.texto}</p></div>
            <div className="flex mt-4 gap-2 text-purple-500">{f.hashtags.map((tag, i) => <p key={i}>#{tag}</p>)}</div>
            <Estado frase={f} autorLogado={usuarioLogado} onCurtir={handleCurtir} onSalvar={handleSalvar} />
          </div>
        ))
      )}
    </section>
  );
}

export default Feed;
