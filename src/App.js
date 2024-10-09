import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SidebarMenu from './Components/SidebarMenu/SidebarMenu';
import HomePage from './Pages/HomePage/HomePage'; // Verifique se o caminho está correto
import RankingPage from './Pages/RankingPage/RankingPage';
import UsuariosPage from './Pages/UsuarioPages/UsuarioPage';
import LicenciadosPages from './Pages/LicenciadosPage/LicenciadosPage';
import LoginPage from './Pages/Login/LoginPage'; // Certifique-se de que o caminho está correto

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Token:", token); // Verifique se o token está aqui
  return !!token; // Retorna true se o token existir
};

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    console.log("Acesso negado, redirecionando para login");
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <Routes>
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/ranking" element={<PrivateRoute><RankingPage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UsuariosPage /></PrivateRoute>} />
          <Route path="/licenciados" element={<PrivateRoute><LicenciadosPages /></PrivateRoute>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;