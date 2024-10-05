import React, { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './SidebarMenu.css'; // Certifique-se de ter o CSS correto para a sidebar
import { useNavigate } from 'react-router-dom'; // Hook para navegação

const SidebarMenu = ({ isOpen, toggleMenu }) => {
  const toast = useRef(null);
  const navigate = useNavigate(); // Para navegação

  const items = [
    {
      label: 'BI Cancha',
      items: [
        {
          label: 'Home',
          icon: 'pi pi-plus',
          command: () => navigate('/') // Navega para a página Home
        },
        {
          label: 'Ranking',
          icon: 'pi pi-search',
          command: () => navigate('/ranking') // Navega para a página Ranking
        }
      ]
    },
    {
      label: 'Genesis',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-cog',
          command: () => navigate('/usuarios') // Navega para a página Usuarios
        },
        {
          label: 'Licenciados',
          icon: 'pi pi-sign-out',
          command: () => navigate('/licenciados') // Navega para a página Licenciados
        }
      ]
    }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'active' : ''}`}>
      <Button icon="pi pi-bars" rounded text aria-label="Filter" onClick={toggleMenu} />
      <Toast ref={toast} />
      <Menu model={items} />


    </div>
  );
};

export default SidebarMenu;

