// Lista de Alumnos para el Director

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const ListaAlumnosDirector = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState('');
  const [clases, setClases] = useState([]);
  const [claseId, setClaseId] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [cargandoPeriodos, setCargandoPeriodos] = useState(true);
  const [cargandoClases, setCargandoClases] = useState(false);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const fetchPeriodos = async () => {
      try {
        const res = await axios.get('/director/periodos/');
        const periodosOrdenados = [...(res.data || [])].sort((a, b) =>
          (Number(b.anio) || 0) - (Number(a.anio) || 0) ||
          (b.fecha_inicio || '').localeCompare(a.fecha_inicio || '')
        );
        if (activo) setPeriodos(periodosOrdenados);
      } catch {
        if (activo) setError('No fue posible cargar los períodos académicos.');
      } finally {
        if (activo) setCargandoPeriodos(false);
      }
    };

    fetchPeriodos();
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!periodoId) {
      setClases([]);
      return undefined;
    }

    let activo = true;
    setCargandoClases(true);
    setError('');

    axios.get(`/director/clases-periodo/?periodo_id=${periodoId}`)
      .then(res => {
        const ordenNivel = nivel => {
          const coincidencia = (nivel || '').match(/^nivel\s*(\d+)/i);
          if (coincidencia) {
            const numero = Number(coincidencia[1]);
            return numero <= 4 ? numero : numero + 1;
          }
          return (nivel || '').toLocaleLowerCase().includes('ministerial') ? 5 : 100;
        };
        const clasesOrdenadas = [...(res.data || [])].sort((a, b) =>
          ordenNivel(a.nivel) - ordenNivel(b.nivel) ||
          (a.nivel || '').localeCompare(b.nivel || '', 'es', { numeric: true, sensitivity: 'base' }) ||
          (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' })
        );
        if (activo) setClases(clasesOrdenadas);
      })
      .catch(() => {
        if (activo) {
          setClases([]);
          setError('No fue posible cargar los cursos de este período.');
        }
      })
      .finally(() => {
        if (activo) setCargandoClases(false);
      });

    return () => {
      activo = false;
    };
  }, [periodoId]);

  const cargarAlumnos = async () => {
    if (!claseId) return;
    setCargandoAlumnos(true);
    setError('');
    try {
      const res = await axios.get(`/director/alumnos/?clase_id=${claseId}`);
      const alumnosOrdenados = (res.data.alumnos || []).sort((a, b) =>
        (a.nombre_completo || '').localeCompare(b.nombre_completo || '', 'es', { sensitivity: 'base' })
      );
      setAlumnos(alumnosOrdenados);
      setClaseSeleccionada(clases.find(clase => String(clase.id) === String(claseId)) || null);
      setBusquedaRealizada(true);
    } catch {
      setAlumnos([]);
      setClaseSeleccionada(null);
      setBusquedaRealizada(false);
      setError('No fue posible cargar los alumnos de este curso.');
    } finally {
      setCargandoAlumnos(false);
    }
  };

  const navigate = useNavigate();
  const volver = () => navigate('/director');

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Lista de Alumnos</h2>
 
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor="periodoSelect" className="form-label">Período académico</label>
          <select
            id="periodoSelect"
            className="form-select"
            value={periodoId}
            disabled={cargandoPeriodos}
            onChange={(e) => {
              setPeriodoId(e.target.value);
              setClaseId('');
              setAlumnos([]);
              setClaseSeleccionada(null);
              setBusquedaRealizada(false);
              setError('');
            }}
          >
            <option value="">{cargandoPeriodos ? 'Cargando períodos...' : 'Seleccione un período'}</option>
            {periodos.map(periodo => (
              <option key={periodo.id} value={periodo.id}>
                {periodo.nombre} ({periodo.anio})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-5">
          <label htmlFor="cursoSelect" className="form-label">Curso</label>
          <select
            id="cursoSelect"
            className="form-select"
            value={claseId}
            disabled={!periodoId || cargandoClases || clases.length === 0}
            onChange={(e) => {
              setClaseId(e.target.value);
              setAlumnos([]);
              setClaseSeleccionada(null);
              setBusquedaRealizada(false);
            }}
          >
            <option value="">
              {!periodoId ? 'Seleccione primero un período' : cargandoClases ? 'Cargando cursos...' : 'Seleccione un curso'}
            </option>
            {clases.map(clase => (
              <option key={clase.id} value={clase.id}>
                {clase.nivel || 'Sin nivel'} - {clase.nombre || 'Sin nombre'} - {(clase.horarios || []).join(' | ') || 'Sin horario'}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <button
            onClick={cargarAlumnos}
            className="btn btn-primary w-100"
            disabled={!claseId || cargandoAlumnos}
          >
            {cargandoAlumnos ? 'Buscando...' : 'Ver alumnos'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {periodoId && !cargandoClases && clases.length === 0 && !error && (
        <div className="alert alert-info">No hay cursos registrados para este período.</div>
      )}

      {claseSeleccionada && (
        <div className="mb-3">
          <strong>Clase:</strong> {claseSeleccionada.nombre} ({claseSeleccionada.nivel})<br />
          <strong>Horarios:</strong> {(claseSeleccionada.horarios || []).join(', ')}
        </div>
      )}

      {busquedaRealizada && alumnos.length === 0 && (
        <div className="alert alert-info">No hay alumnos asignados a este curso.</div>
      )}

      {busquedaRealizada && alumnos.length > 0 && <table className="table table-bordered table-hover">
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
      </table>}
      {busquedaRealizada && alumnos.length > 0 && (
        <small>Sim = Simpatizante, NC = Nuevo Creyente, Btz = Bautizado, Min = Con Ministerio</small>
      )}

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
