import React, { useState, useEffect, useRef } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import CardFooter from '../../Components/footer'; // Importa o footer
import CardHeader from '../../Components/header'; // Importa o header
import { CustomerService } from '../../service/CustomerService'; // Certifique-se que o caminho está correto
import './LicenciadosPage.css'


const LicenciadosPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: 'contains' },
    name: { operator: 'and', constraints: [{ value: null, matchMode: 'startsWith' }] },
    'country.name': { operator: 'and', constraints: [{ value: null, matchMode: 'startsWith' }] },
    representative: { value: null, matchMode: 'in' },
    date: { operator: 'and', constraints: [{ value: null, matchMode: 'dateIs' }] },
    balance: { operator: 'and', constraints: [{ value: null, matchMode: 'equals' }] },
    status: { operator: 'or', constraints: [{ value: null, matchMode: 'equals' }] },
    activity: { value: null, matchMode: 'between' }
  });
  
  
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [representatives] = useState([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    // Adicione os representantes aqui
  ]);
  const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data) => setCustomers(getCustomers(data)));
  }, []);

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
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
      </div>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center">
        <span>{rowData.country.name}</span>
      </div>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    const representative = rowData.representative;
    return (
      <div className="flex align-items-center">
        <span>{representative.name}</span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return rowData.date.toLocaleDateString('en-US');
  };

  const balanceBodyTemplate = (rowData) => {
    return rowData.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const getSeverity = (status) => {
    switch (status) {
      case 1:
      return 'Ativo';
      case 0:
        return 'Inativo';
    }
  };

  const header = renderHeader();

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <div className="TabLicenciados">
        <DataTable value={customers} paginator header={header} rows={20} rowsPerPageOptions={[20, 50, 100]} filters={filters} filterDisplay="menu" globalFilterFields={['id', 'name', 'country.name', 'representative.name', 'balance', 'status']} emptyMessage="Nenhum cliente encontrado.">
          <Column field="id" header="id" sortable filter />
          <Column field="name" header="Nome" sortable filter />
          <Column field="country.name" header="País" sortable filterField="country.name" body={countryBodyTemplate} filter />
          <Column field="representative.name" header="Representante" body={representativeBodyTemplate} sortable />
          <Column field="date" header="Data" sortable body={dateBodyTemplate} />
          <Column field="status" header="Status" sortable body={statusBodyTemplate} />
        </DataTable>
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
};

export default LicenciadosPage;
