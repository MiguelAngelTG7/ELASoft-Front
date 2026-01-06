// Dashboard General del Director

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const Director = () => {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarCursosPeriodo, setMostrarCursosPeriodo] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [cursosPorPeriodo, setCursosPorPeriodo] = useState([]);
  const [cargandoPeriodo, setCargandoPeriodo] = useState(false);
  const [mostrandoTodosPeriodos, setMostrandoTodosPeriodos] = useState(false);
  const navigate = useNavigate();

  // Estados para búsqueda de alumnos
  const [mostrarBuscadorAlumnos, setMostrarBuscadorAlumnos] = useState(false);
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [resultadosAlumnos, setResultadosAlumnos] = useState([]);
  const [cursosAlumno, setCursosAlumno] = useState([]);
  const [alumnosPeriodo, setAlumnosPeriodo] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  const descargarManual = () => {
    const link = document.createElement('a');
    link.href = '/Manual_Director_ELASoft.pdf';
    link.download = 'Manual_Director_ELASoft.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get('/director/dashboard/');
        setData(resp.data.dashboard);
      } catch (err) {
        console.error('Error al cargar dashboard director:', err);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mostrarCursosPeriodo || mostrarBuscadorAlumnos) {
      axios.get('/director/periodos/')
        .then(res => setPeriodos(res.data || []))
        .catch(() => setPeriodos([]));
    }
  }, [mostrarCursosPeriodo, mostrarBuscadorAlumnos]);

  useEffect(() => {
    if (periodoId) {
      setCargandoPeriodo(true);
      
      // Si periodoId es "todos", obtener todos los cursos
      if (periodoId === "todos") {
        setMostrandoTodosPeriodos(true);
        // No cargar datos del dashboard normal
        setCursosPorPeriodo([]);
      } else {
        setMostrandoTodosPeriodos(false);
        axios.get(`/director/dashboard/?periodo_id=${periodoId}`)
          .then(res => setCursosPorPeriodo(res.data.dashboard))
          .catch(() => setCursosPorPeriodo([]))
          .finally(() => setCargandoPeriodo(false));
        // Buscar alumnos del periodo
        axios.get(`/director/alumnos/?periodo_id=${periodoId}`)
          .then(res => setAlumnosPeriodo(res.data.alumnos || []))
          .catch(() => setAlumnosPeriodo([]));
      }
    } else {
      setCursosPorPeriodo([]);
      setAlumnosPeriodo([]);
      setMostrandoTodosPeriodos(false);
    }
    setBusquedaAlumno("");
    setResultadosAlumnos([]);
    setCursosAlumno([]);
  }, [periodoId]);

  // Filtrar alumnos en tiempo real
  useEffect(() => {
    if (!busquedaAlumno) {
      setResultadosAlumnos([]);
      return;
    }
    const filtro = busquedaAlumno.toLowerCase();
    const resultados = alumnosPeriodo.filter(a =>
      a.nombre_completo.toLowerCase().includes(filtro)
    );
    setResultadosAlumnos(resultados);
  }, [busquedaAlumno, alumnosPeriodo]);

  // Al hacer click en un alumno, buscar sus cursos en el periodo
  const handleAlumnoClick = (alumnoId) => {
    if (periodoId === "todos") {
      // Obtener todos los cursos del alumno en todos los períodos
      axios.get(`/director/alumno-cursos-todos/?alumno_id=${alumnoId}`)
        .then(res => setCursosAlumno(res.data || []))
        .catch(() => setCursosAlumno([]));
    } else {
      // Obtener cursos del alumno solo en el período específico
      axios.get(`/director/alumno-cursos/?periodo_id=${periodoId}&alumno_id=${alumnoId}`)
        .then(res => setCursosAlumno(res.data || []))
        .catch(() => setCursosAlumno([]));
    }
  };

  if (cargando) return <div className="text-center mt-5">Cargando información administrativa...</div>;
  if (!data.length) return <div className="text-center mt-5 text-danger">No hay datos disponibles.</div>;

  const volver = () => navigate('/director');

  return (
    <div className="container py-4">
      {/* Header limpio y profesional */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-success mb-1">Dashboard del Director</h1>
          <div className="d-flex align-items-center text-muted">
            <i className="fas fa-user-tie me-2"></i>
            <span className="fs-5">Bienvenido</span>
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
                <i className="fas fa-users-cog text-white"></i>
              </div>
              <div>
                <h4 className="mb-0 text-success">Panel Administrativo</h4>
                <small className="text-muted">Gestión completa del sistema académico</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Consultas */}
      <div className="mb-5">
        <h6 className="text-success fw-bold mb-3 d-flex align-items-center">
          <i className="fas fa-search text-success me-2"></i>
          Consultas y Reportes
        </h6>
        <div className="row g-4">
          <div className="col-lg-4">
            <div 
              className="card border-0 h-100"
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div 
                className="text-white position-relative"
                style={{ 
                  backgroundColor: '#1a8754',
                  padding: '1.5rem',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1 text-white">Lista de Alumnos</h5>
                    <small className="text-white-50">Ver todos los alumnos por curso</small>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <i className="fas fa-users text-success fa-lg"></i>
                  </div>
                </div>
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                <p className="text-muted mb-3">Consultar información completa de estudiantes registrados</p>
                <button
                  className="btn btn-outline-info w-100"
                  onClick={() => navigate("/director/alumnos")}
                  style={{ 
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #1a8754',
                    color: '#1a8754',
                    backgroundColor: 'transparent'
                  }}
                >
                  <i className="fas fa-eye me-2"></i>
                  Ver Lista
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div 
              className="card border-0 h-100"
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div 
                className="text-white position-relative"
                style={{ 
                  backgroundColor: '#1a8754',
                  padding: '1.5rem',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1 text-white">Lista de Maestros</h5>
                    <small className="text-white-50">Ver todos los maestros por ciclo</small>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <i className="fas fa-chalkboard-teacher text-success fa-lg"></i>
                  </div>
                </div>
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                <p className="text-muted mb-3">Consultar información de profesores registrados</p>
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => navigate("/director/profesores")}
                  style={{ 
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #1a8754',
                    color: '#1a8754',
                    backgroundColor: 'transparent'
                  }}
                >
                  <i className="fas fa-eye me-2"></i>
                  Ver Lista
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div 
              className="card border-0 h-100"
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div 
                className="text-white position-relative"
                style={{ 
                  backgroundColor: '#1a8754',
                  padding: '1.5rem',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1 text-white">Lista de Cursos</h5>
                    <small className="text-white" style={{ opacity: 0.7 }}>Ver todos los cursos por ciclo</small>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <i className="fas fa-book text-success fa-lg"></i>
                  </div> 
                </div>
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                <p className="text-muted mb-3">Consultar información de cursos disponibles</p>
                <button
                  className="btn btn-outline-warning w-100"
                  onClick={() => navigate("/director/clases")}
                  style={{ 
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #1a8754',
                    color: '#1a8754',
                    backgroundColor: 'transparent'
                  }}
                >
                  <i className="fas fa-eye me-2"></i>
                  Ver Lista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Acciones */}
      <div className="mb-5">
        <h6 className="text-success fw-bold mb-3 d-flex align-items-center">
          <i className="fas fa-tools me-2"></i>
          Herramientas Administrativas
        </h6>
        <div className="row g-4">
          <div className="col-lg-6">
            <div 
              className="card border-0 h-100"
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div 
                className="text-white position-relative"
                style={{ 
                  backgroundColor: '#1a8754',
                  padding: '1.5rem',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1 text-white">Crear Nuevo Alumno</h5>
                    <small className="text-white-50">Registrar estudiante</small>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <i className="fas fa-user-plus text-success fa-lg"></i>
                  </div>
                </div>
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                <p className="text-muted mb-3">Registrar un nuevo estudiante en el sistema académico</p>
                <button
                  className="btn btn-outline-warning w-100"
                  onClick={() => navigate('/director/crear-alumno')}
                  style={{ 
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #1a8754',
                    color: '#1a8754',
                    backgroundColor: 'transparent'
                  }}
                >
                  <i className="fas fa-plus me-2"></i>
                  Crear Alumno
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div 
              className="card border-0 h-100"
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div 
                className="text-white position-relative"
                style={{ 
                  backgroundColor: '#1a8754',
                  padding: '1.5rem',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1 text-white">Buscar Alumno</h5>
                    <small className="text-white-50">Consulta avanzada</small>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <i className="fas fa-search text-success fa-lg"></i>
                  </div>
                </div>
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                <p className="text-muted mb-3">Buscar y consultar información detallada de estudiantes</p>
                <button
                  className="btn w-100"
                  onClick={() => setMostrarBuscadorAlumnos(!mostrarBuscadorAlumnos)}
                  style={{ 
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #1a8754',
                    color: '#1a8754',
                    backgroundColor: 'transparent'
                  }}
                >
                  <i className={`fas ${mostrarBuscadorAlumnos ? 'fa-eye-slash' : 'fa-search'} me-2`}></i>
                  {mostrarBuscadorAlumnos ? "Ocultar Buscador" : "Buscar Alumno"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador de alumnos */}
      {mostrarBuscadorAlumnos && (
        <div 
          className="card border-0 mb-5"
          style={{ 
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}
        >
          <div className="card-body p-4">
            <h6 className="text-purple fw-bold mb-4 d-flex align-items-center" style={{ color: '#6f42c1' }}>
              <i className="fas fa-user-search me-2"></i>
              Búsqueda Avanzada de Estudiantes
            </h6>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="periodoBuscador" className="form-label fw-medium">Periodo Académico</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="fas fa-calendar-alt text-muted"></i>
                  </span>
                  <select
                    id="periodoBuscador"
                    className="form-select border-start-0"
                    value={periodoId}
                    onChange={e => setPeriodoId(e.target.value)}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  >
                    <option value="">Seleccione un período académico</option>
                    <option value="todos">📚 Todos los Períodos</option>
                    {(Array.isArray(periodos) ? periodos : []).map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="busquedaAlumno" className="form-label fw-medium">Nombre o Apellido</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    id="busquedaAlumno"
                    name="busquedaAlumno"
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar alumno..."
                    value={busquedaAlumno}
                    onChange={e => setBusquedaAlumno(e.target.value)}
                    disabled={!periodoId}
                    autoComplete="off"
                    style={{ borderRadius: '0 8px 8px 0' }}
                  />
                </div>
              </div>
            </div>
            
            {resultadosAlumnos.length > 0 && (
              <div className="mt-4">
                <h6 className="text-dark fw-bold mb-3">Resultados de la Búsqueda</h6>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                    <thead style={{ backgroundColor: '#6f42c1' }}>
                      <tr className="text-white">
                        <th className="border-0 py-3 text-white">
                          <i className="fas fa-user-graduate me-2"></i>
                          Nombre del Alumno
                        </th>
                        <th className="border-0 py-3 text-white">
                          <i className="fas fa-mouse-pointer me-2"></i>
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadosAlumnos.map(a => (
                        <tr 
                          key={a.id} 
                          style={{ 
                            cursor: 'pointer',
                            backgroundColor: '#f8f9fa'
                          }} 
                          onClick={() => handleAlumnoClick(a.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e9ecef';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }}
                        >
                          <td className="border-0 py-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className="fas fa-user text-primary"></i>
                              </div>
                              <span className="fw-medium">{a.nombre_completo}</span>
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            <small className="text-muted">Click para ver cursos</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {cursosAlumno.length > 0 && (
              <div className="mt-4">
                <h6 className="text-success fw-bold mb-3 d-flex align-items-center">
                  <i className="fas fa-book-open me-2"></i>
                  {mostrandoTodosPeriodos ? "Cursos del Estudiante en Todos los Períodos" : "Cursos del Estudiante en el Periodo"}
                </h6>
                <div className="row g-3">
                  {cursosAlumno.map(c => (
                    <div className="col-md-6" key={c.id}>
                      <div 
                        className="card border-0"
                        style={{ 
                          borderRadius: '12px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                          backgroundColor: '#fff'
                        }}
                      >
                        <div className="card-body p-3">
                          <h6 className="fw-bold text-dark mb-2">{c.nombre || c.nombre_curso}</h6>
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-layer-group text-info me-2"></i>
                            <small className="text-muted">Nivel: {c.nivel || c.nivel_nombre}</small>
                          </div>
                          {mostrandoTodosPeriodos && c.periodo && (
                            <div className="d-flex align-items-center mb-2">
                              <i className="fas fa-calendar text-warning me-2"></i>
                              <small className="text-muted">Período: {c.periodo}</small>
                            </div>
                          )}
                          <div className="d-flex align-items-center">
                            <i className="fas fa-clock text-warning me-2"></i>
                            <small className="text-muted">
                              {Array.isArray(c.horarios) ? c.horarios.join(", ") : c.horario || "Sin horario"}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cursos por periodo académico */}
      {mostrarCursosPeriodo && (
        <div 
          className="card border-0"
          style={{ 
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}
        >
          <div className="card-body p-4">
            <h6 className="text-primary fw-bold mb-4 d-flex align-items-center">
              <i className="fas fa-chart-line me-2"></i>
              Análisis de Cursos por Periodo Académico
            </h6>
            
            <div className="mb-4">
              <label htmlFor="periodoSelect" className="form-label fw-medium">Seleccionar Periodo</label>
              <div className="input-group" style={{ maxWidth: '400px' }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="fas fa-calendar text-muted"></i>
                </span>
                <select
                  id="periodoSelect"
                  className="form-select border-start-0"
                  value={periodoId}
                  onChange={(e) => setPeriodoId(e.target.value)}
                  style={{ borderRadius: '0 8px 8px 0' }}
                >
                  <option value="">Seleccione un período académico</option>
                  <option value="todos">📚 Todos los Períodos</option>
                  {periodos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {cargandoPeriodo && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando información de cursos...</p>
              </div>
            )}

            {!cargandoPeriodo && cursosPorPeriodo.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  <thead style={{ backgroundColor: '#0d6efd' }}>
                    <tr className="text-white">
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-layer-group me-2"></i>Nivel
                      </th>
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-book me-2"></i>Curso
                      </th>
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-clock me-2"></i>Horario
                      </th>
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-user-tie me-2"></i>Maestro Titular
                      </th>
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-user-friends me-2"></i>M. Asistente
                      </th>
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-users me-2"></i>Alumnos
                      </th>
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-calendar-check me-2"></i>Asistencia
                      </th>
                      <th className="border-0 py-3 text-white">
                        <i className="fas fa-award me-2"></i>Aprobados
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursosPorPeriodo.map((clase, i) => (
                      <tr key={i} style={{ backgroundColor: '#f8f9fa' }}>
                        <td className="border-0 py-3">
                          <span className="badge bg-secondary rounded-pill">{clase.nivel}</span>
                        </td>
                        <td className="border-0 py-3">
                          <span className="fw-bold text-dark">{clase.curso}</span>
                        </td>
                        <td className="border-0 py-3">
                          <div>
                            {clase.horarios?.map((h, i) => (
                              <div key={i} className="small text-muted">
                                <i className="fas fa-clock me-1"></i>{h}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="border-0 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                              <i className="fas fa-chalkboard-teacher text-primary small"></i>
                            </div>
                            <span className="small">
                              {clase.maestro_titular?.nombre_completo || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="border-0 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                              <i className="fas fa-user-friends text-info small"></i>
                            </div>
                            <span className="small">
                              {clase.maestro_asistente?.nombre_completo || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="border-0 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                              <i className="fas fa-users text-success small"></i>
                            </div>
                            <span className="fw-bold">{clase.total_alumnos}</span>
                          </div>
                        </td>
                        <td className="border-0 py-3">
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '8px', maxWidth: '80px' }}>
                              <div
                                className="progress-bar bg-info"
                                style={{ width: `${clase.asistencia_promedio}%` }}
                              ></div>
                            </div>
                            <span className="small fw-medium">{clase.asistencia_promedio}%</span>
                          </div>
                        </td>
                        <td className="border-0 py-3">
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '8px', maxWidth: '80px' }}>
                              <div
                                className={`progress-bar ${clase.porcentaje_aprobados >= 70 ? 'bg-success' : 'bg-warning'}`}
                                style={{ width: `${clase.porcentaje_aprobados}%` }}
                              ></div>
                            </div>
                            <span className="small fw-medium">{clase.porcentaje_aprobados}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!cargandoPeriodo && periodoId && cursosPorPeriodo.length === 0 && (
              <div className="text-center py-5">
                <div className="bg-light rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-chart-line fa-2x text-muted"></i>
                </div>
                <h6 className="text-muted mb-2">No hay datos para este periodo</h6>
                <p className="text-secondary small">Selecciona un periodo académico diferente</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Director;