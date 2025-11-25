import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = { nome: login, senha };

    // ... (código anterior)

 try {
 const response = await fetch("https://motiva-mais-3.onrender.com/login", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(data)
 });

 const result = await response.json();

 if (response.ok) {
 sessionStorage.setItem("token", result.token);
localStorage.setItem("usuario", JSON.stringify({ nome: login }));
navigate("/feed");
} else {
            // response.ok é FALSO para 422, 401, 404, etc.
            // Aqui tratamos os erros que VEM do servidor.
setErro(result.detail || result.msg || "Erro desconhecido. Verifique login/senha.");
}
 } catch (err) {
 console.error("Falha na rede ou na leitura da resposta:", err);
setErro("Erro ao conectar ao servidor ou processar resposta.");
}
 };
// ...

  return (
    <>
      <main className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full flex flex-col items-center ">
        <div className="mb-10 mt-10 flex flex-col items-center">
          <h1 style={{ fontFamily: "Dancing Script" }} className="font-[Dancing Script] font-bold text-7xl">Motiva+</h1>
          <p>Inspire-se e inspire outros</p>
        </div>

        <div className="bg-zinc-50 w-85 h-100 mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-10">
          <h1 className="font-bold text-2xl">Entrar</h1>

          <form className="flex flex-col mt-4 gap-1" onSubmit={handleLogin}>
            <label className="text-sm">Login</label>
            <input
              type="text"
              placeholder="Digite seu Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="border text-sm border-zinc-300 rounded-md p-3 pl-2 mb-4 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            />

            <label className="text-sm">Senha</label>
            <input
              type="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="border text-sm border-zinc-300 rounded-md p-3 mb-4 pl-2 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            />

            <button
              type="submit"
              className="bg-gradient-to-l from-blue-600 to-purple-500 text-white rounded-md p-3 hover:bg-gradient-to-l hover:from-blue-700 hover:to-purple-600 transition-colors hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              Entrar
            </button>
          </form>

          {erro && <p className="text-red-500 mt-2">{erro}</p>}

          <div className="mt-6 text-center text-base">
            <p>Não tem uma conta? <Link to="/cadastro" className="text-purple-500 pl-1 inline-block hover:scale-105 ">Cadastre-se</Link></p>
          </div>
        </div>
      </main>
    </>
  )
}

export default App;
