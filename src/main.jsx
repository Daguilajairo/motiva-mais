import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'

import App from './components/App.jsx'
import Feed from './components/Feed.jsx'
import Publicar from './components/Publicar.jsx'
import Cadastro from './components/Cadastro.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/publicar" element={<Publicar />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
