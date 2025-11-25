import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const BASE_URL = "https://motiva-mais-3.onrender.com";

function Cadastro() {
  const [nomePerfil, setNomePerfil] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
  e.preventDefault();
  setErro("");
  console.log("-> Enviando cadastro:", { nomePerfil, login, senha, confirmaSenha });

  if (!nomePerfil.trim() || !login.trim() || !senha.trim() || !confirmaSenha.trim()) {
    setErro("Preencha todos os campos.");
    return;
  }

  if (senha !== confirmaSenha) {
    setErro("As senhas não conferem.");
    return;
  }

  const formData = new FormData();
  formData.append("nome_perfil", nomePerfil);
  formData.append("login", login);
  formData.append("senha", senha);

  try {
    const res = await fetch(`${BASE_URL}/registrar`, {
      method: "POST",
      body: formData,
    });

    // tenta obter body como json, mas cai para text se falhar
    let result;
    try {
      result = await res.json();
    } catch  {
      const txt = await res.text();
      console.warn("Resposta não-JSON:", txt);
      result = { msg: txt };
    }

    if (res.ok) {
      console.log("Cadastro OK:", result);
      localStorage.setItem(
        "usuario",
        JSON.stringify({ nome: nomePerfil, login: login, foto: result.foto })
      );
      navigate("/");
      return;
    }

    // Se chegou aqui, res.ok === false
    console.warn("Cadastro retornou erro. status:", res.status, "body:", result);

    // FastAPI retorna detail -> array quando 422
    if (result?.detail) {
      if (Array.isArray(result.detail)) {
        // escolhe a primeira mensagem e tenta extrair o campo (loc)
        const first = result.detail[0];
        const campo = Array.isArray(first.loc) ? first.loc.slice(-1)[0] : undefined;
        const mensagem = first.msg || "Campo obrigatório";
        setErro(campo ? `${campo}: ${mensagem}` : mensagem);
      } else if (typeof result.detail === "string") {
        setErro(result.detail);
      } else {
        setErro(JSON.stringify(result.detail));
      }
    } else if (result?.msg) {
      setErro(result.msg);
    } else {
      setErro("Erro ao cadastrar usuário");
    }

  } catch (_err) {
    console.error("Erro no fetch:", _err);
    setErro("Erro ao conectar ao servidor.");
  }
};


  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <main className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full flex flex-col items-center">
      <div className="mb-5 sm:mb-2 mt-2 flex flex-col items-center">
        <h1 style={{ fontFamily: "'Dancing Script', cursive" }} className="font-bold text-7xl text-purple-500">
          Motiva+
        </h1>
        <p>Crie sua conta e comece a inspirar</p>
      </div>

      <div className="bg-zinc-50 w-85 h-130 rounded-xl shadow-lg p-6 flex flex-col pt-5">
        <h1 className="font-bold text-2xl">Cadastro</h1>

        <form className="flex flex-col mt-4" onSubmit={handleCadastro}>
          
          {/* NOME DO PERFIL */}
          <label className="text-sm">Nome do Perfil</label>
          <input
            name="nome_perfil"
            type="text"
            placeholder="Nome que aparecerá no perfil"
            value={nomePerfil}
            onChange={(e) => setNomePerfil(capitalize(e.target.value))}
            className="border text-sm border-zinc-300 rounded-md p-3 pl-2 mb-4 focus:border-purple-500 focus:outline-none"
          />

          {/* LOGIN */}
          <label className="text-sm">Login</label>
          <input
            name="login"
            type="text"
            placeholder="Seu login de acesso"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="border text-sm border-zinc-300 rounded-md p-3 pl-2 mb-4 focus:border-purple-500 focus:outline-none"
          />

          {/* SENHA */}
          <label className="text-sm">Senha</label>
          <input
            name="senha"
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border text-sm border-zinc-300 rounded-md p-3 mb-4 pl-2 focus:border-purple-500 focus:outline-none"
          />

          {/* CONFIRMAR SENHA */}
          <label className="text-sm">Confirmar Senha</label>
          <input
            type="password"
            placeholder="********"
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
            className="border text-sm border-zinc-300 rounded-md p-3 mb-4 pl-2 focus:border-purple-500 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-gradient-to-l from-blue-600 to-purple-500 text-white rounded-md p-3 hover:scale-105 transition-transform"
          >
            Cadastrar
          </button>
        </form>

        {erro && <p className="text-red-500 mt-2">{erro}</p>}

        <div className="mt-4 text-center text-base">
          <p>
            Já tem conta?{" "}
            <Link to="/" className="text-purple-500 hover:scale-105">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Cadastro;
