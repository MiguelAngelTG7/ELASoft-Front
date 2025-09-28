//Dashboard General del Alumno

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecursosCurso from '../components/RecursosCurso';

const Alumno = () => {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const descargarManual = () => {
    const link = document.createElement('a');
    link.href = '/Manual_Alumno_ELASoft.pdf';
    link.download = 'Manual_Alumno_ELASoft.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('https://elasoft-back.onrender.com/api/alumno/dashboard/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        }); 
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData(null);
      } finally {
        setCargando(false);
      }
    };
    fetchDashboard();
  }, []);

  if (cargando) return <div className="text-center mt-5">Cargando datos académicos...</div>;
  if (!data) return <div className="text-center mt-5 text-danger">No hay datos disponibles.</div>;

  return (
    <div className="container py-4">
      {/* Header limpio y profesional */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-success mb-1">Dashboard del Estudiante</h1>
          <div className="d-flex align-items-center text-muted">
            <i className="fas fa-user-graduate me-2"></i>
            <span className="fs-5">{data.alumno_nombre}</span>
          </div>
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
              <div className="bg-success rounded-circle p-2 me-3">
                <i className="fas fa-graduation-cap text-white"></i>
              </div>
              <div>
                <h4 className="mb-0 text-dark">Mis Cursos</h4>
                <small className="text-muted">{data.clases.length} {data.clases.length === 1 ? 'curso inscrito' : 'cursos inscritos'}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {data.clases.length === 0 ? (
        <div className="text-center py-5">
          <div className="bg-light rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" 
               style={{ width: '80px', height: '80px' }}>
            <i className="fas fa-book-open fa-2x text-muted"></i>
          </div>
          <h5 className="text-muted mb-2">Aún no estás inscrito en cursos</h5>
          <p className="text-secondary small">Contacta a la administración para inscribirte en cursos disponibles</p>
        </div>
      ) : (
        <div className="row g-4">
          {data.clases.map((n, i) => {
            console.log(`Curso: ${n.curso_nombre}, clase_id: ${n.clase_id}`);
            return (
              <div className="col-12" key={i}>
                <div 
                  className="card border-0 position-relative overflow-hidden"
                  style={{ 
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
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
                      backgroundColor: '#1a8754',
                      padding: '1.5rem 1.5rem 1rem 1.5rem'
                    }}
                  >
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-2 text-white">{n.curso_nombre || '-'}</h5>
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center text-white-50 small mb-1">
                            <i className="fas fa-graduation-cap me-2"></i>
                            <span>{n.periodo_nombre || 'Sin período académico'}</span>
                          </div>
                          <div className="d-flex align-items-center text-white-50 small">
                            <i className="fas fa-clock me-2"></i>
                            <span>{n.horarios?.join(', ') || 'Sin horario'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-circle p-2">
                        <i className="fas fa-book-reader text-dark"></i>
                      </div>
                    </div>
                  </div>

                  <div className="card-body p-0">
                    {/* Información del profesor */}
                    <div className="px-4 py-3 bg-light border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="fas fa-chalkboard-teacher text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Profesor</small>
                              <span className="fw-medium text-dark">{n.profesor_nombre || '-'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="fas fa-phone text-info"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Contacto</small>
                              <span className="fw-medium text-dark">{n.profesor_telefono || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información Académica */}
                    <div className="p-4">
                      <h6 className="text-success fw-bold mb-3 d-flex align-items-center">
                        <i className="fas fa-chart-bar me-2"></i>
                        Calificaciones y Rendimiento Académico
                      </h6>
                      
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                          <thead style={{ backgroundColor: '#4a90e2' }}>
                            <tr className="text-white">
                              <th className="border-0 py-3 text-black">
                                <i className="fas fa-comments me-2"></i>
                                Participaciones [40%]
                              </th>
                              <th className="border-0 py-3 text-black">
                                <i className="fas fa-tasks me-2"></i>
                                Promedio Tareas [20%]
                              </th>
                              <th className="border-0 py-3 text-black">
                                <i className="fas fa-clipboard-check me-2"></i>
                                EvaluaciónFinal [40%]
                              </th>
                              <th className="border-0 py-3 text-black">
                                <i className="fas fa-calculator me-2"></i>
                                Promedio 
                              </th>
                              <th className="border-0 py-3 text-black">
                                <i className="fas fa-calendar-check me-2"></i>
                                Asistencia
                              </th>
                              <th className="border-0 py-3 text-black">
                                <i className="fas fa-award me-2"></i>
                                Estado
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                              <td className="border-0 py-3">
                                <span className="fw-bold text-primary fs-5">{n.participacion || '-'}</span>
                              </td>
                              <td className="border-0 py-3">
                                <span className="fw-bold text-info fs-5">{n.tareas || '-'}</span>
                              </td>
                              <td className="border-0 py-3">
                                <span className="fw-bold text-warning fs-5">{n.examen_final || '-'}</span>
                              </td>
                              <td className="border-0 py-3">
                                <span className="fw-bold text-dark fs-4">{n.promedio || '-'}</span>
                              </td>
                              <td className="border-0 py-3">
                                <div className="d-flex align-items-center">
                                  <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                    <div 
                                      className="progress-bar bg-success" 
                                      style={{ width: `${n.asistencia_pct || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="fw-medium">{n.asistencia_pct || 0}%</span>
                                </div>
                              </td>
                              <td className="border-0 py-3">
                                <span 
                                  className={`badge fs-6 px-3 py-2 ${n.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'}`}
                                  style={{ borderRadius: '20px' }}
                                >
                                  <i className={`fas ${n.estado === 'Aprobado' ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                                  {n.estado}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recursos del curso */}
                    <div className="px-4 pb-4">
                      <div className="border-top pt-4">
                        <h6 className="text-success fw-bold mb-3 d-flex align-items-center">
                          <i className="fas fa-folder-open text-success me-2"></i>
                          Recursos del Curso
                        </h6>
                        <div className="bg-light rounded p-3" style={{ borderRadius: '12px' }}>
                          <RecursosCurso claseId={n.clase_id} esProfesor={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Botón de reporte con diseño mejorado */}
          <div className="col-12">
            <div className="text-center py-4">
              <button 
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center mx-auto px-4 py-3"
                onClick={() => navigate("/alumno/reporte")}
                style={{ 
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  border: '2px solid #6c757d',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6c757d';
                }}
              >
                <i className="fas fa-file-pdf me-2"></i>
                Generar Reporte PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumno;
