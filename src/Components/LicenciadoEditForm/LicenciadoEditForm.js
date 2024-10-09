// LicenciadoEditForm.js

import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const LicenciadoEditForm = ({ licenciado, onClose }) => {
  const [nome, setNome] = useState(licenciado.nome);
  const [comissao, setComissao] = useState(licenciado.comissao);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const handleSave = async () => {
    const updatedLicenciado = {
      ...licenciado,
      nome,
      comissao,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/licenciados/${updatedLicenciado.id}/`, {
        method: 'PUT',  // Use 'PUT' para atualizar um recurso existente
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedLicenciado),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        throw new Error('Erro ao atualizar licenciado');
      }

      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Licenciado atualizado com sucesso' });
      onClose();  // Fechar o modal

      // Opcional: Se você quiser atualizar a lista de licenciados no componente pai,
      // você pode chamar uma função passada como prop para informar que o licenciado foi atualizado.
      // Exemplo: onUpdate(updatedLicenciado);

    } catch (error) {
      console.error('Erro ao atualizar licenciado:', error);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
    }
  };

  return (
    <div>
      <div className="field">
        <label htmlFor="nome">Nome</label>
        <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        {errors.nome && <small className="p-error">{errors.nome}</small>}
      </div>
      <div className="field">
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
      <div className="p-dialog-footer">
        <Button label="Cancelar" icon="pi pi-times" onClick={onClose} className="p-button-text" />
        <Button label="Salvar" icon="pi pi-check" onClick={handleSave} autoFocus />
      </div>

      <Toast ref={toast} />
    </div>
  );
};

export default LicenciadoEditForm;