import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
// import './UserEditForm.css'; // Importar os estilos personalizados

const UserEditForm = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_active: false,
    is_staff: false,
    password: '', // Campo para a nova senha
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_active: user.is_active,
        is_staff: user.is_staff,
        password: '', // Limpa a senha
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auth/users/${user.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`, // Certifique-se de que o token está no localStorage
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Usuário atualizado com sucesso!');
        onClose(); // Fecha o modal
      } else {
        const errorData = await response.json();
        console.error('Erro ao atualizar usuário:', errorData);
        alert('Erro ao atualizar usuário: ' + errorData.detail || 'Verifique as credenciais');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome:</label>
        <InputText name="first_name" value={formData.first_name} onChange={handleChange} />
      </div>
      <div>
        <label>Sobrenome:</label>
        <InputText name="last_name" value={formData.last_name} onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <InputText name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Usuário:</label>
        <InputText name="username" value={formData.username} onChange={handleChange} />
      </div>
      <div>
        <label>Nova Senha:</label>
        <InputText 
          name="password" 
          type="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="Insira uma nova senha (opcional)" 
        />
      </div>
      <div>
        <Checkbox 
          inputId="isActive" 
          name="is_active" 
          checked={formData.is_active} 
          onChange={handleChange} 
        />
        <label htmlFor="isActive">Ativo</label>
      </div>
      <div>
        <Checkbox 
          inputId="isStaff" 
          name="is_staff" 
          checked={formData.is_staff} 
          onChange={handleChange} 
        />
        <label htmlFor="isStaff">É Staff?</label>
      </div>
      <div>
        <Button label="Salvar" type="submit" />
        <Button label="Cancelar" onClick={onClose} />
      </div>
    </form>
  );
};

export default UserEditForm;