// LicenciadoSelectModal.js
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

const LicenciadoSelectModal = ({ visible, onHide, onConfirm, user }) => {
    const [licenciados, setLicenciados] = useState([]);
    const [selectedLicenciados, setSelectedLicenciados] = useState([]);

    useEffect(() => {
        // Fetch licenciados data
        const fetchLicenciados = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/licenciados/');
            const data = await response.json();
            setLicenciados(data);
        };

        fetchLicenciados();
    }, []);

    const handleSelect = (licenciadoId) => {
        if (selectedLicenciados.includes(licenciadoId)) {
            setSelectedLicenciados(selectedLicenciados.filter(id => id !== licenciadoId));
        } else {
            setSelectedLicenciados([...selectedLicenciados, licenciadoId]);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedLicenciados); // Chama a função onConfirm com os licenciados selecionados
        onHide(); // Fecha o modal
    };

    return (
        <Dialog header="Selecionar Licenciados" visible={visible} onHide={onHide}>
            <div>
                {licenciados.map(licenciado => (
                    <div key={licenciado.id} className="flex align-items-center">
                        <Checkbox 
                            inputId={`licenciado-${licenciado.id}`} 
                            checked={selectedLicenciados.includes(licenciado.id)} 
                            onChange={() => handleSelect(licenciado.id)} 
                        />
                        <label htmlFor={`licenciado-${licenciado.id}`}>{licenciado.nome}</label>
                    </div>
                ))}
            </div>
            <div className="flex justify-content-end mt-2">
                <Button label="Cancelar" onClick={onHide} className="p-button-text" />
                <Button label="Confirmar" onClick={handleConfirm} className="p-button-success" />
            </div>
        </Dialog>
    );
};

export default LicenciadoSelectModal;