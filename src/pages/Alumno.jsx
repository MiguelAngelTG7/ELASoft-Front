//Dashboard del Alumno
import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const Alumno = () => {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const resp = await axios.get('/alumno/dashboard/');
        setData(resp.data);
      } catch (err) {
        console.error('Error al cargar dashboard alumno:', err);
      } finally {
        setCargando(false);
      }
    };
    fetchDashboard();
  }, []);

  if (cargando) return <div className="text-center mt-5">Cargando tu información...</div>;
  if (!data) return <div className="alert alert-danger mt-5 text-center">Error al obtener datos.</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bienvenido, {data.alumno_nombre}</h2>
      </div>

      {data.clases.length === 0 ? (
        <div className="alert alert-warning">Aún no estás inscrito en cursos.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Curso</th>
                <th>Horarios</th>
                <th>Nivel</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Nota 4</th>
                <th>Promedio</th>
                <th>Asistencia (%)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.clases.map((n, i) => (
                <tr key={i}>
                  <td>{n.curso_nombre || '-'}</td>
                  <td>{n.horarios?.join(', ') || 'Sin horario'}</td>
                  <td>{n.nivel_nombre || '-'}</td>
                  <td>{n.nota1}</td>
                  <td>{n.nota2}</td>
                  <td>{n.nota3}</td>
                  <td>{n.nota4}</td>
                  <td>{n.promedio}</td>
                  <td>{n.asistencia_pct}%</td>
                  <td>
                    <span className={`badge ${n.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'}`}>
                      {n.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center mt-4">
            <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/alumno/reporte")}>
                Imprimir / Guardar PDF
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumno;
