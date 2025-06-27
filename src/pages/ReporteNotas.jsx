// src/pages/ReporteNotas.jsx

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ReporteNotas = () => {
  const { claseId } = useParams();
  const navigate = useNavigate();

  const [notas, setNotas] = useState([]);
  const [curso, setCurso] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const resp = await axios.get(`/clases/${claseId}/notas/`);
        setNotas(resp.data);

        if (resp.data.length > 0) {
          const clase = resp.data[0];
          setCurso({
            nombre: clase.curso_nombre,
            nivel: clase.nivel_nombre,
            horarios: clase.horarios.join(', '),
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
          {notas.map((n, i) => (
            <tr key={n.id}>
              <td>{i + 1}</td>
              <td>{n.alumno_nombre}</td>
              <td>{n.nota1}</td>
              <td>{n.nota2}</td>
              <td>{n.nota3}</td>
              <td>{n.nota4}</td>
              <td>{n.promedio?.toFixed(2)}</td>
              <td>{n.asistencia_pct}%</td>
              <td>
                <span className={`badge bg-${n.estado === 'Aprobado' ? 'success' : 'danger'}`}>
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
