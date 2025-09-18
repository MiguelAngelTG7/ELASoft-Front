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
    if (mostrarCursosPeriodo) {
      axios.get('/director/periodos/')
        .then(res => setPeriodos(res.data.periodos))
        .catch(() => setPeriodos([]));
    }
  }, [mostrarCursosPeriodo]);

  useEffect(() => {
    if (periodoId) {
      setCargandoPeriodo(true);
      axios.get(`/director/dashboard/?periodo_id=${periodoId}`)
        .then(res => setCursosPorPeriodo(res.data.dashboard))
        .catch(() => setCursosPorPeriodo([]))
        .finally(() => setCargandoPeriodo(false));
    } else {
      setCursosPorPeriodo([]);
    }
  }, [periodoId]);

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
            onClick={() => navigate("/director/profesores")}
          >
            Ver Lista de Profesores
          </button>
          <br />
          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => navigate("/director/cursos")}
          >
            Ver Lista de Cursos
          </button>
          <br />
          <button
            className="btn btn-outline-success"
            onClick={() => navigate('/director/crear-alumno')}
          >
            Crear nuevo Alumno
          </button>
          <br />
          <button className="btn btn-danger mt-2" onClick={handleLogout}>Salir</button>
          <br />
        </div>
      </div>


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
