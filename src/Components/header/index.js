// index.js
import React, { useState } from 'react';
import './CardHeader.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import SidebarMenu from '../SidebarMenu/SidebarMenu';

const CardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Button icon="pi pi-check" rounded text aria-label="Filter" />
          <Button icon="pi pi-user" rounded text severity="secondary" aria-label="Bookmark" />
          <Button icon="pi pi-sign-out" rounded text severity="secondary" aria-label="Bookmark" />
        </div>
      </div>

      {/* Sidebar abaixo do header */}
      <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default CardHeader;
