import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const ListaAlumnos = () => {
  const [clases, setClases] = useState([]);
  const [claseId, setClaseId] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [claseInfo, setClaseInfo] = useState({});

  // Cargar clases del profesor
  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await axios.get('/profesor/clases/');
        setClases(res.data);
      } catch (error) {
        console.error("Error al cargar clases:", error);
      }
    };
    fetchClases();
  }, []);

  // Cargar alumnos según clase seleccionada
  const cargarAlumnos = async () => {
    try {
      if (!claseId) return;

      const res = await axios.get(`/profesor/alumnos/?clase_id=${claseId}`);
      setAlumnos(Array.isArray(res.data.alumnos) ? res.data.alumnos : []);
      setClaseInfo(res.data.clase || {});
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
      setAlumnos([]);
      setClaseInfo({});
    }
  };

  const imprimir = () => {
    window.print();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Lista de Alumnos</h2>

      <div className="d-flex mb-3 no-print">
        <select
          className="form-select me-2"
          style={{ width: 350 }}
          value={claseId}
          onChange={e => setClaseId(e.target.value)}
        >
          <option value="">Escoge Clase y Horario</option>
          {clases.map(clase => (
            <option key={clase.id} value={clase.id}>
              {clase.nombre_completo}
            </option>
          ))}
        </select>
        <button onClick={cargarAlumnos} className="btn btn-primary me-2">Buscar</button>
        <button onClick={imprimir} className="btn btn-outline-secondary">Imprimir</button>
      </div>

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
            <th>FechaNac</th>
            <th>Edad</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Sim</th>
            <th>NC</th>
            <th>Btz</th>
            <th>Min</th>
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
                <td>{a.interesado ? '✅' : ''}</td>
                <td>{a.nuevo_creyente ? '✅' : ''}</td>
                <td>{a.bautizado ? '✅' : ''}</td>
                <td>{a.tiene_ministerio ? '✅' : ''}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <small>Sim = Simparizante, NC = Nuevo Creyente, Btz = Bautizado, Min = Con Ministerio</small>
    </div>
    
  );
};

export default ListaAlumnos;
