//Dashboard General del Alumno

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecursosCurso from '../components/RecursosCurso';

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
        const response = await fetch('https://elasoft-back.onrender.com/api/alumno/dashboard/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        }); 
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData(null);
      } finally {
        setCargando(false);
      }
    };
    fetchDashboard();
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (!data) return <p>No hay datos disponibles.</p>;

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
                <th>Horario</th>
                <th>Profesor</th>
                <th>Contacto(WhatsApp)</th>
                <th>Participación</th>
                <th>Tareas</th>
                <th>Examen Final</th> 
                <th>Promedio</th>
                <th>Asistencia (%)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.clases.map((n, i) => {
                // Log para ver el ID y nombre del curso
                console.log(`Curso: ${n.curso_nombre}, clase_id: ${n.clase_id}`);
                return (
                  <React.Fragment key={i}>
                    <tr>
                      <td>{n.curso_nombre || '-'}</td>
                      <td>{n.horarios.join(', ') || '-'}</td>
                      <td>{n.profesor_nombre || '-'}</td>
                      <td>{n.profesor_telefono || '-'}</td>
                      <td>{n.participacion}</td>
                      <td>{n.tareas}</td>
                      <td>{n.examen_final}</td>
                      <td>{n.promedio}</td>
                      <td>{n.asistencia_pct}%</td>
                      <td>
                        <span className={`badge ${n.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'}`}>
                          {n.estado}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="10">
                        <RecursosCurso claseId={n.clase_id} esProfesor={false} />
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="text-center mt-4">
            <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/alumno/reporte")}>
                Imprimir / Guardar PDF
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumno;
