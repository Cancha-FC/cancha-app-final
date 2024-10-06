import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import './LoginPage.css'; // Importar os estilos personalizados


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // Função de login para validar ou chamar uma API
    console.log('Login:', email, password, rememberMe);
  };

  return (
    <div className="login-container">
      {/* Retângulo verde com o logo */}
      <div className="login-left">
        <img src="../../img/logo central cancha branco.png" alt="Cancha FC Logo" /> {/* Substitua pelo caminho da sua logo */}
      </div>

      {/* Retângulo branco com o formulário de login */}
      <div className="login-right">
        <div className="login-form">
          <h2>Login</h2>
          <p>Seja bem-vindo(a)!</p>

          <div className="field">
            <label htmlFor="email">Login</label>
            <InputText 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Insira seu e-mail." 
              className="p-inputtext-lg" 
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <InputText 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Insira sua senha" 
              className="p-inputtext-lg" 
            />
          </div>

          <div className="field-checkbox">
            <Checkbox 
              inputId="rememberMe" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.checked)} 
            />
            <label htmlFor="rememberMe">Lembrar-me</label>
          </div>

          <Button 
            label="Entrar" 
            className="p-button-success p-button-lg" 
            onClick={handleLogin} 
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
