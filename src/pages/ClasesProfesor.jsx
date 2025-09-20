// Dashboard General del Profesor para ver y administrar sus clases

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RecursosCurso from '../components/RecursosCurso';

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
      <hr style={{ margin: '24px 0 16px 0' }} />
      {clases.length === 0 ? (
        <p>No tienes clases asignadas.</p>
      ) : (
        <div className="row g-3">
          {clases.map((clase, i) => (
            <div className="col-md-6" key={i}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <h5 className="card-title">{clase.nombre}</h5>
                  <div className="d-flex flex-column justify-content-center align-items-center mb-2" style={{ gap: '0.3rem' }}>
                    <span><strong>Periodo:</strong> {clase.periodo_nombre}</span>
                    <span><strong>Horario:</strong> {clase.horarios.join(', ')}</span>
                  </div>
                  {/* Botones de acciones */}
                  <div className="d-grid gap-2 mt-3" style={{ width: '80%', margin: '0 auto' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => navigate(`/profesor/alumnos/${clase.id}`)}
                    >
                      Lista de Alumnos
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => navigate(`/profesor/asignar-alumnos/${clase.id}`)}
                    >
                      Asignar | Remover Alumnos
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => navigate(`/profesor/asistencia/${clase.id}`)}
                    >
                      Asistencia
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => navigate(`/profesor/notas/${clase.id}`)}
                    >
                      Notas
                    </button>
                  </div>
                  {/* Recursos del curso */}
                  <h5 style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '18px' }}>
                    Recursos del Curso
                  </h5>
                  <RecursosCurso claseId={clase.id} esProfesor={true} />
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
