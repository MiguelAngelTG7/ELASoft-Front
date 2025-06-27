import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const ClasesProfesor = () => {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerClases = async () => {
      try {
        const resp = await axios.get('/clases/profesor/');
        setClases(resp.data);
      } catch (error) {
        console.error('Error al obtener clases:', error);
      } finally {
        setCargando(false);
      }
    };
    obtenerClases();
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
        <h2>Mis Clases</h2>
        <button onClick={handleLogout} className="btn btn-outline-danger">Salir</button>
      </div>

      {clases.length === 0 ? (
        <p>No tienes clases asignadas.</p>
      ) : (
        <div className="row g-3">
          {clases.map((clase, i) => (
            <div className="col-md-6" key={i}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{clase.curso_nombre}</h5>
                  <p className="card-text">
                    <strong>Periodo:</strong> {clase.periodo_nombre}<br />
                    <strong>Horarios:</strong><br />
                    {clase.horarios.map((h, j) => (
                      <div key={j}>{h}</div>
                    ))}
                  </p>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-primary btn-sm"
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
