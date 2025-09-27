// Lista de Alumnos para el Profesor

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams } from 'react-router-dom';

const ListaAlumnos = () => {
  const params = useParams();
  const claseId = params.claseId || '';
  const [alumnos, setAlumnos] = useState([]);
  const [claseInfo, setClaseInfo] = useState({});

  // Cargar alumnos automáticamente si hay claseId en la URL
  useEffect(() => {
    const cargarAlumnos = async () => {
      try {
        if (!claseId) return;
        const res = await axios.get(`/profesor/alumnos/?clase_id=${claseId}`);
        const alumnosData = Array.isArray(res.data.alumnos) ? res.data.alumnos : [];
        // Ordenar alfabéticamente por nombre_completo
        const alumnosOrdenados = alumnosData.sort((a, b) => 
          (a.nombre_completo || '').localeCompare(b.nombre_completo || '', 'es', { sensitivity: 'base' })
        );
        setAlumnos(alumnosOrdenados);
        setClaseInfo(res.data.clase || {});
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
        setAlumnos([]);
        setClaseInfo({});
      }
    };
    cargarAlumnos();
  }, [claseId]);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Lista de Alumnos</h2>

      {claseInfo.clase_nombre && (
        <div className="mb-3">
          <h5>Clase: {claseInfo.clase_nombre} ({claseInfo.nivel})</h5>
          {claseInfo.horarios && (
            <p>Horarios: {claseInfo.horarios.join(', ')}</p>
          )}
        </div>
      )}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Fecha Nacimiento</th>
            <th>Edad</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            {/* <th>Sim</th> */}
            {/* <th>NC</th> */}
            {/* <th>Btz</th> */}
            {/* <th>Min</th> */}
          </tr>
        </thead>
        <tbody>
          {alumnos.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">No hay alumnos registrados.</td>
            </tr>
          ) : (
            alumnos.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre_completo}</td>
                <td>{a.fecha_nacimiento || '-'}</td>
                <td>{a.edad || '-'}</td>
                <td>{a.email}</td>
                <td>{a.telefono}</td>
                <td>{a.direccion}</td>
                {/* <td>{a.interesado ? '✓' : ''}</td>
                <td>{a.nuevo_creyente ? '✓' : ''}</td>
                <td>{a.bautizado ? '✓' : ''}</td>
                <td>{a.tiene_ministerio ? '✓' : ''}</td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* <small>Sim = Simpatizante, NC = Nuevo Creyente, Btz = Bautizado, Min = Con Ministerio</small> */}

      <div className="text-center mt-4 no-print">
        <button className="btn btn-outline-secondary me-3" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </button>
        <button onClick={() => window.history.back()} className="btn btn-secondary">Volver</button> 
      </div>
    </div>
  );
};

export default ListaAlumnos;
