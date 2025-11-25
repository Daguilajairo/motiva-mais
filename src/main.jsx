import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importando componentes
import App from "./components/App.jsx";
import Cadastro from "./components/Cadastro.jsx";
import Feed from "./components/Feed.jsx";
import Publicar from "./components/Publicar.jsx";

// Root
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/publicar" element={<Publicar />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
