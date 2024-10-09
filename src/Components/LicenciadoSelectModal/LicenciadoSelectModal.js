import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';



// LicenciadoSelectModal.js

const LicenciadoSelectModal = ({ visible, onHide, onConfirm, selectedUser }) => {
    const [licenciados, setLicenciados] = useState([]);
    const [selectedLicenciados, setSelectedLicenciados] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchLicenciados();
        }
    }, [visible]);

    const fetchLicenciados = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/licenciados/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setLicenciados(data);

            // Pré-selecionar licenciados vinculados
            if (selectedUser && selectedUser.licenciados) {
                const licenciadosVinculados = data.filter(licenciado =>
                    selectedUser.licenciados.some(l => l.id === licenciado.id)
                );
                setSelectedLicenciados(licenciadosVinculados);
            } else {
                setSelectedLicenciados([]);
            }
        } catch (error) {
            console.error('Erro ao buscar licenciados:', error);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedLicenciados);
        onHide();
    };

    return (
        <Dialog header="Selecionar Licenciados" visible={visible} onHide={onHide} style={{ width: '50vw' }}>
            <DataTable
                value={licenciados}
                selection={selectedLicenciados}
                onSelectionChange={e => setSelectedLicenciados(e.value)}
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                <Column field="id" header="ID"></Column>
                <Column field="nome" header="Nome"></Column>
            </DataTable>
            <div className="p-dialog-footer">
                <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Confirmar" icon="pi pi-check" onClick={handleConfirm} autoFocus />
            </div>
        </Dialog>
    );
};

export default LicenciadoSelectModal;