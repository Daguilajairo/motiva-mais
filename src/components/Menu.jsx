import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [sucessoSenha, setSucessoSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAlterarSenha = async () => {
    setErroSenha("");
    setSucessoSenha("");

    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      setErroSenha("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setErroSenha("A nova senha e confirmação não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario?.token) {
        setErroSenha("Usuário não autenticado.");
        return;
      }

      const response = await fetch("https://motiva-mais-3.onrender.com/alterar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuario.token}`
        },
        body: JSON.stringify({
          senha_atual: senhaAtual,
          nova_senha: novaSenha
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSucessoSenha("Senha alterada com sucesso!");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmaSenha("");
      } else {
        setErroSenha(result.detail || "Erro ao alterar a senha.");
      }
    } catch (err) {
      console.error(err);
      setErroSenha("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="w-full flex px-6 py-4 justify-between items-center border-2 border-blue-200 z-20 bg-white/50 backdrop-blur-md">
        <h1 style={{ fontFamily: "Dancing Script" }} className="font-bold text-4xl text-purple-500">
          Motiva+
        </h1>

        {/* Menu desktop */}
        <ul className="hidden md:flex gap-6 text-lg items-center">
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => navigate("/feed")}>
            📌 Feed
          </li>
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => navigate("/publicar")}>
            ✏️ Publicar
          </li>
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => setModalOpen(true)}>
            🔑 Alterar senha
          </li>
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => navigate("/")}>
            🚪 Sair
          </li>
        </ul>

        {/* Botão hamburguer mobile */}
        <img
          className="w-8 h-8 hover:scale-110 cursor-pointer md:hidden"
          src="/img/icon-menu.png"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </header>

      {/* Overlay menu mobile */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
        ></div>
      )}

      {/* Menu mobile */}
      <nav
        className={`fixed top-0 right-0 h-70 w-64 bg-white shadow-xl z-20 p-6 transform transition-transform duration-300 rounded-xl ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <h2 className="text-3xl font-bold mb-6 text-purple-600">Menu</h2>

        <ul className="flex flex-col gap-6 text-lg">
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => { navigate("/feed"); setMenuOpen(false); }}>
            📌 Feed
          </li>
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => { navigate("/publicar"); setMenuOpen(false); }}>
            ✏️ Publicar
          </li>
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => { setModalOpen(true); setMenuOpen(false); }}>
            🔑 Alterar senha
          </li>
          <li className="cursor-pointer hover:text-purple-500 hover:scale-110" onClick={() => { navigate("/"); setMenuOpen(false); }}>
            🚪 Sair
          </li>
        </ul>
      </nav>

      {/* Modal Alterar Senha */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="bg-white rounded-xl p-6 w-80 relative">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">Alterar Senha</h2>

            <input
              type="password"
              placeholder="Senha atual"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:border-purple-500"
            />
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:border-purple-500"
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmaSenha}
              onChange={e => setConfirmaSenha(e.target.value)}
              className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:border-purple-500"
            />

            {erroSenha && <p className="text-red-500 mb-2">{erroSenha}</p>}
            {sucessoSenha && <p className="text-green-500 mb-2">{sucessoSenha}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-md border hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAlterarSenha}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
