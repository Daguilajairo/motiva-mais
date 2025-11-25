import { useState } from "react";
import axios from "axios";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoFile, setFotoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("senha", senha);
    if (fotoFile) formData.append("file", fotoFile);

    try {
      const res = await axios.post(
        "https://motiva-mais-3.onrender.com/registrar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Salva no localStorage
      const usuario = { nome, foto: res.data.foto };
      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert("Cadastro realizado com sucesso!");
      window.location.href = "/login";

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Erro ao cadastrar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFotoFile(e.target.files[0])}
      />
      <button type="submit" className="bg-purple-500 text-white p-2 rounded">
        Cadastrar
      </button>
    </form>
  );
}

export default Cadastro;
