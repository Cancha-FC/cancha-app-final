import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import CardFooter from '../../Components/footer'; 
import CardHeader from '../../Components/header'; 
import FilterBar from '../../Components/FilterBar/FilterBar'; // Importe o FilterBar para usar o DatePicker e dropdown
import './HomePage.css'; // Importar o arquivo CSS para estilização

const HomePage = () => {
  const [filters, setFilters] = useState({}); // Estado para armazenar os filtros aplicados

  // Função chamada quando o filtro é aplicado
  const handleFilter = (filterData) => {
    setFilters(filterData); // Atualiza os filtros aplicados
  };

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <h1>Home</h1>

      {/* Adicionando o componente FilterBar para o DatePicker e Licenciado */}
      <FilterBar onFilter={handleFilter} />

      {/* Adicionando os Cards */}
      <div className="card-container">
        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-shopping-cart"></i>
            </div>
            <div className="card-info">
              <h3>Pedidos</h3>
              <span>3.941</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-box"></i>
            </div>
            <div className="card-info">
              <h3>Volume</h3>
              <span>5.611</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-dollar"></i>
            </div>
            <div className="card-info">
              <h3>Venda</h3>
              <span>R$512.611</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-money-bill"></i>
            </div>
            <div className="card-info">
              <h3>Comissão</h3>
              <span>R$51.611</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
}

export default HomePage;
