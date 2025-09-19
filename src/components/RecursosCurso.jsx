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
    <div className="mt-3">
      <h5>Recursos del Curso</h5>
      {esProfesor && (
        <form className="mb-3 d-flex gap-2" onSubmit={handleAgregar}>
          <input
            type="text"
            name="titulo"
            value={nuevoRecurso.titulo}
            onChange={handleChange}
            placeholder="Título"
            className="form-control"
            style={{ maxWidth: 180 }}
          />
          <input
            type="url"
            name="url"
            value={nuevoRecurso.url}
            onChange={handleChange}
            placeholder="URL"
            className="form-control"
            style={{ maxWidth: 220 }}
          />
          <select
            name="tipo"
            value={nuevoRecurso.tipo}
            onChange={handleChange}
            className="form-select"
            style={{ maxWidth: 120 }}
          >
            <option value="video">Video</option>
            <option value="archivo">Archivo</option>
            <option value="otro">Otro</option>
          </select>
          <button type="submit" className="btn btn-success btn-sm">Agregar</button>
        </form>
      )}
      <ul className="list-group">
        {recursos.length === 0 ? (
          <li className="list-group-item text-muted">No hay recursos aún.</li>
        ) : (
          recursos.map(r => (
            <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>{r.titulo}</strong> <span className="badge bg-secondary">{r.tipo}</span>
                <br />
                <a href={r.url} target="_blank" rel="noopener noreferrer">{r.url}</a>
              </span>
              <span className="text-muted" style={{ fontSize: 12 }}>
                {r.fecha ? new Date(r.fecha).toLocaleDateString() : ""}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecursosCurso;