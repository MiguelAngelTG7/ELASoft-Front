import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReporteDirector = () => {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const resp = await axios.get('/director/dashboard/');
        setData(resp.data.dashboard);
      } catch (err) {
        console.error("Error al cargar reporte del director:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <p>Cargando reporte...</p>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Reporte Académico General</h2>

      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Nivel</th>
            <th>Curso</th>
            <th>Horarios</th>
            <th>Periodo</th>
            <th>Alumnos</th>
            <th>Con Notas</th>
            <th>Aprobados</th>
            <th>% Aprobados</th>
            <th>Asistencia Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{c.nivel}</td>
              <td>{c.curso}</td>
              <td>{c.horarios.join(', ')}</td>
              <td>{c.periodo}</td>
              <td>{c.total_alumnos}</td>
              <td>{c.alumnos_con_notas}</td>
              <td>{c.aprobados}</td>
              <td>{c.porcentaje_aprobados}%</td>
              <td>{c.asistencia_promedio}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary me-3" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/director")}>
          Volver
        </button>
      </div>
      
    </div>
  );
};

export default ReporteDirector;
