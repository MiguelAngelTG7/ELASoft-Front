// src/pages/Notas.jsx

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const Notas = () => {
  const { claseId } = useParams();
  const navigate = useNavigate();
  const [notas, setNotas] = useState([]);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const resp = await axios.get(`/clases/${claseId}/notas/`);
        setNotas(resp.data);
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

  const calcularPromedio = (nota) => {
    const sum = [nota.nota1, nota.nota2, nota.nota3, nota.nota4].reduce(
      (acc, val) => acc + (parseFloat(val) || 0),
      0
    );
    return +(sum / 4).toFixed(2);
  };

  const calcularEstado = (nota) => {
    const promedio = calcularPromedio(nota);
    return promedio >= 13 ? 'Aprobado' : 'Desaprobado';
  };

  const guardar = async () => {
    try {
      const payload = {
        notas: notas.map(n => ({
          alumno_id: n.alumno_id,
          nota1: parseFloat(n.nota1) || 0,
          nota2: parseFloat(n.nota2) || 0,
          nota3: parseFloat(n.nota3) || 0,
          nota4: parseFloat(n.nota4) || 0,
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

      {cargando ? (
        <p>Cargando notas...</p>
      ) : (
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Nota 1</th>
              <th>Nota 2</th>
              <th>Nota 3</th>
              <th>Nota 4</th>
              <th>Prom</th>
              <th>Asist (%)</th>
              <th>Estado</th>
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
                    value={n.nota1}
                    onChange={(e) => cambiarNota(n.alumno_id, 'nota1', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    value={n.nota2}
                    onChange={(e) => cambiarNota(n.alumno_id, 'nota2', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    value={n.nota3}
                    onChange={(e) => cambiarNota(n.alumno_id, 'nota3', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="20"
                    value={n.nota4}
                    onChange={(e) => cambiarNota(n.alumno_id, 'nota4', e.target.value)}
                  />
                </td>
                <td>{n.promedio?.toFixed(2)}</td>
                <td>{n.asistencia_pct}%</td>
                <td>
                  <span
                    className={`badge bg-${n.estado === 'Aprobado' ? 'success' : 'danger'}`}
                  >
                    {n.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {guardado && (
        <div className="alert alert-success mt-3">Notas guardadas correctamente.</div>
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
