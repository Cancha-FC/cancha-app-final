import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar'; // Componente de filtro
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../service/ProductService';
import { SelectButton } from 'primereact/selectbutton';
import './RankingPage.css';

const RankingPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const options = ['Licenciado', 'Produto'];  // Opções do SelectButton
  const [value, setValue] = useState(options[0]); // Estado inicial como "Licenciado"

  // Busca os dados
  useEffect(() => {
    ProductService.getProductsMini().then(data => {
      if (filters.startDate || filters.endDate || filters.selectedLicensee) {
        const filteredData = data.filter(product => {
          let match = true;
          if (filters.startDate) {
            match = match && product.date >= filters.startDate;
          }
          if (filters.endDate) {
            match = match && product.date <= filters.endDate;
          }
          if (filters.selectedLicensee) {
            match = match && product.licensee === filters.selectedLicensee;
          }
          return match;
        });
        setProducts(filteredData);
      } else {
        setProducts(data);
      }
    });
  }, [filters]);

  const handleFilter = (filterData) => {
    setFilters(filterData);
  };

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <div className="ranking-top">
        <h1>Ranking</h1>
        <div className="ranking-top-seletor">
          <SelectButton value={value} onChange={(e) => setValue(e.value)} options={options} />
        </div>
      </div>

      {/* Componente FilterBar */}
      <FilterBar onFilter={handleFilter} />

      {/* Renderização condicional das tabelas */}
      <div className="TabRanking">
        {value === 'Licenciado' && (
          <DataTable value={products} stripedRows tableStyle={{ minWidth: '50rem' }}>
            <Column field="code" header="Cod. Licenciado"></Column>
            <Column field="name" header="Nome Licenciado"></Column>
            <Column field="quantity" header="Quantidade"></Column>
            <Column field="revenue" header="Receita"></Column>
          </DataTable>
        )}

        {value === 'Produto' && (
          <DataTable value={products} stripedRows tableStyle={{ minWidth: '50rem' }}>
            <Column field="code" header="Cod. Produto"></Column>
            <Column field="name" header="Nome Produto"></Column>
            <Column field="category" header="Licenciado"></Column>
            <Column field="quantity" header="Quantidade"></Column>
            <Column field="revenue" header="Receita"></Column>
          </DataTable>
        )}
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
};

export default RankingPage;
