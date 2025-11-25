import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu.jsx";
import Estado from "./Estado.jsx";
import axios from "axios";

const BASE_URL = "https://motiva-mais-3.onrender.com";

// Função para formatar data como DD/MM/AAAA
function formatarData(data) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function Feed() {
  const location = useLocation();
  const { novaFrase } = location.state || {};
  const [frases, setFrases] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [filtro, setFiltro] = useState("recentes"); // recentes ou populares
  const [pesquisaAutor, setPesquisaAutor] = useState(""); // novo estado para pesquisa

  // Carrega feed e usuário logado
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

  // Adiciona nova frase publicada
  useEffect(() => {
    if (!novaFrase) return;
    setFrases(prev => [novaFrase, ...prev]);
  }, [novaFrase]);

  // Curtir frase
  const handleCurtir = async (fraseId) => {
    if (!usuarioLogado) return null;
    try {
      const res = await axios.post(`${BASE_URL}/frases/${fraseId}/curtir`, { usuario: usuarioLogado.nome_perfil });
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Excluir frase
  const handleExcluir = async (fraseId, autor) => {
    if (!confirm("Tem certeza que deseja excluir esta frase?")) return;
    try {
      await axios.delete(`${BASE_URL}/frases/${fraseId}`, { params: { autor } });
      setFrases(prev => prev.filter(f => f._id !== fraseId));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir a frase");
    }
  };
  

  // Ordena as frases de acordo com o filtro
  let frasesFiltradas = [...frases];
  if (filtro === "populares") {
    frasesFiltradas.sort((a, b) => b.curtidas - a.curtidas);
    frasesFiltradas = frasesFiltradas.slice(0, 10);
  } else {
    frasesFiltradas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Filtra frases pelo autor digitado
  if (pesquisaAutor.trim() !== "") {
    const pesquisa = pesquisaAutor.trim().toLowerCase();
    frasesFiltradas = frasesFiltradas.filter(f => f.autor.toLowerCase().includes(pesquisa));
  }

  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen w-full flex flex-col items-center pb-5">
      <Menu />

      <div className="flex flex-col items-center w-85 mt-4">
        {/* Cabeçalho e filtros */}
        <div className="flex items-center justify-between h-20 w-full">
          <h2 className="font-bold text-2xl">Feed</h2>
          <div className="flex gap-8">
            <p
              className={`cursor-pointer ${filtro === "recentes" ? "text-purple-600 font-semibold" : "text-stone-600"}`}
              onClick={() => setFiltro("recentes")}
            >
              Recentes
            </p>
            <p
              className={`cursor-pointer ${filtro === "populares" ? "text-purple-600 font-semibold" : "text-stone-600"}`}
              onClick={() => setFiltro("populares")}
            >
              Populares
            </p>
          </div>
        </div>

        {/* Input de pesquisa por autor */}
        <input
          type="text"
          placeholder="Pesquisar por autor..."
          value={pesquisaAutor}
          onChange={e => setPesquisaAutor(e.target.value)}
          className="w-full border border-zinc-300 rounded-md p-2 mt-1 mb-4 focus:outline-none focus:border-purple-500"
        />
      </div>

      {frasesFiltradas.length === 0 ? (
        <div className="bg-zinc-50 w-85 h-80 mt-4 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-lg">Nenhuma frase encontrada</h3>
        </div>
      ) : (
        frasesFiltradas.map(f => (
          <div key={f._id} className="relative bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-4">
            {usuarioLogado?.nome_perfil === f.autor && (
              <button
                onClick={() => handleExcluir(f._id, f.autor)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Excluir frase"
              >
                🗑️
              </button>
            )}

            <div>
              <h1 className="font-bold text-base">{f.autor}</h1>
              <p className="text-sm text-stone-500">{formatarData(f.created_at)}</p>
            </div>

            <div className="mt-4">
              <p className="text-base break-words whitespace-pre-wrap">{f.texto}</p>
            </div>

            <div className="flex mt-4 gap-2 text-purple-500">
              {f.hashtags.map((tag, i) => <p key={i}>{tag}</p>)}
            </div>

            <Estado frase={f} autorLogado={usuarioLogado} onCurtir={handleCurtir} />
          </div>
        ))
      )}
    </section>
  );
}

export default Feed;
