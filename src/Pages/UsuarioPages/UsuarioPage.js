/* eslint-disable */

// UsuariosPage.js
import React, { useState, useEffect, useRef } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import { Dialog } from 'primereact/dialog';
import UserCreateForm from './UsuarioCreate/UsuarioCreate'; 
import UserEditForm from './UsuarioEdit/UsuarioEdit';
import LicenciadoSelectModal from './UsuarioAdicionaLicenciado/UsuarioAdicionaLicenciado';
import './UsuarioPage.css';

const UsuariosPage = () => {
    const [users, setUsers] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [createUserVisible, setCreateUserVisible] = useState(false);
    const toast = useRef(null);
    const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Obtém a URL base do .env

    useEffect(() => {
        fetchUsers();
    }, []);

    const isStaff = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            return user.is_staff;
        }
        return false;
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data.results || data); // Ajuste conforme a estrutura da resposta
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os usuários.' });
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

    const handleLicenciadoConfirm = async (selectedLicenciados) => {
        const licenciadosIds = selectedLicenciados.map(licenciado => licenciado.id);

        try {
            const response = await fetch(`${BASE_URL}/auth/users/${selectedUser.id}/link-licenciados/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ licenciados_ids: licenciadosIds }),
            });

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Licenciados atualizados com sucesso' });
                fetchUsers(); // Atualiza a lista de usuários
            } else {
                const errorData = await response.json();
                console.error('Erro ao atualizar licenciados:', errorData);
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar licenciados.' });
            }
        } catch (error) {
            console.error('Erro ao atualizar licenciados:', error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar licenciados.' });
        }
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
            <div className="header-usuario">
                <div className="header-usuario-titulo">
                    <h3>Cadastro de Usuários</h3>
                </div>
                <div className="header-usuario-buscador">
                    <span className="input-icon-container">
                        <i className="pi pi-search input-icon" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                    </span>
                    {isStaff() && (
                        <Button className="botao-inserir" icon="pi pi-plus" rounded severity="info" aria-label="User" onClick={() => setCreateUserVisible(true)} />
                    )}
                    {isStaff() && (
                        <Button className="botao-excel" icon="pi pi-file-excel" rounded severity="success" aria-label="Search" />
                    )}
                </div>
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
            <div>
                <DataTable
                    value={users}
                    paginator
                    header={header}
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
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
                        header="Licenciados"
                        body={(rowData) => (
                            <Button
                                icon="pi pi-briefcase"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => openLicenciadoModal(rowData)}
                            />
                        )}
                    />
                    <Column
                        header="Editar"
                        body={(rowData) => (
                            <Button
                                icon="pi pi-pen-to-square"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => openEditModal(rowData)}
                            />
                        )}
                    />
                </DataTable>
            </div>
            <div>
                <CardFooter />
            </div>
            <Dialog header="Editar Usuário" visible={visible} onHide={() => setVisible(false)}>
                <UserEditForm user={selectedUser} onClose={() => setVisible(false)} />
            </Dialog>
            <Dialog header="Criar Usuário" visible={createUserVisible} onHide={() => setCreateUserVisible(false)}>
                <UserCreateForm onClose={() => setCreateUserVisible(false)} onUserCreated={fetchUsers} />
            </Dialog>
            <LicenciadoSelectModal
                visible={modalVisible}
                onHide={closeLicenciadoModal}
                onConfirm={handleLicenciadoConfirm}
                selectedUser={selectedUser}
            />
            <Toast ref={toast} />
        </PrimeReactProvider>
    );
};

export default UsuariosPage;