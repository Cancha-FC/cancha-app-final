import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import './UsuarioCreate.css';

const UserCreateForm = ({ onClose, onUserCreated }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        is_active: true,
        is_staff: false,
        password: '',
    });

    const [errors, setErrors] = useState({});
    const toast = useRef(null);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.password) {
            setErrors({ password: 'Senha é obrigatória.' });
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData);
                throw new Error('Erro ao criar usuário');
            }

            const createdUser = await response.json();
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso' });
            if (onUserCreated) {
                onUserCreated();
            }
            onClose();
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
        }
    };

    return (
        <form onSubmit={handleSubmit} >
            <div className="usuario-form">
                <div className="usuario-form-inputs">
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
                    <div>
                        <label htmlFor="password">Senha</label>
                        <Password id="password" name="password" value={formData.password} onChange={handleChange} toggleMask required />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>
                </div>
                <div className="usuario-form-checkbox">
                    <div>
                        <Checkbox inputId="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
                        <label htmlFor="is_active">{formData.is_active ? 'Ativo' : 'Inativo'}</label>
                    </div>

                    <div>
                        <Checkbox inputId="is_staff" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
                        <label htmlFor="is_staff">{formData.is_staff ? 'Admin' : 'Não é Admin'}</label>
                    </div>
                </div>
                <div className="usuario-form-buttom">
                    <Button type="button" label="Cancelar" severity="danger" onClick={onClose} />
                    <Button type="submit" label="Criar" />
                </div>
            </div>
            <Toast ref={toast} />
        </form>
    );
};

export default UserCreateForm;