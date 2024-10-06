import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button'; // Importa o botão
import CardFooter from '../../Components/footer'; // Importa o footer
import CardHeader from '../../Components/header'; // Importa o header
import { CustomerService } from '../../service/CustomerService'; // Certifique-se que o caminho está correto
import './LicenciadosPage.css';

const LicenciadosPage = () => {
  const [customers, setCustomers] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: 'contains' },
  });

  useEffect(() => {
    fetchCustomers(); // Chama a função para buscar clientes ao iniciar o componente
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await CustomerService.getCustomersLarge();
      if (Array.isArray(data)) {
        setCustomers(getCustomers(data));
      } else {
        console.error('Os dados recebidos não estão no formato esperado:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const getCustomers = (data) => {
    return data.map((d) => ({
      ...d,
      date: new Date(d.date),
    }));
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({ global: { value, matchMode: 'contains' } });
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h4 className="m-0">Licenciados</h4>
        <span className="p-input-icon-right">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busca" />
        </span>
        <Button label="Buscar Licenciados" icon="pi pi-refresh" onClick={fetchCustomers} />
      </div>
    );
  };

  const countryBodyTemplate = (rowData) => (
    <span>{rowData.country.name}</span>
  );

  const representativeBodyTemplate = (rowData) => (
    <span>{rowData.representative.name}</span>
  );

  const dateBodyTemplate = (rowData) => (
    rowData.date.toLocaleDateString('en-US')
  );

  const statusBodyTemplate = (rowData) => (
    <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  );

  const getSeverity = (status) => {
    switch (status) {
      case 1:
        return 'Ativo';
      case 0:
        return 'Inativo';
      default:
        return '';
    }
  };

  const header = renderHeader();

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <div className="TabLicenciados">
        <DataTable 
          value={Array.isArray(customers) ? customers : []}
          paginator 
          header={header} 
          rows={20} 
          rowsPerPageOptions={[20, 50, 100]} 
          filters={filters} 
          filterDisplay="menu" 
          globalFilterFields={['id', 'name', 'country.name', 'representative.name']}
          emptyMessage="Nenhum cliente encontrado."
        >
          <Column field="id" header="ID" sortable filter />
          <Column field="name" header="Nome" sortable filter />
          <Column field="country.name" header="País" sortable body={countryBodyTemplate} filter />
          <Column field="representative.name" header="Representante" body={representativeBodyTemplate} sortable />
          <Column field="date" header="Data" sortable body={dateBodyTemplate} />
          <Column field="status" header="Status" body={statusBodyTemplate} />
        </DataTable>
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
};

export default LicenciadosPage;