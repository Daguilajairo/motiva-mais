import { Link } from "react-router-dom";

function Menu() {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-white shadow-md rounded-b-xl">
      <h1 className="font-bold text-xl">Motiva+</h1>
      <div className="flex items-center gap-4">
        <Link to="/feed" className="text-purple-500 font-semibold">Feed</Link>
        <Link to="/publicar" className="text-purple-500 font-semibold">Publicar</Link>
        {usuario && <img src={usuario.foto} alt="Avatar" className="w-10 h-10 rounded-full"/>}
      </div>
    </nav>
  );
}

export default Menu;
