import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const Director = () => {
  const [stats, setStats] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/director/dashboard/');
        setStats(res.data.dashboard);
      } catch (e) {
        console.error('Error carga dashboard director:', e);
      } finally {
        setCargando(false);
      }
    }
    fetchData();
  }, []);

  if (cargando) return <p>Cargando información...</p>;

  return (
    <div className="container">
      <h2>Dashboard Académico</h2>
      {stats.length === 0 ? (
        <p>No hay clases activas.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Curso</th>
              <td>Nivel</td>
              <th>Horarios</th>
              <th>Periodo</th>
              <th>Total alumnos</th>
              <th>Con notas</th>
              <th>Aprobados</th>
              <th>% Aprobados</th>
              <th>Asistencia promedio (%)</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((c, i) => (
              <tr key={i}>
                <td>{c.curso}</td>
                <td>{c.nivel}</td>
                <td>
                  {c.horarios && c.horarios.length > 0
                    ? c.horarios.join(', ')
                    : 'Sin horario'}
                </td>
                <td>{c.periodo}</td>
                <td>{c.total_alumnos}</td>
                <td>{c.alumnos_con_notas}</td>
                <td>{c.aprobados}</td>
                <td>{c.porcentaje_aprobados}</td>
                <td>{c.asistencia_promedio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Director;
