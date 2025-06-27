// src/pages/Asistencia.jsx

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const Asistencia = () => {
  const { claseId } = useParams();
  const navigate = useNavigate();
  const [asistencias, setAsistencias] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarAsistencia = async () => {
      try {
        const resp = await axios.get(`/clases/${claseId}/asistencia/?fecha=${fecha}`);
        setAsistencias(resp.data);
      } catch (err) {
        console.error("Error al obtener asistencia", err);
      } finally {
        setCargando(false);
      }
    };
    cargarAsistencia();
  }, [claseId, fecha]);

  const toggleAsistencia = (alumno_id) => {
    setAsistencias((prev) =>
      prev.map((a) =>
        a.alumno_id === alumno_id ? { ...a, presente: !a.presente } : a
      )
    );
  };

  const guardar = async () => {
    try {
      await axios.post(`/clases/${claseId}/asistencia/guardar/`, {
        fecha,
        asistencias,
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (err) {
      console.error("Error al guardar", err);
    }
  };

  const volver = () => navigate("/profesor");

  return (
    <div className="container py-4">
      <h2 className="mb-3">Registro de Asistencia</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <label htmlFor="fecha" className="form-label">Fecha:</label>
          <input
            type="date"
            className="form-control"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div>
          <button onClick={guardar} className="btn btn-success me-2">Guardar</button>
          <button onClick={volver} className="btn btn-secondary">Volver</button>
        </div>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.alumno_id}>
                <td>{a.alumno_nombre}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={a.presente}
                    onChange={() => toggleAsistencia(a.alumno_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {guardado && (
        <div className="alert alert-success mt-3">Asistencia guardada correctamente.</div>
      )}
    </div>
  );
};

export default Asistencia;
