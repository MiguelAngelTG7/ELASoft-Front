// Dashboard General del Profesor para ver y administrar sus clases

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ClasesProfesor = () => {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [profesor, setProfesor] = useState(null); // Nuevo estado para el profesor
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerClases = async () => {
      try {
        const resp = await axios.get('/profesor/clases/');
        setClases(resp.data);
      } catch (error) {
        console.error('Error al obtener clases:', error);
      } finally {
        setCargando(false);
      }
    };
    const obtenerPerfil = async () => {
      try {
        const resp = await axios.get('/usuario/');
        setProfesor(resp.data);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };
    obtenerClases();
    obtenerPerfil();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  if (cargando) return <div className="text-center mt-5">Cargando clases...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Dashboard del Maestro</h1>
          {/* Nombre del profesor debajo del título */}
          {profesor && (
            <h4 className="fw-normal mt-2">{profesor.first_name} {profesor.last_name}</h4>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-danger">Salir</button>
      </div>
      {/* Botones debajo del nombre del profesor */}
      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/profesor/alumnos')}
        >
          Lista de Alumnos
        </button>
      </div>
      {clases.length === 0 ? (
        <p>No tienes clases asignadas.</p>
      ) : (
        <div className="row g-3">
          {clases.map((clase, i) => (
            <div className="col-md-6" key={i}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{clase.nombre}</h5>
              {/* Nombre del profesor dentro de la tarjeta - eliminado */}
                  <p className="card-text">
                    <strong>Periodo:</strong> {clase.periodo_nombre}<br />
                    <strong>Horario:</strong><br />
                    {clase.horarios.map((h, j) => (
                      <div key={j}>{h}</div>
                    ))}
                    <td>
                      <Link to={`/profesor/asignar-alumnos/${clase.id}`} className="btn btn-sm btn-outline-danger">
                        Asignar | Remover Alumnos
                      </Link>
                    </td>
                  </p>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`/profesor/asistencia/${clase.id}`)}
                    >
                      Asistencia
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`/profesor/notas/${clase.id}`)}
                    >
                      Notas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClasesProfesor;
