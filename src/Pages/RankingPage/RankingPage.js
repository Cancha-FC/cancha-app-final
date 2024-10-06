import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar'; // Componente de filtro
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../service/ProductService';
import './RankingPage.css'

const RankingPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});

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

      <h1>Ranking</h1>

      {/* Componente FilterBar */}
      <FilterBar onFilter={handleFilter} />

      {/* Tabela de produtos */}
      <div className="TabRanking">
        <DataTable value={products} stripedRows tableStyle={{ minWidth: '50rem' }}>
          <Column field="code" header="Code"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="quantity" header="Quantity"></Column>
        </DataTable>
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
};

export default RankingPage;
