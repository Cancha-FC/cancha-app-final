import React, { useState } from 'react';
import './CardHeader.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import { useNavigate } from 'react-router-dom';

const CardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    console.log("Logout clicado"); // Verifique se esta mensagem aparece
    localStorage.removeItem('token'); // Remove o token
    navigate('/login'); // Redireciona para o login
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="menu">
          <Button icon="pi pi-bars" rounded text aria-label="Filter" onClick={toggleMenu} />
        </div>

        <div className="titulo">
          <h1>CANCHA FC</h1>
        </div>

        <div className="botoes">
          <Button icon="pi pi-user" rounded text severity="secondary" aria-label="Bookmark" />
          <Button 
            icon="pi pi-sign-out" 
            rounded 
            text 
            severity="secondary" 
            aria-label="Logout" 
            onClick={handleLogout} // Chama a função de logout
          />
        </div>
      </div>

      {/* Sidebar abaixo do header */}
      <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default CardHeader;