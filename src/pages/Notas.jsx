import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Notas = () => {
  const { claseId } = useParams();
  const [notas, setNotas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  const volver = () => {
    navigate('/profesor');
  };

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const response = await axios.get(`/clases/${claseId}/notas/`);
        setNotas(response.data);
      } catch (error) {
        console.error("Error al obtener notas:", error);
      }
    };

    fetchNotas();
  }, [claseId]);

  const handleChange = (index, campo, valor) => {
    const nuevasNotas = [...notas];
    nuevasNotas[index][campo] = parseFloat(valor);
    setNotas(nuevasNotas);
  };

  const guardarNotas = async () => {
    try {
      const notasTransformadas = notas.map(n => ({
        alumno_id: n.alumno,  // Backend espera "alumno_id"
        nota1: n.nota1,
        nota2: n.nota2,
        nota3: n.nota3,
        nota4: n.nota4
      }));

      await axios.post(`/clases/${claseId}/notas/`, {
        notas: notasTransformadas
      });

      // 🔁 Recargar las notas desde el backend para ver promedios y estado actualizados
      const response = await axios.get(`/clases/${claseId}/notas/`);
      setNotas(response.data);

      setMensaje('✅ Notas guardadas correctamente');
    } catch (error) {
      console.error('❌ Error al guardar notas:', error);
      setMensaje('❌ Error al guardar notas');
    }
  };

  return (
    <div className="container">
      <h2>Notas</h2>
      {mensaje && <p>{mensaje}</p>}

      {notas.length === 0 ? (
        <p>No hay alumnos registrados en esta clase.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Nota 1</th>
              <th>Nota 2</th>
              <th>Nota 3</th>
              <th>Nota 4</th>
              <th>Promedio</th>
              <th>Asistencia %</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((n, idx) => (
              <tr key={`row-${n.alumno || idx}`}>
                <td>{n.alumno_nombre}</td>
                {[1, 2, 3, 4].map(i => (
                  <td key={`nota${i}-${n.alumno || idx}`}>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={n[`nota${i}`]}
                      onChange={e => handleChange(idx, `nota${i}`, e.target.value)}
                    />
                  </td>
                ))}
                <td>{n.promedio}</td>
                <td>{n.asistencia_pct}%</td>
                <td>{n.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={guardarNotas}>Guardar notas</button>
      <div>
        <button className="btn btn-secondary me-2" onClick={volver}>← Atrás</button>
        <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
      </div>
    </div>
  );
};

export default Notas;
