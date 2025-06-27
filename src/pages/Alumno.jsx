import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';


const Alumno = () => {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
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

  if (cargando) return <p>Cargando tu información...</p>;
  if (!data) return <p>Error al obtener datos.</p>;

  return (
    <div className="container">
      <h2>Bienvenido, {data.alumno_nombre}</h2>
      {data.cursos.length === 0 ? (
        <p>Aún no estás inscrito en cursos.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Curso</th>
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
            {data.cursos.map((n, i) => (
              <tr key={i}>
                <td>{n.clase?.curso_nombre || n.alumno_nombre}</td>
                <td>{n.nota1}</td>
                <td>{n.nota2}</td>
                <td>{n.nota3}</td>
                <td>{n.nota4}</td>
                <td>{n.promedio}</td>
                <td>{n.asistencia_pct}%</td>
                <td>{n.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
    </div>
  );
};

export default Alumno;
