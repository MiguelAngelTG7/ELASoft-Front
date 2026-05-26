//Dashboard General del Alumno

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecursosCurso from '../components/RecursosCurso';

const Alumno = () => {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargandoModal, setCargandoModal] = useState(false);
  const [cursoMatriculado, setCursoMatriculado] = useState(null);
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

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'bg-success';
      case 'Desaprobado':
        return 'bg-danger';
      case 'Pendiente':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  // Función para obtener el ícono del estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'fa-check-circle';
      case 'Desaprobado':
        return 'fa-times-circle';
      case 'Pendiente':
        return 'fa-clock';
      default:
        return 'fa-question-circle';
    }
  };

  // Función para obtener el color de las notas
  const getNotaColor = (nota) => {
    if (!nota || nota === 0) return 'text-muted';
    return parseFloat(nota) < 14 ? 'text-danger' : 'text-primary';
  };

  // Función para obtener el color del promedio
  const getPromedioColor = (promedio) => {
    if (!promedio || promedio === 0) return 'text-muted';
    return parseFloat(promedio) < 14 ? 'text-danger' : 'text-primary';
  };

  // Función para obtener el color de la asistencia
  const getAsistenciaColor = (asistencia, participacion_1, participacion_2, participacion_3, tareas, examenFinal) => {
    if (!participacion_1 || participacion_1 === 0 || !participacion_2 || participacion_2 === 0 || 
        !participacion_3 || participacion_3 === 0 || !tareas || tareas === 0 || !examenFinal || examenFinal === 0) {
      return 'warning';
    }
    return (asistencia || 0) >= 75 ? 'primary' : 'danger';
  };

  // Función para obtener el color del texto de asistencia
  const getAsistenciaTextColor = (asistencia, participacion_1, participacion_2, participacion_3, tareas, examenFinal) => {
    if (!participacion_1 || participacion_1 === 0 || !participacion_2 || participacion_2 === 0 || 
        !participacion_3 || participacion_3 === 0 || !tareas || tareas === 0 || !examenFinal || examenFinal === 0) {
      return 'text-warning';
    }
    return (asistencia || 0) >= 75 ? 'text-primary' : 'text-danger';
  };

  // Función para calcular promedio de participación
  const calcularPromedioParticipacion = (p1, p2, p3) => {
    const part1 = parseFloat(p1) || 0;
    const part2 = parseFloat(p2) || 0;
    const part3 = parseFloat(p3) || 0;
    return +(((part1 + part2 + part3) / 3).toFixed(2));
  };

  // Cargar datos del dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Cargar dashboard
        const response = await fetch('https://elasoft-back.onrender.com/api/alumno/dashboard/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        }); 
        const result = await response.json();
        setData(result);
        
        // Cargar curso matriculado desde la BD
        const cursoResponse = await fetch('https://elasoft-back.onrender.com/api/alumno/curso-matriculado/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        });
        const cursoResult = await cursoResponse.json();
        
        if (cursoResult.curso) {
          setCursoMatriculado(cursoResult.curso);
          // Guardar en localStorage como backup
          localStorage.setItem('cursoMatriculado', JSON.stringify(cursoResult.curso));
        } else {
          // Si no hay curso en la BD, limpiar localStorage
          localStorage.removeItem('cursoMatriculado');
          setCursoMatriculado(null);
        }
      } catch (error) {
        setData(null);
      } finally {
        setCargando(false);
      }
    };
    fetchDashboard();
  }, []);

  // Cargar cursos disponibles cuando se abre el modal
  const handleAbrirModal = async () => {
    setMostrarModal(true);
    setCargandoModal(true);
    try {
      const response = await fetch('https://elasoft-back.onrender.com/api/cursos-disponibles/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });
      const result = await response.json();
      setCursosDisponibles(result.cursos || []);
    } catch (error) {
      console.error('Error cargando cursos:', error);
      setCursosDisponibles([]);
    } finally {
      setCargandoModal(false);
    }
  };

  // Matricular en curso
  const handleMatricular = async (claseId) => {
    try {
      const response = await fetch('https://elasoft-back.onrender.com/api/matricular-curso/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clase_id: claseId })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Guardar en localStorage
        const datosMatricula = {
          clase_id: result.curso.clase_id,
          curso_nombre: result.curso.curso_nombre,
          horarios: result.curso.horarios,
          profesor_nombre: result.curso.profesor_nombre,
          profesor_telefono: result.curso.profesor_telefono
        };
        localStorage.setItem('cursoMatriculado', JSON.stringify(datosMatricula));
        setCursoMatriculado(datosMatricula);
        setMostrarModal(false);
        
        // Recargar dashboard
        const response2 = await fetch('https://elasoft-back.onrender.com/api/alumno/dashboard/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        });
        const newData = await response2.json();
        setData(newData);
      } else {
        alert('Error: ' + (result.error || 'No se pudo matricular'));
      }
    } catch (error) {
      console.error('Error matriculando:', error);
      alert('Error al matricular');
    }
  };

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
            <span className="fs-5">Bienvenido(a) {data.alumno_nombre}</span>
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
      
      {/* Botón de Matriculación o Mensaje de Matriculado */}
      <div className="mb-4">
        {!cursoMatriculado ? (
          <button
            onClick={handleAbrirModal}
            className="btn btn-primary btn-lg px-4 py-2 shadow-sm"
            style={{ borderRadius: '12px', transition: 'all 0.2s ease' }}
          >
            <i className="fas fa-plus-circle me-2"></i>
            Matricularme en un Curso
          </button>
        ) : (
          <div 
            className="alert alert-success border-0 shadow-sm"
            style={{ borderRadius: '12px', backgroundColor: '#d4edda' }}
          >
            <div className="d-flex align-items-center">
              <i className="fas fa-check-circle me-3" style={{ fontSize: '1.5rem', color: '#28a745' }}></i>
              <div className="flex-grow-1">
                <h5 className="mb-1 text-success fw-bold">¡Matriculación Exitosa!</h5>
                <div className="text-dark">
                  <p className="mb-1"><strong>Curso:</strong> {cursoMatriculado.curso_nombre}</p>
                  <p className="mb-1"><strong>Horarios:</strong> {cursoMatriculado.horarios}</p>
                  <p className="mb-0"><strong>Profesor:</strong> {cursoMatriculado.profesor_nombre}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="border-bottom mb-4 pb-2">
        <div className="row align-items-center">
          <div className="col">
            <div className="d-flex align-items-center">
              <div className="bg-success rounded-circle p-2 me-3">
                <i className="fas fa-graduation-cap text-white"></i>
              </div>
              <div>
                <h4 className="mb-0 text-success">Mis Cursos</h4>
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
          <p className="text-secondary small">Usa el botón anterior para matricularte en un curso disponible</p>
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
                  {/* Header del curso */}
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
                              <th className="border-0 py-3 text-success">
                                <i className="fas fa-comments me-2"></i>
                                Participac [40%]
                              </th>
                              <th className="border-0 py-3 text-success">
                                <i className="fas fa-tasks me-2"></i>
                                Tareas [40%]
                              </th>
                              <th className="border-0 py-3 text-success">
                                <i className="fas fa-clipboard-check me-2"></i>
                                Eval Final [20%]
                              </th>
                              <th className="border-0 py-3 text-success">
                                <i className="fas fa-calculator me-2"></i>
                                Promedio Notas
                              </th>
                              <th className="border-0 py-3 text-success">
                                <i className="fas fa-calendar-check me-2"></i>
                                % Asistencia
                              </th>
                              <th className="border-0 py-3 text-success">
                                <i className="fas fa-award me-2"></i>
                                Estado
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                              <td className="border-0 py-3">
                                <div className="d-flex flex-column">
                                  <small className="text-muted">Part1: {n.participacion_1 || '-'}</small>
                                  <small className="text-muted">Part2: {n.participacion_2 || '-'}</small>
                                  <small className="text-muted">Part3: {n.participacion_3 || '-'}</small>
                                  <span className={`fw-bold fs-6 ${getNotaColor(calcularPromedioParticipacion(n.participacion_1, n.participacion_2, n.participacion_3))}`}>
                                    Prom: {calcularPromedioParticipacion(n.participacion_1, n.participacion_2, n.participacion_3) || '-'}
                                  </span>
                                </div>
                              </td>
                              <td className="border-0 py-3">
                                <span className={`fw-bold fs-5 ${getNotaColor(n.tareas)}`}>{n.tareas || '-'}</span>
                              </td>
                              <td className="border-0 py-3">
                                <span className={`fw-bold fs-5 ${getNotaColor(n.examen_final)}`}>{n.examen_final || '-'}</span>
                              </td>
                              <td className="border-0 py-3">
                                <span className={`fw-bold fs-4 ${getPromedioColor(n.promedio)}`}>{n.promedio || '-'}</span>
                              </td>
                              <td className="border-0 py-3">
                                <div className="d-flex align-items-center">
                                  <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                    <div 
                                      className={`progress-bar bg-${getAsistenciaColor(n.asistencia_pct, n.participacion_1, n.participacion_2, n.participacion_3, n.tareas, n.examen_final)}`} 
                                      style={{ width: `${n.asistencia_pct || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className={`fw-medium ${getAsistenciaTextColor(n.asistencia_pct, n.participacion_1, n.participacion_2, n.participacion_3, n.tareas, n.examen_final)}`}>{n.asistencia_pct || 0}%</span>
                                </div>
                              </td>
                              <td className="border-0 py-3">
                                <span 
                                  className={`badge fs-6 px-3 py-2 ${getEstadoColor(n.estado)}`}
                                  style={{ borderRadius: '20px' }}
                                >
                                  <i className={`fas ${getEstadoIcon(n.estado)} me-1`}></i>
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

          {/* Botón de reporte */}
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

      {/* MODAL */}
      {mostrarModal && (
        <div 
          className="modal d-block"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1050
          }}
          onClick={() => setMostrarModal(false)}
        >
          <div 
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ marginTop: '2rem' }}
          >
            <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
              <div 
                className="modal-header bg-primary text-white border-0"
                style={{ borderRadius: '16px 16px 0 0' }}
              >
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-graduation-cap me-2"></i>
                  Cursos Disponibles
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>
              
              <div className="modal-body p-4">
                {cargandoModal ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 text-muted">Cargando cursos disponibles...</p>
                  </div>
                ) : cursosDisponibles.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-3x text-muted mb-3 d-block"></i>
                    <p className="text-muted">No hay cursos disponibles en este momento</p>
                  </div>
                ) : (
                  <div className="list-group">
                    {cursosDisponibles.map((curso, idx) => (
                      <div 
                        key={idx}
                        className="list-group-item list-group-item-action p-3 mb-2"
                        style={{ 
                          borderRadius: '12px',
                          border: '1px solid #dee2e6',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.borderColor = '#0d6efd';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,110,253,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = '#dee2e6';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-2 fw-bold text-success">{curso.curso_nombre}</h6>
                            <p className="mb-2 text-muted small">
                              <i className="fas fa-calendar me-2"></i>
                              <strong>Período:</strong> {curso.periodo_nombre}
                            </p>
                            <div className="row g-2">
                              <div className="col-12">
                                <small className="text-muted d-block">
                                  <i className="fas fa-clock me-2"></i>
                                  <strong>Horario:</strong> {curso.horarios}
                                </small>
                              </div>
                              <div className="col-12">
                                <small className="text-muted d-block">
                                  <i className="fas fa-chalkboard-teacher me-2"></i>
                                  <strong>Profesor:</strong> {curso.profesor_nombre}
                                </small>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleMatricular(curso.clase_id)}
                            className="btn btn-sm btn-success ms-2"
                            style={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
                          >
                            <i className="fas fa-check me-1"></i>
                            Seleccionar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumno;
