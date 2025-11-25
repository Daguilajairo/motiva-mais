import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <header className="w-full flex px-6 py-4 justify-between items-center border-2 border-blue-200 z-20 bg-white/50 backdrop-blur-md">
                <h1 style={{ fontFamily: "Dancing Script" }} className="font-bold text-4xl text-purple-500">
                    Motiva+
                </h1>

                {/* Links horizontais visíveis a partir do md */}
                <ul className="hidden md:flex gap-6 text-lg items-center">
                    <li
                        className="cursor-pointer hover:text-purple-500 hover:scale-110"
                        onClick={() => navigate("/feed")}
                    >
                        📌 Feed
                    </li>
                    <li
                        className="cursor-pointer hover:text-purple-500 hover:scale-110"
                        onClick={() => navigate("/publicar")}
                    >
                        ✏️ Publicar
                    </li>
                    <li
                        className="cursor-pointer hover:text-purple-500 hover:scale-110"
                        onClick={() => navigate("/")}
                    >
                        🚪 Sair
                    </li>
                </ul>

                {/* Botão hamburguer visível apenas em mobile */}
                <img
                    className="w-8 h-8 hover:scale-110 cursor-pointer md:hidden"
                    src="/img/icon-menu.png"
                    onClick={() => setMenuOpen(!menuOpen)}
                />
            </header>

            {/* Overlay do menu mobile */}
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
                    <li
                        className="cursor-pointer hover:text-purple-500 hover:scale-110"
                        onClick={() => { navigate("/feed"); setMenuOpen(false); }}
                    >
                        📌 Feed
                    </li>
                    <li
                        className="cursor-pointer hover:text-purple-500 hover:scale-110"
                        onClick={() => { navigate("/publicar"); setMenuOpen(false); }}
                    >
                        ✏️ Publicar
                    </li>
                    <li
                        className="cursor-pointer hover:text-purple-500 hover:scale-110"
                        onClick={() => { navigate("/"); setMenuOpen(false); }}
                    >
                        🚪 Sair
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Header;
