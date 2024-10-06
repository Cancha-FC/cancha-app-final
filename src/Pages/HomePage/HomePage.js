import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Chart } from 'primereact/chart';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar';
import './HomePage.css'; // Estilos personalizados

const HomePage = () => {
  const [filters, setFilters] = useState({});

  // Função chamada quando o filtro é aplicado
  const handleFilter = (filterData) => {
    setFilters(filterData);
  };

  // Dados para o gráfico de "Venda x Dia"
  const vendasPorDia = {
    labels: ['01/01/2024', '02/01/2024', '03/01/2024', '04/01/2024', '05/01/2024', '06/01/2024', '07/01/2024'],
    datasets: [
      {
        label: 'Vendas',
        backgroundColor: '#46ad5a',
        data: [10, 7, 6, 9, 12, 8, 10]
      }
    ]
  };

  // Dados para o gráfico de "Venda x Produto"
  const vendasPorProduto = {
    labels: ['Produto 1', 'Produto 2', 'Produto 3', 'Produto 4', 'Produto 5', 'Produto 6', 'Produto 7', 'Produto 8', 'Produto 9', 'Produto 10'],
    datasets: [
      {
        label: 'Vendas',
        backgroundColor: '#46ad5a',
        data: [12, 9, 7, 8, 12, 10, 6, 5, 4, 3]
      }
    ]
  };

  // Opções para customizar o gráfico de barras verticais
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Opções para o gráfico de barras horizontais
  const horizontalChartOptions = {
    indexAxis: 'y', // Muda para barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <h1>Home</h1>

      <FilterBar onFilter={handleFilter} />

      {/* Gráfico de Venda x Dia */}
      <div className="chart-container">
        <h2>Venda x Dia</h2>
        <Chart type="bar" data={vendasPorDia} options={chartOptions} />
      </div>

      {/* Gráfico de Venda x Produto - Barras Horizontais */}
      <div className="chart-container">
        <h2>Venda x Produto</h2>
        <Chart type="bar" data={vendasPorProduto} options={horizontalChartOptions} />
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
}

export default HomePage;
