// src/pages/Asistencia.jsx


import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const Asistencia = () => {
  const { claseId } = useParams();
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]); // [{ alumno_id, alumno_nombre, asistencias: [{fecha, presente}] }]
  const [fechas, setFechas] = useState([]); // ["2025-07-01", ...]
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarAsistencia = async () => {
      try {
        const resp = await axios.get(`/clases/${claseId}/asistencia/`);
        setAlumnos(resp.data.alumnos);
        setFechas(resp.data.fechas);
      } catch (err) {
        console.error("Error al obtener asistencia", err);
      } finally {
        setCargando(false);
      }
    };
    cargarAsistencia();
  }, [claseId]);

  const toggleAsistencia = (alumno_id, fecha_idx) => {
    setAlumnos((prev) =>
      prev.map((a) =>
        a.alumno_id === alumno_id
          ? {
              ...a,
              asistencias: a.asistencias.map((asist, idx) =>
                idx === fecha_idx ? { ...asist, presente: !asist.presente } : asist
              ),
            }
          : a
      )
    );
  };

  const guardar = async () => {
    try {
      await axios.post(`/clases/${claseId}/asistencia/guardar/`, {
        asistencias: alumnos,
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
   
        <div className="d-flex gap-2">
          <button onClick={guardar} className="btn btn-success">Guardar</button>
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
              {fechas.map((f, idx) => (
                <th key={idx}>{f}</th>
              ))}
              <th>Presentes</th>
              <th>Ausentes</th>
              <th>% Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a) => {
              const presentes = a.asistencias.filter(asist => asist.presente).length;
              const ausentes = a.asistencias.length - presentes;
              const porcentaje = a.asistencias.length > 0 ? ((presentes / a.asistencias.length) * 100).toFixed(2) : '0.00';
              return (
                <tr key={a.alumno_id}>
                  <td>{a.alumno_nombre}</td>
                  {a.asistencias.map((asist, idx) => (
                    <td key={idx} style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={asist.presente}
                        onChange={() => toggleAsistencia(a.alumno_id, idx)}
                      />
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>{presentes}</td>
                  <td style={{ textAlign: 'center' }}>{ausentes}</td>
                  <td style={{ textAlign: 'center' }}>{porcentaje}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {guardado && (
        <div className="alert alert-success mt-3">Asistencia guardada correctamente.</div>
      )}

      <button
        onClick={() => navigate(`/profesor/asistencia/${claseId}/reporte`)}
        className="btn btn-outline-primary"
      >
        Ver Reporte Imprimible
      </button>

    </div>
  );
};

export default Asistencia;
