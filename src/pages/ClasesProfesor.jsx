// Dashboard General del Profesor para ver y administrar sus clases

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RecursosCurso from '../components/RecursosCurso';

const ClasesProfesor = () => {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [profesor, setProfesor] = useState(null);
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
  
  const descargarManual = () => {
    const link = document.createElement('a');
    link.href = '/Manual_Maestro_ELASoft.pdf';
    link.download = 'Manual_Maestro_ELASoft.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  if (cargando) return <div className="text-center mt-5">Cargando clases...</div>;

  return (
    <div className="container py-4">
      {/* Header limpio y profesional */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-success mb-1">Dashboard del Maestro</h1>
          {profesor && (
            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-user-circle me-2"></i>
              <span className="fs-5">{profesor.first_name} {profesor.last_name}</span>
            </div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button 
            onClick={descargarManual} 
            className="btn btn-light border-0 shadow-sm px-3 py-2"
            style={{ borderRadius: '12px', transition: 'all 0.2s ease' }}
          >
            <i className="fas fa-download text-info me-2"></i>
            Manual
          </button>
          <button 
            onClick={handleLogout} 
            className="btn btn-light border-0 shadow-sm px-3 py-2"
            style={{ borderRadius: '12px', transition: 'all 0.2s ease' }}
          >
            <i className="fas fa-sign-out-alt text-danger me-2"></i>
            Salir
          </button>
        </div>
      </div>
      
      {/* Separador sutil */}
      <div className="border-bottom mb-4 pb-2">
        <div className="row align-items-center">
          <div className="col">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle p-2 me-3">
                <i className="fas fa-chalkboard-teacher text-white"></i>
              </div>
              <div>
                <h4 className="mb-0 text-success">Mis Cursos</h4>
                <small className="text-muted">{clases.length} {clases.length === 1 ? 'curso asignado' : 'cursos asignados'}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {clases.length === 0 ? (
        <div className="text-center py-5">
          <div className="bg-light rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" 
               style={{ width: '80px', height: '80px' }}>
            <i className="fas fa-chalkboard fa-2x text-muted"></i>
          </div>
          <h5 className="text-muted mb-2">No tienes cursos asignados</h5>
          <p className="text-secondary small">Contacta al director académico para obtener asignación de cursos</p>
        </div>
      ) : (
        <div className="row g-4">
          {clases.map((clase, i) => (
            <div className="col-lg-6" key={i}>
              <div 
                className="card border-0 h-100 position-relative overflow-hidden"
                style={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                {/* Header del curso con color sólido */}
                <div 
                  className="text-white position-relative"
                  style={{ 
                    background: '#1a8754',
                    padding: '1.5rem 1.5rem 1rem 1.5rem'
                  }}
                >
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-2 text-white">{clase.nombre}</h5>
                      <div className="d-flex align-items-center text-white-50 small">
                        <i className="fas fa-calendar-alt me-2"></i>
                        <span>{clase.periodo_nombre}</span>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-circle p-2">
                      <i className="fas fa-book-open text-dark"></i>
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  {/* Información del horario */}
                  <div className="px-4 py-3 bg-light border-bottom">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="bg-white rounded-pill px-3 py-2 shadow-sm">
                        <i className="fas fa-clock text-primary me-2"></i>
                        <span className="fw-medium text-dark">{clase.horarios.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sección de botones organizados por función */}
                  <div className="p-4">
                    {/* Gestión de Alumnos - Colores Azules */}
                    <div className="mb-4">
                      <h6 className="text-primary fw-bold mb-3 d-flex align-items-center">
                        <i className="fas fa-users me-2"></i>
                        Gestión de Estudiantes
                      </h6>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2"
                          onClick={() => navigate(`/profesor/alumnos/${clase.id}`)}
                          style={{ 
                            borderRadius: '10px',
                            transition: 'all 0.2s ease',
                            border: '2px solid #0d6efd'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#0d6efd';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#0d6efd';
                          }}
                        >
                          <i className="fas fa-list-ul me-2"></i>
                          Ver Lista de Alumnos
                        </button>
                        
                        <button
                          className="btn btn-outline-info d-flex align-items-center justify-content-center py-2"
                          onClick={() => navigate(`/profesor/asignar-alumnos/${clase.id}`)}
                          style={{ 
                            borderRadius: '10px',
                            transition: 'all 0.2s ease',
                            border: '2px solid #c0403bff'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#c0403bff';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#c0403bff';
                          }}
                        >
                          <i className="fas fa-user-cog me-2"></i>
                          Asignar / Remover Alumnos
                        </button>
                      </div>
                    </div>

                    {/* Evaluación Académica - Colores Verdes */}
                    <div className="mb-3">
                      <h6 className="text-success fw-bold mb-3 d-flex align-items-center">
                        <i className="fas fa-chart-line me-2"></i>
                        Evaluación Académica
                      </h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <button
                            className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center py-2"
                            onClick={() => navigate(`/profesor/asistencia/${clase.id}`)}
                            style={{ 
                              borderRadius: '10px',
                              transition: 'all 0.2s ease',
                              border: '2px solid #198754',
                              fontSize: '0.85rem'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#198754';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#198754';
                            }}
                          >
                            <i className="fas fa-check-circle me-2"></i>
                            Asistencia
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center py-2"
                            onClick={() => navigate(`/profesor/notas/${clase.id}`)}
                            style={{ 
                              borderRadius: '10px',
                              transition: 'all 0.2s ease',
                              border: '2px solid #198754',
                              fontSize: '0.85rem'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#198754';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#198754';
                            }}
                          >
                            <i className="fas fa-star me-2"></i>
                            Notas
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recursos del curso con separador sutil */}
                  <div className="px-4 pb-4">
                    <div className="border-top pt-3">
                      <RecursosCurso claseId={clase.id} esProfesor={true} />
                    </div>
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
