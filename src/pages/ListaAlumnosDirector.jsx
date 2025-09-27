// Lista de Alumnos para el Director

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const ListaAlumnosDirector = () => {
  const [clases, setClases] = useState([]);
  const [claseId, setClaseId] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);

  useEffect(() => {
    const fetchClases = async () => {
      const res = await axios.get('/director/clases/');
      // Ordenar clases de A a Z por nombre
      const clasesOrdenadas = res.data.sort((a, b) => 
        (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' })
      );
      setClases(clasesOrdenadas);
    };
    fetchClases();
  }, []);

  const cargarAlumnos = async () => {
    if (!claseId) return;
    const res = await axios.get(`/director/alumnos/?clase_id=${claseId}`);
    
    // Ordenar alumnos de A a Z por nombre completo
    const alumnosOrdenados = (res.data.alumnos || []).sort((a, b) => 
      (a.nombre_completo || '').localeCompare(b.nombre_completo || '', 'es', { sensitivity: 'base' })
    );
    
    setAlumnos(alumnosOrdenados);
    setClaseSeleccionada(res.data.clase); // opcional para imprimir
  };

  const imprimir = () => window.print();
  const navigate = useNavigate();
  const volver = () => navigate('/director');

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Lista de Alumnos</h2>
 
      </div>

      <div className="d-flex mb-3">
        <select
          className="form-select me-2"
          style={{ width: 400 }}
          value={claseId}
          onChange={(e) => setClaseId(e.target.value)}
        >
          <option value="">-- Escoge Clase y Horario --</option>
          {clases.map((clase) => (
            <option key={clase.id} value={clase.id}>
                {clase.nombre || 'Sin nombre'} -   
                ({clase.periodo_nombre || 'Sin periodo'}) 
                - {clase.horarios.join(' | ') || 'Sin horarios'}
            </option>
          ))}
        </select>

        <button onClick={cargarAlumnos} className="btn btn-primary me-2" disabled={!claseId}>Buscar</button>
      </div>

      {claseSeleccionada && (
        <div className="mb-3">
          <strong>Clase:</strong> {claseSeleccionada.nombre} ({claseSeleccionada.nivel})<br />
          <strong>Horarios:</strong> {(claseSeleccionada.horarios || []).join(', ')}
        </div>
      )}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Edad</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Sim</th>
            <th>NC</th>
            <th>Btz</th>
            <th>Min</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a) => (
            <tr key={a.id}>
              <td>{a.nombre_completo}</td>
              <td>{a.email}</td>
              <td>{a.edad || '-'}</td>
              <td>{a.telefono}</td>
              <td>{a.direccion}</td>
              <td>{a.interesado ? '✓' : ''}</td>
              <td>{a.nuevo_creyente ? '✓' : ''}</td>
              <td>{a.bautizado ? '✓' : ''}</td>
              <td>{a.tiene_ministerio ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small>Sim = Simparizante, NC = Nuevo Creyente, Btz = Bautizado, Min = Con Ministerio</small>

      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary me-3" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </button>
       <button onClick={volver} className="btn btn-secondary">Volver</button>
      </div>

    </div>
  );
};

export default ListaAlumnosDirector;
