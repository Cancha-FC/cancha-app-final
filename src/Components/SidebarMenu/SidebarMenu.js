import React, { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './SidebarMenu.css'; // Certifique-se de ter o CSS correto para a sidebar
import { useNavigate } from 'react-router-dom'; // Hook para navegação

const SidebarMenu = ({ isOpen, toggleMenu }) => {
  const toast = useRef(null);
  const navigate = useNavigate(); // Para navegação

  const isStaff = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.is_staff;
    }
    return false;
  };

  const items = [
    {
      label: 'BI Cancha',
      items: [
        {
          label: 'Home',
          icon: 'pi pi-home',
          command: () => navigate('/home') // Navega para a página Home
        },
      
      ]
    },
    // Condicionalmente adiciona o menu 'Genesis' se o usuário for staff
    ...(isStaff()
      ? [
          {

            label: 'Cancha Administrativo',
            items: [

            {
              label: 'Ranking',
              icon: 'pi pi-chart-line',
              command: () => navigate('/ranking') // Navega para a página Ranking
            },


          
              {
                label: 'Usuários',
                icon: 'pi pi-users',
                command: () => navigate('/usuarios') // Navega para a página Usuarios
              },
              {
                label: 'Licenciados',
                icon: 'pi pi-id-card',
                command: () => navigate('/licenciados') // Navega para a página Licenciados
              }
            ]
          }
        ]
      : [])
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'active' : ''}`}>
      <Button icon="pi pi-bars" className="menu-button" onClick={toggleMenu} />
      <Toast ref={toast} />
      <Menu model={items} />
      <Button label="Logout" icon="pi pi-sign-out" className="logout-button" onClick={handleLogout} />
    </div>
  );
};

export default SidebarMenu;