// Reporte para el Profesor de Notas del Alumno para imprimir o guardar como PDF

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ReporteNotas = () => {
  const { claseId } = useParams();
  const navigate = useNavigate();

  const [notas, setNotas] = useState([]);
  const [curso, setCurso] = useState({});
  const [cargando, setCargando] = useState(true);

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Desaprobado':
        return 'danger';
      case 'Pendiente':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const resp = await axios.get(`/clases/${claseId}/notas/`);
        
        // Asegurar que todas las notas tengan los campos necesarios con valores por defecto
        const notasConDefaults = resp.data.map(nota => ({
          ...nota,
          participacion_1: nota.participacion_1 || 0,
          participacion_2: nota.participacion_2 || 0,
          participacion_3: nota.participacion_3 || 0,
          tareas: nota.tareas || 0,
          examen_final: nota.examen_final || 0,
          promedio: nota.promedio || 0,
          asistencia_pct: nota.asistencia_pct || 0,
          estado: nota.estado || 'Pendiente'
        }));
        
        setNotas(notasConDefaults);

        if (resp.data.length > 0) {
          const clase = resp.data[0];
          setCurso({
            nombre: clase.curso_nombre,
            nivel: clase.nivel_nombre,
            horarios: Array.isArray(clase.horarios) ? clase.horarios.join(', ') : '',
          });
        }
      } catch (err) {
        console.error("Error al cargar reporte:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarNotas();
  }, [claseId]);

  const imprimir = () => window.print();
  const volver = () => navigate(`/profesor/notas/${claseId}`);

  if (cargando) return <p>Cargando reporte...</p>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-3">Reporte de Notas</h2>

      <div className="mb-4">
        <strong>Curso:</strong> {curso.nombre} <br />
        <strong>Nivel:</strong> {curso.nivel} <br />
        <strong>Horarios:</strong> {curso.horarios}
      </div>

      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Alumno</th>
            <th>Part1</th>
            <th>Part2</th>
            <th>Part3</th>
            <th>Tareas</th>
            <th>Examen final</th>
            <th>Promedio</th>
            <th>Asistencia (%)</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((n, i) => (
            <tr key={n.id || n.alumno_id || i}>
              <td>{i + 1}</td>
              <td>{n.alumno_nombre}</td>
              <td>{n.participacion_1 || '-'}</td>
              <td>{n.participacion_2 || '-'}</td>
              <td>{n.participacion_3 || '-'}</td>
              <td>{n.tareas}</td>
              <td>{n.examen_final}</td>
              <td>{n.promedio?.toFixed ? n.promedio.toFixed(2) : n.promedio}</td>
              <td>{n.asistencia_pct}%</td>
              <td>
                <span className={`badge bg-${getEstadoColor(n.estado)}`}>
                  {n.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-4 d-print-none">
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-outline-primary" onClick={imprimir}>
            Imprimir / Guardar PDF
          </button>
          <button className="btn btn-secondary" onClick={volver}>
            Volver
          </button>
        </div>
      </div>

    </div>
  );
};

export default ReporteNotas;
