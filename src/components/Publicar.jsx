import { useState } from "react";
import Menu from "./Menu.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://motiva-mais-3.onrender.com";

function Publicar() {
  const [texto, setTexto] = useState("");
  const [hashtags, setHashtags] = useState("");
  const navigate = useNavigate();

  const handlePublicar = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return alert("Você precisa estar logado");

    try {
      const res = await axios.post(`${BASE_URL}/frases`, {
        texto,
        hashtags: hashtags.split(" "),
        autor: usuario.nome
      });

      setTexto(""); setHashtags("");
      navigate("/feed", { state: { novaFrase: res.data.frase } });
    } catch (err) {
      console.error(err);
      alert("Erro ao publicar a frase");
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-full w-full flex flex-col items-center">
      <Menu />
      <div className="bg-zinc-50 w-85 h-115 mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-5">
        <h1 className="font-bold text-2xl">Criar Frase</h1>
        <textarea placeholder="Compartilhe uma mensagem inspirada..." value={texto} onChange={e => setTexto(e.target.value)}
          className="w-full h-30 border-2 border-purple-300 rounded-md p-2 mt-1 resize-none focus:outline-none focus:border-purple-500"/>
        <input type="text" placeholder="#motivação #inspiração" value={hashtags} onChange={e => setHashtags(e.target.value)}
          className="border text-sm border-zinc-300 rounded-md p-3 pl-2 mb-1 w-full focus:border-purple-500 focus:outline-none transition-colors duration-300 mt-1"/>
        <button onClick={handlePublicar} className="bg-gradient-to-l from-blue-600 to-purple-500 text-white rounded-md p-3 hover:scale-105 transition-transform mt-6 w-full">Publicar</button>
      </div>
    </section>
  );
}

export default Publicar;
