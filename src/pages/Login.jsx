// Dashboard de Login para el usuario

import React, { useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import logoela from '../assets/logoela.png'; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login/', { username, password });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('Credenciales inválidas');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="d-flex justify-content-center mb-3">
          <img
            src={logoela}
            alt="Logo ELA"
            style={{ width: '100%', maxWidth: '340px', height: 'auto' }}
            className="mb-2"
          />
        </div>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        {mensaje && <div className="alert alert-danger">{mensaje}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
