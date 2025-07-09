// Reporte para el Profesor de Asistencia del Alumno para imprimir o guardar como PDF

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.jsx';

const ReporteAsistencia = () => {
  const { claseId } = useParams();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await api.get(`/clases/${claseId}/reporte-asistencia/`);
        setReporte(response.data);
      } catch (err) {
        setError('Error al cargar el reporte de asistencia.');
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, [claseId]);

  if (loading) return <div>Cargando reporte...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!reporte) return <div>No hay datos de reporte.</div>;

  // El backend retorna un objeto con: clase, total_sesiones, fechas, reporte (array de alumnos), total_presentes, total_ausentes, total_alumnos

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reporte de Asistencia de la Clase: {reporte.clase}</h2>
      <p><b>Total sesiones:</b> {reporte.total_sesiones}</p>
      <p><b>Fechas:</b> {reporte.fechas && reporte.fechas.join(', ')}</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
            {reporte.fechas && reporte.fechas.map((fecha, idx) => (
              <th key={idx} style={{ border: '1px solid #ccc', padding: '8px' }}>{fecha}</th>
            ))}
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Presentes</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ausentes</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>% Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {reporte.reporte && reporte.reporte.length > 0 ? (
            reporte.reporte.map((fila, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{fila.nombre}</td>
                {reporte.fechas && reporte.fechas.map((fecha, fidx) => {
                  // Si el backend no trae la info por fecha, solo muestra ✓ si presentes > 0 para esa fecha
                  // Aquí asumimos que fila.fechas es igual a reporte.fechas y que hay un registro de asistencia por fecha
                  // Si tienes la info por fecha, reemplaza esto por el valor real
                  // Por ahora, solo muestra vacío
                  return (
                    <td key={fidx} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      {/* Si tienes la info, muestra ✓ o X */}
                      {/* Ejemplo: fila.asistencias && fila.asistencias[fidx]?.presente ? '✓' : '✗' */}
                      {fila.asistencias && fila.asistencias[fidx] !== undefined
                        ? (fila.asistencias[fidx].presente ? '✓' : '✗')
                        : ''}
                    </td>
                  );
                })}
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{fila.presentes}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{fila.ausentes}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{fila.porcentaje}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4 + (reporte.fechas ? reporte.fechas.length : 0)} style={{ textAlign: 'center' }}>No hay alumnos en esta clase.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem' }}>
        <b>Total de alumnos:</b> {reporte.total_alumnos} &nbsp; | &nbsp;
        <b>% Presentes:</b> {reporte.total_alumnos && reporte.total_sesiones ? ((reporte.total_presentes / (reporte.total_alumnos * reporte.total_sesiones)) * 100).toFixed(2) : '0.00'}% &nbsp; | &nbsp;
        <b>% Ausentes:</b> {reporte.total_alumnos && reporte.total_sesiones ? ((reporte.total_ausentes / (reporte.total_alumnos * reporte.total_sesiones)) * 100).toFixed(2) : '0.00'}% &nbsp; | &nbsp;
        <b>Asistencia promedio:</b> {reporte.reporte && reporte.reporte.length > 0 ? (reporte.reporte.reduce((acc, curr) => acc + (curr.porcentaje || 0), 0) / reporte.reporte.length).toFixed(2) : '0.00'}%
      </div>

      <div className="text-center mt-4 d-print-none">
        <div className="d-flex justify-content-center gap-2">
         <button className="btn btn-outline-primary" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
        <button className="btn btn-secondary" onClick={() => window.history.back()}>Volver</button>
        </div>
      </div>

      
    </div>
  );
};

export default ReporteAsistencia;
