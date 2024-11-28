/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import './UsuarioAdicionaLicenciado.css';

const LicenciadoSelectModal = ({ visible, onHide, onConfirm, selectedUser }) => {
    const [licenciados, setLicenciados] = useState([]);
    const [selectedLicenciados, setSelectedLicenciados] = useState([]);
    const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Obtém a URL base do .env
    const toast = useRef(null);

    useEffect(() => {
        if (visible) {
            fetchLicenciados();
        }
    }, [visible]);

    const fetchLicenciados = async () => {
        try {
            const response = await fetch(`${BASE_URL}/licenciados/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();

            if (data.results && Array.isArray(data.results)) {
                setLicenciados(data.results);

                // Pré-selecionar licenciados vinculados
                if (selectedUser && selectedUser.licenciados) {
                    const licenciadosVinculados = data.results.filter((licenciado) =>
                        selectedUser.licenciados.some((l) => l.id === licenciado.id)
                    );
                    setSelectedLicenciados(licenciadosVinculados);
                } else {
                    setSelectedLicenciados([]);
                }
            } else {
                console.error('A resposta da API não é válida:', data);
                setLicenciados([]);
                toast.current.show({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'A API retornou dados inválidos.',
                });
            }
        } catch (error) {
            console.error('Erro ao buscar licenciados:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível buscar os licenciados.',
            });
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedLicenciados);
        onHide();
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog header="Selecionar Licenciados" visible={visible} onHide={onHide}>
                <DataTable
                    value={licenciados || []} // Garante que será passado um array, mesmo que vazio
                    selection={selectedLicenciados}
                    onSelectionChange={(e) => setSelectedLicenciados(e.value)}
                    selectionMode="multiple"
                    paginator
                    rows={10}
                    emptyMessage="Nenhum licenciado encontrado."
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                    <Column field="nome" header="Nome"></Column>
                    
                    
                </DataTable>
                <div className="select-licenciado-button">
                    <Button label="Cancelar" icon="pi pi-times" severity="danger" onClick={onHide} />
                    <Button label="Confirmar" icon="pi pi-check" onClick={handleConfirm} autoFocus />
                </div>
            </Dialog>
        </>
    );
};

export default LicenciadoSelectModal;