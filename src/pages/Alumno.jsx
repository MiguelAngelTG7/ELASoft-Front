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

  const descargarManual = () => {
    const link = document.createElement('a');
    link.href = '/Manual_Alumno_ELASoft.pdf';
    link.download = 'Manual_Alumno_ELASoft.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="d-flex gap-2">
          <button onClick={descargarManual} className="btn btn-outline-info">
            Descargar Manual
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
        </div>
      </div>

      {data.clases.length === 0 ? (
        <div className="alert alert-warning">Aún no estás inscrito en cursos.</div>
      ) : (
        <div>
          {data.clases.map((n, i) => {
            // Log para ver el ID y nombre del curso
            console.log(`Curso: ${n.curso_nombre}, clase_id: ${n.clase_id}`);
            return (
              <div key={i} className="mb-5">
                {/* Información del curso fuera de la tabla */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Información del Curso</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Curso:</strong> {n.curso_nombre || '-'}</p>
                        <p><strong>Horario:</strong> {n.horarios?.join(', ') || 'Sin horario'}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Profesor:</strong> {n.profesor_nombre || '-'}</p>
                        <p><strong>Contacto:</strong> {n.profesor_telefono || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla solo con datos académicos */}
                <h5 className="mb-3">Información Académica</h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-primary">
                      <tr>
                        <th>Participación [40%]</th>
                        <th>Tareas [20%]</th>
                        <th>Examen Final [40%]</th>
                        <th>Promedio</th>
                        <th>% Asistencia</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
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
                    </tbody>
                  </table>
                </div>

                {/* Recursos del curso */}
                <RecursosCurso claseId={n.clase_id} esProfesor={false} />
              </div>
            );
          })}

          <div className="text-center mt-4">
            <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/alumno/reporte")}>
                Imprimir / Guardar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumno;
