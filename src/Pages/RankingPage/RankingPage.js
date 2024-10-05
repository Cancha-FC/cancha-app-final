import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import CardFooter from '../../Components/footer'; // Importa o footer
import CardHeader from '../../Components/header'; // Importa o header
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../service/ProductService'; // Verifique se o caminho está correto

const RankingPage = () => {
  const [products, setProducts] = useState([]);

  // UseEffect para buscar os produtos
  useEffect(() => {
    ProductService.getProductsMini().then(data => setProducts(data));
  }, []);

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <h1>Ranking</h1>

      {/* Tabela de produtos */}
      <div className="card">
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
