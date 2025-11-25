import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function UploadFoto() {
  const location = useLocation();
  const usuario = location.state?.usuario;
  const [file, setFile] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      setErro("Escolha uma imagem antes de enviar");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `https://motiva-mais-3.onrender.com/usuarios/${usuario.nome}/upload-foto`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const usuarioAtualizado = { ...usuario, foto: res.data.foto_url };
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      setSucesso("Foto enviada com sucesso!");

      setTimeout(() => navigate("/feed"), 1000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar foto");
    }
  };

  return (
    <div className="bg-zinc-50 w-85 h-80 mt-10 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Escolha sua foto de perfil</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-gradient-to-l from-blue-600 to-purple-500 text-white rounded-md p-3 mt-4 hover:from-blue-700 hover:to-purple-600 transition-transform hover:scale-105"
      >
        Enviar Foto
      </button>
      {erro && <p className="text-red-500 mt-2">{erro}</p>}
      {sucesso && <p className="text-green-500 mt-2">{sucesso}</p>}
    </div>
  );
}

export default UploadFoto;
