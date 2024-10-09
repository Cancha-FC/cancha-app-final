// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SidebarMenu from './Components/SidebarMenu/SidebarMenu';
import HomePage from './Pages/HomePage/HomePage';
import RankingPage from './Pages/RankingPage/RankingPage';
import UsuariosPage from './Pages/UsuarioPages/UsuarioPage';
import LicenciadosPages from './Pages/LicenciadosPage/LicenciadosPage';
import LoginPage from './Pages/Login/LoginPage';

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  return !!token;
};

const isStaff = () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const user = JSON.parse(userData);
    return user.is_staff;
  }
  return false;
};

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    console.log("Acesso negado, redirecionando para login");
    return <Navigate to="/login" />;
  }
  return children;
};

const StaffRoute = ({ children }) => {
  if (!isAuthenticated()) {
    console.log("Acesso negado, redirecionando para login");
    return <Navigate to="/login" />;
  } else if (!isStaff()) {
    console.log("Acesso negado, usuário não é staff");
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isUserAuthenticated = isAuthenticated();

  return (
    <Router>
      <div className="App">
        {isUserAuthenticated && (
          <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        )}
        <Routes>
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/ranking" element={<PrivateRoute><RankingPage /></PrivateRoute>} />
          <Route path="/licenciados" element={<PrivateRoute><LicenciadosPages /></PrivateRoute>} />
          <Route path="/usuarios" element={<StaffRoute><UsuariosPage /></StaffRoute>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;