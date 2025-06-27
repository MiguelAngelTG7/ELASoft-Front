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
        <h2 className="fw-bold text-primary">Dashboard Académico - Director</h2>
        <button onClick={handleLogout} className="btn btn-danger">Salir</button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle table-bordered">
          <thead className="table-light">
            <tr>
              <th>Curso</th>
              <th>Nivel</th>
              <th>Horarios</th>
              <th>Periodo</th>
              <th>Total alumnos</th>
              <th>Con notas</th>
              <th>Aprobados</th>
              <th>% Aprobados</th>
              <th>Asistencia Promedio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((curso, idx) => (
              <tr key={idx}>
                <td className="fw-semibold">{curso.curso}</td>
                <td>{curso.nivel}</td>
                <td>
                  {curso.horarios.map((h, i) => (
                    <div key={i}>{h}</div>
                  ))}
                </td>
                <td>{curso.periodo}</td>
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
    </div>
  );
};

export default Director;
