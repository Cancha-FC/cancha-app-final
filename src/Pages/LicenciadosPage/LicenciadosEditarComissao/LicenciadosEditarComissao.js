// LicenciadoEditForm.js

import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './LicenciadosEditarComissao.css';

const LicenciadoEditForm = ({ licenciado, onClose }) => {
  const [nome, setNome] = useState(licenciado.nome);
  const [comissao, setComissao] = useState(licenciado.comissao);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Obtém a URL base do .env

  const handleSave = async () => {
    const updatedLicenciado = {
      ...licenciado,
      nome,
      comissao,
    };

    try {
      const response = await fetch(`${BASE_URL}/licenciados/${updatedLicenciado.id}/`, {
        method: 'PUT', // Use 'PUT' para atualizar um recurso existente
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedLicenciado),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        throw new Error('Erro ao atualizar licenciado');
      }

      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Licenciado atualizado com sucesso' });
      onClose(); // Fechar o modal
    } catch (error) {
      console.error('Erro ao atualizar licenciado:', error);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
    }
  };

  return (
    <div className="licenciados-form">
      <div className="licenciados-form-editar">
        <div>
          <label htmlFor="nome">Nome</label>
          <InputText
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled // Desabilita a edição do nome
          />
          {errors.nome && <small className="p-error">{errors.nome}</small>}
        </div>
        <div>
          <label htmlFor="comissao">Comissão (%)</label>
          <InputNumber
            id="comissao"
            value={comissao}
            onValueChange={(e) => setComissao(e.value)}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
          />
          {errors.comissao && <small className="p-error">{errors.comissao}</small>}
        </div>
      </div>

      <div className="licenciados-button-container">
        <Button label="Cancelar" icon="pi pi-times" severity="danger" onClick={onClose} />
        <Button label="Salvar" icon="pi pi-check" onClick={handleSave} autoFocus />
      </div>

      <Toast ref={toast} />
    </div>
  );
};

export default LicenciadoEditForm;