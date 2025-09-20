import React, { useEffect, useState } from "react";
import axios from "../services/api";

const RecursosCurso = ({ claseId, esProfesor }) => {
  const [recursos, setRecursos] = useState([]);
  const [nuevoRecurso, setNuevoRecurso] = useState({ titulo: "", url: "", tipo: "video" });

  useEffect(() => {
    if (!claseId) return;
    const endpoint = esProfesor
      ? `/profesor/recursos/${claseId}/`
      : `/alumno/recursos/${claseId}/`;

    axios.get(endpoint)
      .then(res => setRecursos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRecursos([]));
  }, [claseId, esProfesor]);

  // Eliminar recurso
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este recurso?')) return;
    try {
      await axios.delete(`/profesor/recursos/${claseId}/`, { data: { id } });
      setRecursos(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Error al eliminar recurso');
    }
  };

  const handleChange = e => {
    setNuevoRecurso({ ...nuevoRecurso, [e.target.name]: e.target.value });
  };

  const handleAgregar = async e => {
    e.preventDefault();
    if (!nuevoRecurso.titulo || !nuevoRecurso.url) return;
    try {
      const res = await axios.post(`/profesor/recursos/${claseId}/`, nuevoRecurso);
      setRecursos(prev => [...prev, res.data]);
      setNuevoRecurso({ titulo: "", url: "", tipo: "video" });
    } catch (err) {
      alert("Error al agregar recurso");
    }
  };

  return (
    <div className="mt-4">
      <h5 style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '18px' }}>
        Recursos del Curso
      </h5>
      {esProfesor && (
        <form className="mb-3" onSubmit={handleAgregar}>
          <div className="mb-2">
            <input
              type="text"
              name="titulo"
              value={nuevoRecurso.titulo}
              onChange={handleChange}
              placeholder="Título"
              className="form-control"
              style={{ fontSize: '0.8rem' }}
            />
          </div>
          <div className="mb-2">
            <input
              type="url"
              name="url"
              value={nuevoRecurso.url}
              onChange={handleChange}
              placeholder="URL"
              className="form-control"
              style={{ fontSize: '0.8rem' }}
            />
          </div>
          <div className="mb-2">
            <select
              name="tipo"
              value={nuevoRecurso.tipo}
              onChange={handleChange}
              className="form-select"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="video">Video</option>
              <option value="archivo">Archivo</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success btn-sm" style={{ fontSize: '0.8rem', width: '100%' }}>
            Agregar
          </button>
        </form>
      )}
      <ul className="list-group">
        {recursos.length === 0 ? (
          <li className="list-group-item text-muted" style={{ fontSize: '0.8rem' }}>No hay recursos aún.</li>
        ) : (
          recursos.map(r => (
            <li key={r.id} className="list-group-item" style={{ fontSize: '0.85rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>{r.titulo}</strong>
              <span className="badge bg-secondary" style={{ fontSize: '0.7rem', marginLeft: 8 }}>{r.tipo}</span>
              <br />
              <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem' }}>{r.url}</a>
              <div className="d-flex flex-column align-items-start mt-1" style={{ gap: '0.3rem' }}>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {r.fecha ? new Date(r.fecha).toLocaleDateString() : ""}
                </span>
                {esProfesor && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    title="Eliminar recurso"
                    style={{ fontSize: '0.75rem', width: '100px' }}
                    onClick={() => handleEliminar(r.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecursosCurso;