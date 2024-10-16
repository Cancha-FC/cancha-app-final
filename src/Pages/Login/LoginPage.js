import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import './LoginPage.css'; // Importar os estilos personalizados

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedPassword) {
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api-token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Armazena o token no localStorage

        // Obtém dados do usuário
        const userResponse = await fetch('http://127.0.0.1:8000/api/auth/users/me/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${data.token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Armazena dados do usuário no localStorage
          localStorage.setItem('userData', JSON.stringify(userData));

          // Verifica se o usuário está ativo
          if (!userData.is_active) {
            setErrorMessage('Sua conta está inativa. Contate o suporte.'); // Mensagem de erro
            return; // Interrompe a função se o usuário não estiver ativo
          }
        } else {
          // Lida com erros ao buscar dados do usuário
          setErrorMessage('Não foi possível obter os dados do usuário.');
          return;
        }

        // Armazenar as credenciais se a opção "Lembrar-me" estiver marcada
        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }

        window.location.href = '/'; // Redireciona para a página de usuários
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Login falhou. Sua conta está inativa entre em contato com o suporte.'); // Mensagem de erro do servidor
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Erro ao fazer login. Tente novamente mais tarde.'); // Mensagem de erro genérica
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="../../img/logo central cancha branco.png" alt="Cancha FC Logo" />
      </div>

      <div className="login-right">
        <div className="login-form">
          <h2>Login</h2>
          <p>Seja bem-vindo(a)!</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Exibe mensagens de erro */}

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