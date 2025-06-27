import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const ReporteAlumno = () => {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const resp = await axios.get('/alumno/dashboard/');
        setData(resp.data);
      } catch (err) {
        console.error('Error al cargar reporte alumno:', err);
      } finally {
        setCargando(false);
      }
    };
    fetchDashboard();
  }, []);

  if (cargando) return <div className="text-center mt-5">Cargando reporte...</div>;
  if (!data) return <div className="alert alert-danger mt-5 text-center">Error al obtener datos.</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Reporte Académico</h2>
      <h5 className="mb-3">Alumno: {data.alumno_nombre}</h5>

      <table className="table table-bordered table-sm">
        <thead>
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
          {data.cursos.map((c, i) => (
            <tr key={i}>
              <td>{c.curso_nombre}</td>
              <td>{c.horarios.join(', ')}</td>
              <td>{c.nivel_nombre}</td>
              <td>{c.nota1}</td>
              <td>{c.nota2}</td>
              <td>{c.nota3}</td>
              <td>{c.nota4}</td>
              <td>{c.promedio}</td>
              <td>{c.asistencia_pct}%</td>
              <td>
                <span className={`badge ${c.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'}`}>
                  {c.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-4 d-print-none">
        <button className="btn btn-outline-primary me-2" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </button>
        <button className="btn btn-outline-secondary" onClick={() => window.history.back()}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default ReporteAlumno;
