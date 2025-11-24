import { useState } from "react";
import Menu from "./Menu.jsx";
import axios from "axios";

function Publicar() {
    const [texto, setTexto] = useState("");
    const [hashtags, setHashtags] = useState("");
    
    const handlePublicar = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:8000/frases", {
                texto: texto,
                hashtags: hashtags.split(" "), // transforma em array
                autor: "Jairo D'aguila" // futuramente será dinâmico pelo login
            });
            alert(res.data.msg);
            setTexto("");
            setHashtags("");
        } catch (error) {
            console.error(error);
            alert("Erro ao publicar a frase");
        }
    }

    return (
        <>
            <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-full w-full flex flex-col items-center ">
                <Menu />
                <div className="bg-zinc-50 w-85 h-115 mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-5">
                    <h1 className="font-bold text-2xl">Criar Frase</h1>
                    <textarea
                        className="w-full h-30 border-2 border-purple-300 rounded-md p-2 mt-1 resize-none focus:outline-none focus:border-purple-500"
                        placeholder="Compartilhe uma mensagem inspirada..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                    ></textarea>

                    <input
                        type="text"
                        placeholder="#motivação #inspiração #sucesso"
                        className="border text-sm border-zinc-300 rounded-md p-3 pl-2 mb-1 w-full focus:border-purple-500 focus:outline-none transition-colors duration-300 mt-1"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                    />

                    <button
                        onClick={handlePublicar}
                        className="bg-gradient-to-l from-blue-600 to-purple-500 text-white rounded-md p-3 hover:bg-gradient-to-l hover:from-blue-700 hover:to-purple-600 transition-colors hover:scale-105 transition-transform duration-300 cursor-pointer w-full text-center mt-6"
                    >
                        Publicar
                    </button>
                </div>
            </section>
        </>
    )
}

export default Publicar;
