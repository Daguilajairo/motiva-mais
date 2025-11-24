import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './components/App.jsx'
import Feed from './components/Feed.jsx'
import Populares from './components/Populares.jsx'
import Publicar from './components/Publicar.jsx'
import Salvos from './components/Salvos.jsx'
import Cadastro from './components/CAdastro.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/populares" element={<Populares />} />
        <Route path="/publicar" element={<Publicar />} />
        <Route path="/salvos" element={<Salvos />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
