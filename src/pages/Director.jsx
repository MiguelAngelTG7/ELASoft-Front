// Dahsboard General del Director

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
      axios.get(`/director/dashboard/?periodo_id=${periodoId}`)
        .then(res => setCursosPorPeriodo(res.data.dashboard))
        .catch(() => setCursosPorPeriodo([]))
        .finally(() => setCargandoPeriodo(false));
      // Buscar alumnos del periodo
      axios.get(`/director/alumnos/?periodo_id=${periodoId}`)
        .then(res => setAlumnosPeriodo(res.data.alumnos || []))
        .catch(() => setAlumnosPeriodo([]));
    } else {
      setCursosPorPeriodo([]);
      setAlumnosPeriodo([]);
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
    axios.get(`/director/alumno-cursos/?periodo_id=${periodoId}&alumno_id=${alumnoId}`)
      .then(res => setCursosAlumno(res.data || []))
      .catch(() => setCursosAlumno([]));
  };

  if (cargando) return <div className="text-center mt-5">Cargando información...</div>;
  if (!data.length) return <div className="text-center mt-5">No hay datos disponibles.</div>;

  const volver = () => navigate('/director');


  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Dashboard del Director</h2>
        <div className="mb-3 text-end">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/director/alumnos")}
          >
            Ver Lista de Alumnos
          </button>
          <br />
          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => navigate("/director/clases")}
          >
            Ver Lista de Cursos & Profesores
          </button>
          <br />
          <button
            className="btn btn-outline-danger mt-2"
            onClick={() => navigate('/director/crear-alumno')}
          >
            Crear nuevo Alumno
          </button>
          <br />
          {/* Botón Buscar Alumno debajo de Crear nuevo Alumno */}
          <button
            className="btn btn-outline-info mt-2"
            onClick={() => setMostrarBuscadorAlumnos(!mostrarBuscadorAlumnos)}
          >
            {mostrarBuscadorAlumnos ? "Ocultar Buscador de Alumnos" : "Buscar Alumno"}
          </button>
          <br />
          <button className="btn btn-danger mt-2" onClick={handleLogout}>Salir</button>
          <br />
        </div>
      </div>

      {/* Buscador de alumnos fuera de la sección de cursos por periodo */}
      {mostrarBuscadorAlumnos && (
        <div className="mt-4">
          <h4>Buscar alumno por nombre o apellido</h4>
          <div className="mb-2">
            <label htmlFor="periodoBuscador" className="form-label">Periodo Académico</label>
            <select
              id="periodoBuscador"
              className="form-select mb-2"
              style={{ maxWidth: 400 }}
              value={periodoId}
              onChange={e => setPeriodoId(e.target.value)}
            >
              <option value="">Seleccione un periodo académico</option>
              {(Array.isArray(periodos) ? periodos : []).map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <label htmlFor="busquedaAlumno" className="form-label">Nombre o Apellido del Alumno</label>
            <input
              id="busquedaAlumno"
              name="busquedaAlumno"
              type="text"
              className="form-control"
              style={{ maxWidth: 400 }}
              placeholder="Buscar alumno..."
              value={busquedaAlumno}
              onChange={e => setBusquedaAlumno(e.target.value)}
              disabled={!periodoId}
              autoComplete="off"
            />
          </div>
          {resultadosAlumnos.length > 0 && (
            <table className="table table-bordered table-hover mb-3">
              <thead className="table-info">
                <tr>
                  <th>Nombre del Alumno</th>
                </tr>
              </thead>
              <tbody>
                {resultadosAlumnos.map(a => (
                  <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => handleAlumnoClick(a.id)}>
                    <td>{a.nombre_completo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {cursosAlumno.length > 0 && (
            <div className="mb-3">
              <h5>Cursos de este alumno en el periodo</h5>
              {cursosAlumno.length === 0 ? (
                <div>No tiene cursos asignados en este periodo.</div>
              ) : (
                <ul className="list-group">
                  {cursosAlumno.map(c => (
                    <li key={c.id} className="list-group-item">
                      <strong>{c.nombre || c.nombre_curso}</strong> — Nivel: {c.nivel || c.nivel_nombre} — Horario: {Array.isArray(c.horarios) ? c.horarios.join(", ") : c.horario || ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cursos por periodo académico */}
      {mostrarCursosPeriodo && (
        <div className="mt-5">
          <h4>Cursos por Periodo Académico</h4>
          <select
            className="form-select mb-3"
            style={{ width: 400 }}
            value={periodoId}
            onChange={(e) => setPeriodoId(e.target.value)}
          >
            <option value="">Seleccione un periodo académico</option>
            {periodos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>

          {cargandoPeriodo && <div>Cargando cursos...</div>}

          {!cargandoPeriodo && cursosPorPeriodo.length > 0 && (
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Nivel</th>
                  <th>Curso</th>
                  <th>Horario</th>
                  <th>Maestro Titular</th>
                  <th>Maestro Asistente</th>
                  <th>Alumnos</th>
                  <th>% Asistencia</th>
                  <th>% Aprobados</th>
                </tr>
              </thead>
              <tbody>
                {cursosPorPeriodo.map((clase, i) => (
                  <tr key={i}>
                    <td>{clase.nivel}</td>
                    <td className="fw-semibold" >{clase.curso}</td>
                    <td>
                      {clase.horarios?.map((h, i) => <div key={i}>{h}</div>)}
                    </td>
                    <td>
                      {clase.maestro_titular?.nombre_completo || "—"}
                    </td>
                    <td>
                      {clase.maestro_asistente?.nombre_completo || "—"}
                    </td>
                    <td>{clase.total_alumnos}</td>
                    <td>
                      <div className="progress" style={{ height: '20px' }}>
                        <div
                          className="progress-bar bg-info text-dark"
                          role="progressbar"
                          style={{ width: `${clase.asistencia_promedio}%` }}
                        >
                          {clase.asistencia_promedio}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="progress" style={{ height: '20px' }}>
                        <div
                          className={`progress-bar ${clase.porcentaje_aprobados >= 70 ? 'bg-success' : 'bg-warning text-dark'}`}
                          role="progressbar"
                          style={{ width: `${clase.porcentaje_aprobados}%` }}
                        >
                          {clase.porcentaje_aprobados}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!cargandoPeriodo && periodoId && cursosPorPeriodo.length === 0 && (
            <div>No hay datos para este periodo.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Director;