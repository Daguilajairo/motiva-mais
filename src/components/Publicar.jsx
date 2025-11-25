import { useState } from "react";
import Menu from "./Menu.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://motiva-mais-3.onrender.com";

function Publicar() {
  const [texto, setTexto] = useState("");
  const [hashtags, setHashtags] = useState("");
  const navigate = useNavigate();

  const maxChars = 120;
  const maxTags = 3;

  // Converte hashtags digitadas para lista separada
  const tagList = hashtags.trim().split(" ").filter(tag => tag !== "");

  const handlePublicar = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return alert("Você precisa estar logado");

  const tagList = hashtags.trim().split(" ").filter(tag => tag !== "");

  if (texto.length > maxChars)
    return alert(`A frase deve ter no máximo ${maxChars} caracteres.`);

  if (tagList.length > maxTags)
    return alert(`São permitidas no máximo ${maxTags} hashtags.`);

  try {
    const res = await axios.post(`${BASE_URL}/frases`, {
      texto,
      hashtags: tagList,
      autor: usuario.nome_perfil
    });

    // Adiciona a nova frase ao feed
    navigate("/feed", { state: { novaFrase: res.data.frase } });

    // Limpa os campos
    setTexto("");
    setHashtags("");

  } catch (err) {
    console.error("Erro ao publicar frase:", err);

    // Tenta extrair a mensagem do backend
    let mensagem = "Erro ao publicar a frase";

    if (err.response?.data) {
      const data = err.response.data;
      if (data.detail) {
        // detail pode ser string ou array
        if (Array.isArray(data.detail)) {
          mensagem = data.detail.map(d => d.msg || JSON.stringify(d)).join(", ");
        } else if (typeof data.detail === "string") {
          mensagem = data.detail;
        } else {
          mensagem = JSON.stringify(data.detail);
        }
      } else if (data.msg) {
        mensagem = data.msg;
      }
    } else if (err.message) {
      mensagem = err.message;
    }

    alert(mensagem);
  }
};


  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen w-full flex flex-col items-center">
      <Menu />

      <div className="bg-zinc-50 w-85 h-auto mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-5">
        <h1 className="font-bold text-2xl">Criar Frase</h1>
        <p className="text-sm text-stone-600 pb-2">Sua frase motivacional</p>

        <textarea
          placeholder="Compartilhe uma mensagem inspirada..."
          value={texto}
          maxLength={maxChars}
          onChange={e => setTexto(e.target.value)}
          className="w-full h-30 border-2 border-purple-300 rounded-md p-2 mt-1 resize-none focus:outline-none focus:border-purple-500"
        />

        <p className="text-right text-xs text-stone-500">
          {texto.length}/{maxChars}
        </p>

        <input
          type="text"
          placeholder="#motivação #inspiração"
          value={hashtags}
          onChange={e => setHashtags(e.target.value)}
          className="border text-sm border-zinc-300 rounded-md p-3 pl-2 mt-3 mb-1 w-full focus:border-purple-500 focus:outline-none transition-colors duration-300"
        />

        <p className="text-right text-xs text-stone-500">
          {tagList.length}/{maxTags} hashtags
        </p>

        <button
          onClick={handlePublicar}
          className="bg-gradient-to-l from-blue-600 to-purple-500 text-white rounded-md p-3 hover:scale-105 transition-transform mt-6 w-full"
        >
          Publicar
        </button>
      </div>

      <div className="bg-gradient-to-b from-purple-100 to-blue-100 rounded-xl p-5 mt-5 shadow-lg">
        <h1 className="pb-2">Dicas para uma boa frase:</h1>
        <p className="text-stone-700">✓ Seja autêntico e inspirador</p>
        <p className="text-stone-700">✓ Mantenha uma mensagem clara e direta</p>
        <p className="text-stone-700">✓ Compartilhe positividade e energia boa</p>
      </div>
    </section>
  );
}

export default Publicar;
