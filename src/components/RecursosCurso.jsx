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

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'video':
        return 'fas fa-play-circle text-danger';
      case 'archivo':
        return 'fas fa-file-alt text-primary';
      default:
        return 'fas fa-link text-info';
    }
  };

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'video':
        return 'bg-danger';
      case 'archivo':
        return 'bg-primary';
      default:
        return 'bg-info';
    }
  };

  return (
    <div>
      {/* Formulario para profesores */}
      {esProfesor && (
        <div 
          className="card mb-4 border-0"
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}
        >
          <div className="card-body p-3">
            <h6 className="text-success fw-bold mb-3 d-flex align-items-center">
              <i className="fas fa-plus-circle me-2"></i>
              Agregar Nuevo Recurso
            </h6>
            <form onSubmit={handleAgregar}>
              <div className="row g-2">
                <div className="col-12">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-heading text-muted"></i>
                    </span>
                    <input
                      type="text"
                      name="titulo"
                      value={nuevoRecurso.titulo}
                      onChange={handleChange}
                      placeholder="Título del recurso"
                      className="form-control border-start-0"
                      style={{ 
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-link text-muted"></i>
                    </span>
                    <input
                      type="url"
                      name="url"
                      value={nuevoRecurso.url}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/recurso"
                      className="form-control border-start-0"
                      style={{ 
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    name="tipo"
                    value={nuevoRecurso.tipo}
                    onChange={handleChange}
                    className="form-select"
                    style={{ 
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="video">📹 Video</option>
                    <option value="archivo">📄 Archivo</option>
                    <option value="otro">🔗 Otro</option>
                  </select>
                </div>
                <div className="col-12">
                  <button 
                    type="submit" 
                    className="btn btn-success w-100 d-flex align-items-center justify-content-center"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      padding: '10px'
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Agregar Recurso
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de recursos */}
      <div className="row g-3">
        {recursos.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-4">
              <div 
                className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                style={{ width: '60px', height: '60px' }}
              >
                <i className="fas fa-folder-open fa-2x text-muted"></i>
              </div>
              <h6 className="text-muted mb-2">No hay recursos disponibles</h6>
              <p className="text-secondary small mb-0">
                {esProfesor 
                  ? "Agrega el primer recurso para este curso" 
                  : "El profesor aún no ha compartido recursos"
                }
              </p>
            </div>
          </div>
        ) : (
          recursos.map(r => (
            <div className="col-md-6" key={r.id}>
              <div 
                className="card border-0 h-100"
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                }}
              >
                {/* Header del recurso */}
                <div className="card-body p-3">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle p-2 me-3"
                        style={{ backgroundColor: 'rgba(52, 144, 220, 0.1)' }}
                      >
                        <i className={getTypeIcon(r.tipo)} style={{ fontSize: '1.1rem' }}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                          {r.titulo}
                        </h6>
                        <span 
                          className={`badge ${getTypeColor(r.tipo)} rounded-pill px-2 py-1`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {r.tipo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* URL del recurso */}
                  <div className="mb-3">
                    <div className="bg-light rounded p-2">
                      <a 
                        href={r.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none d-flex align-items-center"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <i className="fas fa-external-link-alt text-primary me-2"></i>
                        <span className="text-truncate" title={r.url}>
                          {r.url.length > 40 ? `${r.url.substring(0, 40)}...` : r.url}
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Footer con fecha y acciones */}
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted d-flex align-items-center">
                      <i className="fas fa-calendar-alt me-1"></i>
                      {r.fecha ? new Date(r.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : "Sin fecha"}
                    </small>
                    
                    {esProfesor && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleEliminar(r.id)}
                        style={{ 
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          padding: '4px 8px'
                        }}
                        title="Eliminar recurso"
                      >
                        <i className="fas fa-trash-alt me-1"></i>
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecursosCurso;