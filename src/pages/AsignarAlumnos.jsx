import React, { useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const AsignarAlumnos = () => {
  const { claseId } = useParams();
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const buscarAlumnos = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`/alumnos/buscar/?q=${busqueda}&clase_id=${claseId}`);
      setAlumnos(res.data);
    } catch (err) {
      console.error('Error al buscar alumnos:', err);
    } finally {
      setCargando(false);
    }
  };

  const asignarAlumno = async (alumnoId) => {
    try {
      await axios.post(`/profesor/clases/${claseId}/asignar-alumno/`, {
        alumno_id: alumnoId,
      });
      setMensaje(`Alumno ${alumnoId} asignado correctamente.`);
      buscarAlumnos();  // 🔄 actualizar lista
    } catch (err) {
      console.error('Error al asignar alumno:', err);
      setMensaje('Error al asignar alumno.');
    }
  };

  const removerAlumno = async (alumnoId) => {
    try {
      await axios.post(`/profesor/clases/${claseId}/remover-alumno/`, {
        alumno_id: alumnoId,
      });
      setMensaje(`Alumno ${alumnoId} removido de la clase.`);
      buscarAlumnos();  // 🔄 actualizar lista
    } catch (err) {
      console.error('Error al remover alumno:', err);
      setMensaje('Error al remover alumno.');
    }
  };

  return (
    <div className="container py-4">
 

      <h3>Asignar | Remover alumnos a la clase</h3>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, apellido, correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn btn-primary" onClick={buscarAlumnos} disabled={!busqueda}>
          Buscar
        </button>
        <button className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
          Atrás
        </button>
      </div>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a) => (
              <tr key={a.id}>
                <td>{a.first_name} {a.last_name}</td>
                <td>{a.email}</td>
                <td>
                  {a.asignado ? (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removerAlumno(a.id)}
                    >
                      Quitar de clase
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => asignarAlumno(a.id)}
                    >
                      Asignar a clase
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AsignarAlumnos;
