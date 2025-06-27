import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/api';

const Asistencia = () => {
  const { claseId } = useParams();
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // fecha actual
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Cargar la asistencia desde la API
  const fetchAsistencias = async () => {
    try {
      const response = await axios.get(`/clases/${claseId}/asistencia/`, {
        params: { fecha }
      });
      setAsistencias(response.data);
    } catch (error) {
      console.error('Error al cargar asistencia:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, [fecha]);

  const togglePresente = (index) => {
    const nuevasAsistencias = [...asistencias];
    nuevasAsistencias[index].presente = !nuevasAsistencias[index].presente;
    setAsistencias(nuevasAsistencias);
  };

  const guardarAsistencia = async () => {
    try {
      await axios.post(`/clases/${claseId}/asistencia/guardar/`, {
        fecha,
        asistencias
      });
      setMensaje('✅ Asistencia guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      setMensaje('❌ Error al guardar asistencia.');
    }
  };

  if (cargando) return <p>Cargando asistencia...</p>;

  return (
    <div className="container">
      <h2>Asistencia</h2>

      <label>
        Fecha:{' '}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </label>

      {mensaje && <p>{mensaje}</p>}

      {asistencias.length === 0 ? (
        <p>No hay alumnos registrados para esta clase.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Presente</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia, index) => (
              <tr key={asistencia.alumno_id}>
                <td>{asistencia.alumno_nombre}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={asistencia.presente}
                    onChange={() => togglePresente(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={guardarAsistencia} style={{ marginTop: '1rem' }}>
        Guardar asistencia
      </button>
    </div>
  );
};

export default Asistencia;
