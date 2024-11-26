import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import "./LoginPage.css"; // Importar os estilos personalizados

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Base URL do backend

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
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
      const response = await fetch(`${BASE_URL}/api-token-auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Armazena o token no localStorage

        // Obtém dados do usuário
        const userResponse = await fetch(`${BASE_URL}/auth/users/me/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${data.token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem("userData", JSON.stringify(userData));

          if (!userData.is_active) {
            setErrorMessage("Sua conta está inativa. Contate o suporte.");
            return;
          }
        } else {
          setErrorMessage("Não foi possível obter os dados do usuário.");
          return;
        }

        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        window.location.href = "/";
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.detail ||
            "Login falhou. Sua conta está inativa, entre em contato com o suporte."
        );
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Erro ao fazer login. Tente novamente mais tarde.");
    }
  };

  // Função para abrir o modal "Esqueci a senha"
  const openForgotPassword = () => {
    setShowForgotPassword(true);
  };

  // Função para enviar a solicitação de redefinição de senha
  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/password/reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        setForgotPasswordMessage(
          "Instruções para redefinição de senha foram enviadas para o seu e-mail."
        );
      } else {
        setForgotPasswordMessage(
          "Erro ao enviar solicitação. Verifique o e-mail e tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      setForgotPasswordMessage(
        "Erro ao solicitar redefinição de senha. Tente novamente mais tarde."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="../../img/logo central cancha branco.png"
          alt="Cancha FC Logo"
        />
      </div>

      <div className="login-right">
        <div className="login-form">
          <h2>Login</h2>
          <p>Seja bem-vindo(a)!</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

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

          {/* Link para "Esqueci a senha" */}
          <p className="forgot-password-link" onClick={openForgotPassword}>
            Esqueci a senha?
          </p>
        </div>
      </div>

      {/* Modal para o "Esqueci a senha" */}
      <Dialog
        header="Esqueci a senha"
        visible={showForgotPassword}
        style={{ width: "400px" }}
        onHide={() => setShowForgotPassword(false)}
      >
        <div className="forgot-password-form">
          <p>
            Insira o seu e-mail para receber as instruções de redefinição de
            senha.
          </p>
          <InputText
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="p-inputtext-lg"
          />
          <Button
            label="Enviar"
            className="p-button-primary"
            onClick={handleForgotPassword}
            style={{ marginTop: "10px" }}
          />
          {forgotPasswordMessage && (
            <p className="forgot-password-message">{forgotPasswordMessage}</p>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default LoginPage;