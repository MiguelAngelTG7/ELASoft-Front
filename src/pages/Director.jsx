import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Dahsboard General del Director
const Director = () => {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarCursosPeriodo, setMostrarCursosPeriodo] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [cursosPorPeriodo, setCursosPorPeriodo] = useState([]);
  const [cargandoPeriodo, setCargandoPeriodo] = useState(false);
  const navigate = useNavigate();

  // Función robusta para navegación
  const handleNavigate = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Error de navegación:", error);
      alert("Hubo un problema al navegar. Intenta de nuevo.");
    }
  };

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
            onClick={() => handleNavigate("/director/alumnos")}
          >
            Ver Lista de Alumnos
          </button>
          <br />
          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => handleNavigate("/director/profesores")}
          >
            Ver Lista de Profesores
          </button>
          <br />
          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => handleNavigate("/director/clases")}
          >
            Ver Lista de Cursos
          </button>
          <br />
          <button
            className="btn btn-outline-danger mt-2"
            onClick={() => handleNavigate('/director/crear-alumno')}
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
                    <td className="fw-semibold" onClick={() => handleNavigate("/director/alumnos")}>{clase.curso}</td>
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
