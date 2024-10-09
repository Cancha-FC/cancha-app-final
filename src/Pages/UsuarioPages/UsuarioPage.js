import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import UserEditForm from '../../Components/UserEditForm/UserEditForm';
import LicenciadoSelectModal from '../../Components/LicenciadoSelectModal/LicenciadoSelectModal'; // Importando o modal
import { Dialog } from 'primereact/dialog';

const UsuariosPage = () => {
    const [users, setUsers] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Controla a visibilidade do modal de licenciados

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/users/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data.results || data); // Ajuste aqui baseado na estrutura da resposta
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setVisible(true);
    };

    const openLicenciadoModal = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const closeLicenciadoModal = () => {
        setModalVisible(false);
    };

    const handleLicenciadoConfirm = (selectedLicenciados) => {
        console.log('Licenciados selecionados para o usuário:', selectedUser.username, selectedLicenciados);
        // Aqui você pode fazer a chamada para vincular os licenciados ao usuário
        // Exemplo: Enviar uma requisição POST para a API com os dados do vínculo
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
                <h4 className="m-0">Usuários</h4>
                <span className="p-input-icon-right">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busca" />
                </span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.is_active ? 'Ativo' : 'Inativo'} severity={rowData.is_active ? 'success' : 'danger'} />;
    };

    const header = renderHeader();

    return (
        <PrimeReactProvider>
            <div>
                <CardHeader />
            </div>

            <div className="">
                <DataTable 
                    value={users} 
                    paginator 
                    header={header} 
                    rows={20} 
                    rowsPerPageOptions={[20, 50, 100]} 
                    filters={filters} 
                    filterDisplay="menu" 
                    globalFilterFields={['id', 'username', 'email', 'first_name', 'last_name']} 
                    emptyMessage="Nenhum usuário encontrado."
                >
                    <Column field="id" header="ID" sortable filter />
                    <Column field="username" header="Usuário" sortable filter />
                    <Column field="email" header="Email" sortable filter />
                    <Column field="first_name" header="Nome" sortable filter />
                    <Column field="last_name" header="Sobrenome" sortable filter />
                    <Column field="is_active" header="Status" body={statusBodyTemplate} />
                    <Column 
                        body={(rowData) => (
                            <Button 
                                label="Vincular Licenciado" 
                                icon="pi pi-briefcase" 
                                onClick={() => openLicenciadoModal(rowData)} 
                            />
                        )} 
                    />
                    <Column body={(rowData) => <Button label="Editar" onClick={() => openEditModal(rowData)} />} />
                </DataTable>
            </div>

            <div>
                <CardFooter />
            </div>

            <Dialog header="Editar Usuário" visible={visible} onHide={() => setVisible(false)}>
                <UserEditForm user={selectedUser} onClose={() => setVisible(false)} />
            </Dialog>

            <LicenciadoSelectModal 
                visible={modalVisible} 
                onHide={closeLicenciadoModal} 
                onConfirm={handleLicenciadoConfirm} 
            />
        </PrimeReactProvider>
    );
};

export default UsuariosPage;