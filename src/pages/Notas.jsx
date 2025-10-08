// Dashboard del Profesor para registrar notas de alumnos

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const Notas = () => {
  const { claseId } = useParams();
  const navigate = useNavigate();
  const [notas, setNotas] = useState([]);
  const [guardado, setGuardado] = useState(false);
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
        // Ordenar notas alfabéticamente por nombre del alumno
        const notasOrdenadas = resp.data.sort((a, b) => 
          (a.alumno_nombre || '').localeCompare(b.alumno_nombre || '', 'es', { sensitivity: 'base' })
        );
        setNotas(notasOrdenadas);
      } catch (err) {
        console.error("Error al cargar notas:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarNotas();
  }, [claseId]);

  const cambiarNota = (alumno_id, campo, valor) => {
    let nuevaNota = parseFloat(valor);
    if (isNaN(nuevaNota)) nuevaNota = 0;
    if (nuevaNota < 0) nuevaNota = 0;
    if (nuevaNota > 20) nuevaNota = 20;

    setNotas((prev) =>
      prev.map((n) =>
        n.alumno_id === alumno_id
          ? {
              ...n,
              [campo]: nuevaNota,
              promedio: calcularPromedio({
                ...n,
                [campo]: nuevaNota
              }),
              estado: calcularEstado({
                ...n,
                [campo]: nuevaNota
              }),
            }
          : n
      )
    );
  };

  const calcularPromedioParticipacion = (nota) => {
    // Part1[13.33%], Part2[13.33%], Part3[13.34%]
    const part1 = (parseFloat(nota.participacion_1) || 0) * 0.1333;
    const part2 = (parseFloat(nota.participacion_2) || 0) * 0.1333;
    const part3 = (parseFloat(nota.participacion_3) || 0) * 0.1334;
    return +(part1 + part2 + part3).toFixed(2);
  };

  const calcularPromedio = (nota) => {
    // Participación total 40%, Tareas 40%, Examen Final 20%
    const participacionTotal = calcularPromedioParticipacion(nota);
    const tareas = (parseFloat(nota.tareas) || 0) * 0.40;
    const examenFinal = (parseFloat(nota.examen_final) || 0) * 0.20;
    return +(participacionTotal + tareas + examenFinal).toFixed(2);
  };

  const calcularEstado = (nota) => {
    // Verificar si todas las notas están completas (mayor que 0)
    if ((nota.participacion_1 == 0 || nota.participacion_2 == 0 || nota.participacion_3 == 0) || 
        nota.tareas == 0 || nota.examen_final == 0) {
      return 'Pendiente';
    }
    
    const promedio = calcularPromedio(nota);
    // Asistencia mínima 75% y promedio mínimo 14
    return promedio >= 14 && (nota.asistencia_pct || 0) >= 75 ? 'Aprobado' : 'Desaprobado';
  };

  const guardar = async () => {
    try {
      const payload = {
        notas: notas.map(n => ({
          alumno_id: n.alumno_id,
          participacion_1: parseFloat(n.participacion_1) || 0,
          participacion_2: parseFloat(n.participacion_2) || 0,
          participacion_3: parseFloat(n.participacion_3) || 0,
          tareas: parseFloat(n.tareas) || 0,
          examen_final: parseFloat(n.examen_final) || 0,
        }))
      };

      await axios.post(`/clases/${claseId}/notas/`, payload);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (err) {
      console.error("Error al guardar notas:", err);
      alert("Hubo un error al guardar las notas. Intente nuevamente.");
    }
  };

  const volver = () => navigate("/profesor");

  return (
    <div className="container py-4">
      <h2 className="mb-3">Registro de Notas</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button onClick={guardar} className="btn btn-success me-2">Guardar</button>
          <button onClick={volver} className="btn btn-secondary">Volver</button>
        </div>
      </div>
      {/* Mensaje debajo del botón Guardar */}
      {guardado && (
        <div className="alert alert-success mb-3" style={{ maxWidth: 350 }}>
          Notas guardadas correctamente.
        </div>
      )}

      {cargando ? (
        <p>Cargando notas...</p>
      ) : (
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Part1 [13.33%]</th>
              <th>Part2 [13.33%]</th>
              <th>Part3 [13.34%]</th>
              <th>Tareas [40%]</th>
              <th>Examen Final [20%]</th>
              <th>Promedio Notas</th>
              <th>Asistencia (%)</th>
              <th>Condición</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((n) => (
              <tr key={n.alumno_id}>
                <td>{n.alumno_nombre}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    step="0.01"
                    value={n.participacion_1}
                    onChange={(e) => cambiarNota(n.alumno_id, 'participacion_1', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    step="0.01"
                    value={n.participacion_2}
                    onChange={(e) => cambiarNota(n.alumno_id, 'participacion_2', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    step="0.01"
                    value={n.participacion_3}
                    onChange={(e) => cambiarNota(n.alumno_id, 'participacion_3', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    step="0.01"
                    value={n.tareas}
                    onChange={(e) => cambiarNota(n.alumno_id, 'tareas', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    step="0.01"
                    value={n.examen_final}
                    onChange={(e) => cambiarNota(n.alumno_id, 'examen_final', e.target.value)}
                  />
                </td>
                <td>{n.promedio?.toFixed(2)}</td>
                <td>{n.asistencia_pct}%</td>
                <td>
                  <span
                    className={`badge bg-${getEstadoColor(n.estado)}`}
                  >
                    {n.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate(`/profesor/notas/${claseId}/reporte`)}
        className="btn btn-outline-primary"
      >
        Ver Reporte Imprimible
      </button>
    </div>
  );
};

export default Notas;
