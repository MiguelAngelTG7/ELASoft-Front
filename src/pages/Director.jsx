import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const Director = () => {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);
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

  if (cargando) return <div className="text-center mt-5">Cargando información...</div>;
  if (!data.length) return <div className="text-center mt-5">No hay datos disponibles.</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Reporte Académico General</h2>
        <div className="mb-3 text-end">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/director/alumnos")}
        >
          Ver Lista Alumnos
        </button>
        </div>

      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle table-bordered">
          <thead className="table-light">
            <tr>
              <th>Nivel</th>
              <th>Curso</th>
              <th>Horarios</th>
              <th>Periodo</th>
              <th>Alum</th>
              <th>Notas</th>
              <th>Aprob</th>
              <th>% Aprob</th>
              <th>Asist Prom</th>
            </tr>
          </thead>
          <tbody>
            {data.map((curso, idx) => (
              <tr key={idx}>
                <td className="fw-bold">{curso.nivel}</td>
                <td className="fw-semibold">{curso.curso}</td>
                <td className="fw-semibold">
                  {curso.horarios.map((h, i) => (
                    <div key={i}>{h}</div>
                  ))}
                </td>
                <td className="fw-semibold">{curso.periodo}</td>
                <td>{curso.total_alumnos}</td>
                <td>{curso.alumnos_con_notas}</td>
                <td>
                  <span className={`badge ${curso.porcentaje_aprobados >= 70 ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {curso.aprobados}
                  </span>
                </td>
                <td>
                  <div className="progress" style={{ height: '20px' }}>
                    <div
                      className={`progress-bar ${curso.porcentaje_aprobados >= 70 ? 'bg-success' : 'bg-warning text-dark'}`}
                      role="progressbar"
                      style={{ width: `${curso.porcentaje_aprobados}%` }}
                    >
                      {curso.porcentaje_aprobados}%
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge bg-info text-dark">
                    {curso.asistencia_promedio}%
                  </span>
                </td>
              </tr>
            ))}


            
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate("/director/reporte")}
        >
            Imprimir / Guardar PDF
        </button>
        <button onClick={handleLogout} className="btn btn-secondary">Salir</button>
      </div>

      

    </div>
  );
};

export default Director;
