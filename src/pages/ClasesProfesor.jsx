import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const ClasesProfesor = () => {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await axios.get('clases/profesor/');
        setClases(response.data);
      } catch (error) {
        console.error('Error al cargar clases:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchClases();
  }, []);

  if (cargando) return <p>Cargando clases...</p>;

  return (
    <div className="container">
      <h2>Mis Clases</h2>
      {clases.length === 0 ? (
        <p>No tienes clases asignadas aún.</p>
      ) : (
        <ul>
          {clases.map(clase => (
            <li key={clase.id} style={{ marginBottom: '1rem' }}>
              <strong>{clase.curso_nombre}</strong> — {clase.periodo_nombre}
              <br />
              <em>Horarios: {clase.horarios.join(', ')}</em>
              <div>
                <Link to={`/profesor/asistencia/${clase.id}`} style={{ marginRight: '10px' }}>
                  📆 Tomar asistencia
                </Link>
                <Link to={`/profesor/notas/${clase.id}`}>
                  📝 Registrar notas
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
    </div>
  );
};

export default ClasesProfesor;
