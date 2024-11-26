import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import './UsuarioEdit.css';

const UserEditForm = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        is_active: user.is_active || false,
        is_staff: user.is_staff || false, // Adicionado o campo is_staff
        password: '', // Deixe em branco para não alterar a senha
    });

    const [errors, setErrors] = useState({});
    const toast = useRef(null);
    const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Obtém a URL base do .env

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Remove a senha do objeto se estiver em branco
        const dataToSend = { ...formData };
        if (!formData.password) {
            delete dataToSend.password;
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/users/${user.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData);
                throw new Error('Erro ao atualizar usuário');
            }

            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado com sucesso' });
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="usuario-form">
                <div className="usuario-form-inputs">
                    {/* Campos de texto */}
                    <div>
                        <label htmlFor="username">Usuário</label>
                        <InputText id="username" name="username" value={formData.username} onChange={handleChange} required />
                        {errors.username && <small className="p-error">{errors.username}</small>}
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <InputText id="email" name="email" value={formData.email} onChange={handleChange} required />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>
                    <div>
                        <label htmlFor="first_name">Nome</label>
                        <InputText id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="last_name">Sobrenome</label>
                        <InputText id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
                    </div>
                    {/* Campo de senha */}
                    <div>
                        <label htmlFor="password">Nova Senha (deixe em branco para não alterar)</label>
                        <Password id="password" name="password" value={formData.password} onChange={handleChange} toggleMask />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>
                </div>
            </div>
            <div className="usuario-form-checkbox">
                {/* Checkbox para is_active */}
                <div>
                    <Checkbox inputId="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
                    <label htmlFor="is_active">{formData.is_active ? 'Ativo' : 'Inativo'}</label>
                </div>

                {/* Checkbox para is_staff */}
                <div>
                    <Checkbox inputId="is_staff" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
                    <label htmlFor="is_staff">{formData.is_staff ? 'Admin' : 'Não é Admin'}</label>
                </div>
            </div>
            {/* Botões */}
            <div className="usuario-form-buttom">
                <Button type="button" label="Cancelar" severity="danger" onClick={onClose} />
                <Button type="submit" label="Salvar" />
            </div>

            <Toast ref={toast} />
        </form>
    );
};

export default UserEditForm;