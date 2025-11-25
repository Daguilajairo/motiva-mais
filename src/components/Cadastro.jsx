import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const navigate = useNavigate();
  const BASE_URL = "https://motiva-mais-3.onrender.com";

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmaSenha) {
      setErro("As senhas não conferem");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ nome, senha }).toString()
      });

      const result = await res.json();

      if (res.ok) {
        setSucesso("Usuário cadastrado com sucesso!");
        setErro("");
        setNome(""); setSenha(""); setConfirmaSenha("");

        const usuarioCadastrado = { nome, foto: result.foto };
        localStorage.setItem("usuario", JSON.stringify(usuarioCadastrado));

        navigate("/feed");
      } else {
        setErro(result.detail || result.msg || "Erro ao cadastrar usuário");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao conectar ao servidor");
    }
  };

  return (
    <main className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full flex flex-col items-center">
      <div className="mb-10 mt-2 flex flex-col items-center">
        <h1 className="font-[Dancing Script] font-bold text-7xl">Motiva+</h1>
        <p>Crie sua conta e comece a inspirar</p>
      </div>

      <div className="bg-zinc-50 w-85 h-130 rounded-xl shadow-lg p-6 flex flex-col pt-5">
        <h1 className="font-bold text-2xl">Cadastro</h1>
        <form className="flex flex-col mt-4 gap-1" onSubmit={handleCadastro}>
          <label className="text-sm">Nome do usuário</label>
          <input type="text" placeholder="Digite seu Login" value={nome} onChange={(e) => setNome(e.target.value)} className="border text-sm border-zinc-300 rounded-md p-3 pl-2 mb-4 focus:border-purple-500 focus:outline-none"/>
          <label className="text-sm">Data Nascimento</label>
          <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="border text-sm border-zinc-300 rounded-md p-3 mb-4 pl-2 focus:border-purple-500 focus:outline-none"/>
          <label className="text-sm">Senha</label>
          <input type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)} className="border text-sm border-zinc-300 rounded-md p-3 mb-4 pl-2 focus:border-purple-500 focus:outline-none"/>
          <label className="text-sm">Confirmar Senha</label>
          <input type="password" placeholder="********" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} className="border text-sm border-zinc-300 rounded-md p-3 mb-4 pl-2 focus:border-purple-500 focus:outline-none"/>
          <button type="submit" className="bg-gradient-to-l from-blue-600 to-purple-500 text-white rounded-md p-3 hover:scale-105 transition-transform">Cadastrar</button>
        </form>

        {erro && <p className="text-red-500 mt-2">{erro}</p>}
        {sucesso && <p className="text-green-500 mt-2">{sucesso}</p>}

        <div className="mt-2 text-center text-base">
          <p>Já tem conta? <Link to="/" className="text-purple-500 hover:scale-105">Entre aqui</Link></p>
        </div>
      </div>
    </main>
  );
}

export default Cadastro;
