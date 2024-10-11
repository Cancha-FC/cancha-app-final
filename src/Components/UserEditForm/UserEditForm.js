// import React, { useState, useRef } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';
// import { Password } from 'primereact/password';
// import { Checkbox } from 'primereact/checkbox';

// const UserEditForm = ({ user, onClose }) => {
//     const [formData, setFormData] = useState({
//         username: user.username || '',
//         email: user.email || '',
//         first_name: user.first_name || '',
//         last_name: user.last_name || '',
//         is_active: user.is_active || false,
//         is_staff: user.is_staff || false,  // Adicionado o campo is_staff
//         password: '',  // Deixe em branco para não alterar a senha
//     });

//     const [errors, setErrors] = useState({});
//     const toast = useRef(null);

//     const handleChange = (e) => {
//         const { name, value, checked, type } = e.target;
//         setFormData({
//             ...formData,
//             [name]: type === 'checkbox' ? checked : value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Remove a senha do objeto se estiver em branco
//         const dataToSend = { ...formData };
//         if (!formData.password) {
//             delete dataToSend.password;
//         }

//         try {
//             const response = await fetch(`http://127.0.0.1:8000/api/auth/users/${user.id}/`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Token ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify(dataToSend),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 setErrors(errorData);
//                 throw new Error('Erro ao atualizar usuário');
//             }

//             toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado com sucesso' });
//             onClose();
//         } catch (error) {
//             console.error('Erro ao atualizar usuário:', error);
//             toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="p-fluid">
//             {/* Campos de texto */}
//             <div className="field">
//                 <label htmlFor="username">Usuário</label>
//                 <InputText id="username" name="username" value={formData.username} onChange={handleChange} required />
//                 {errors.username && <small className="p-error">{errors.username}</small>}
//             </div>

//             <div className="field">
//                 <label htmlFor="email">Email</label>
//                 <InputText id="email" name="email" value={formData.email} onChange={handleChange} required />
//                 {errors.email && <small className="p-error">{errors.email}</small>}
//             </div>

//             <div className="field">
//                 <label htmlFor="first_name">Nome</label>
//                 <InputText id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
//             </div>

//             <div className="field">
//                 <label htmlFor="last_name">Sobrenome</label>
//                 <InputText id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
//             </div>

//             {/* Campo de senha */}
//             <div className="field">
//                 <label htmlFor="password">Nova Senha (deixe em branco para não alterar)</label>
//                 <Password id="password" name="password" value={formData.password} onChange={handleChange} toggleMask />
//                 {errors.password && <small className="p-error">{errors.password}</small>}
//             </div>

//             {/* Checkbox para is_active */}
//             <div className="field-checkbox">
//                 <Checkbox inputId="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
//                 <label htmlFor="is_active">{formData.is_active ? 'Ativo' : 'Inativo'}</label>
//             </div>

//             {/* Checkbox para is_staff */}
//             <div className="field-checkbox">
//                 <Checkbox inputId="is_staff" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
//                 <label htmlFor="is_staff">{formData.is_staff ? 'É Staff' : 'Não é Staff'}</label>
//             </div>

//             {/* Botões */}
//             <div className="p-d-flex p-jc-between">
//                 <Button type="button" label="Cancelar" className="p-button-secondary" onClick={onClose} />
//                 <Button type="submit" label="Salvar" className="p-button-primary" />
//             </div>

//             <Toast ref={toast} />
//         </form>
//     );
// };

// export default UserEditForm;