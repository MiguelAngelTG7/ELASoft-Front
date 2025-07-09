// Buscar Alumnos para asignar/remover a/de una clase específica

import React, { useState } from 'react';
import axios from '../services/api';
import { useParams } from 'react-router-dom';

const BuscarAlumnos = () => {
  const { claseId } = useParams();
  const [query, setQuery] = useState('');
  const [alumnos, setAlumnos] = useState([]);

  const buscarAlumnos = async () => {
    try {
      const resp = await axios.get(`/alumnos/buscar/?q=${query}`);
      setAlumnos(resp.data);
    } catch (err) {
      console.error('Error al buscar alumnos:', err);
    }
  };

  const asignarAlumno = async (alumnoId) => {
    try {
      await axios.post(`/clases/${claseId}/asignar/`, { alumno_id: alumnoId });
      alert('Alumno asignado correctamente');
    } catch (err) {
      console.error('Error al asignar alumno:', err);
      alert('Error al asignar alumno');
    }
  };

  return (
    <div className="container py-4">
      <h2>Buscar y Asignar Alumnos</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre de usuario"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={buscarAlumnos}>Buscar</button>
      </div>

      {alumnos.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre de Usuario</th>
              <th>Email</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a) => (
              <tr key={a.id}>
                <td>{a.username}</td>
                <td>{a.email}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => asignarAlumno(a.id)}>
                    Asignar a la clase
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BuscarAlumnos;
