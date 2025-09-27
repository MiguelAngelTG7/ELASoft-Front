// Formulario para crear un nuevo alumno en la plataforma

import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const CrearAlumno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    enfermedades: '',
    medicamentos_y_dosis: '',
    interesado: false,
    nuevo_creyente: false,
    bautizado: false,
    tiene_ministerio: false
  });

  // Estados para la asignación de cursos
  const [periodos, setPeriodos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar períodos al montar el componente
  useEffect(() => {
    const cargarPeriodos = async () => {
      try {
        const response = await axios.get('/director/periodos/');
        setPeriodos(response.data || []);
      } catch (error) {
        console.error('Error al cargar períodos:', error);
      }
    };
    cargarPeriodos();
  }, []);

  // Cargar cursos cuando se selecciona un período
  useEffect(() => {
    if (periodoSeleccionado) {
      const cargarCursos = async () => {
        try {
          const response = await axios.get(`/director/clases-periodo/?periodo_id=${periodoSeleccionado}`);
          setCursosDisponibles(response.data || []);
        } catch (error) {
          console.error('Error al cargar cursos:', error);
          setCursosDisponibles([]);
        }
      };
      cargarCursos();
    } else {
      setCursosDisponibles([]);
      setCursosSeleccionados([]);
    }
  }, [periodoSeleccionado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCursoToggle = (cursoId) => {
    setCursosSeleccionados(prev => {
      if (prev.includes(cursoId)) {
        return prev.filter(id => id !== cursoId);
      } else {
        return [...prev, cursoId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        cursos: cursosSeleccionados // Agregar cursos seleccionados
      };

      const response = await axios.post('/director/crear-alumno/', dataToSend);
      
      setSuccess(`Alumno creado exitosamente. ${response.data.cursos_asignados?.length > 0 ? `Asignado a ${response.data.cursos_asignados.length} curso(s).` : ''}`);
      
      // Limpiar formulario
      setFormData({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        fecha_nacimiento: '',
        direccion: '',
        telefono: '',
        enfermedades: '',
        medicamentos_y_dosis: '',
        interesado: false,
        nuevo_creyente: false,
        bautizado: false,
        tiene_ministerio: false
      });
      setPeriodoSeleccionado('');
      setCursosSeleccionados([]);

    } catch (error) {
      console.error('Error al crear alumno:', error);
      setError(error.response?.data?.detail || 'Error al crear el alumno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mb-0">Crear Nuevo Alumno</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success alert-dismissible">
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Usuario *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Contraseña *</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="first_name" className="form-label">Nombres</label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="last_name" className="form-label">Apellidos</label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="enfermedades" className="form-label">Enfermedades y/o Alergias</label>
                      <textarea
                        className="form-control"
                        id="enfermedades"
                        name="enfermedades"
                        rows="3"
                        value={formData.enfermedades}
                        onChange={handleChange}
                        placeholder="Descripción de enfermedades o condiciones médicas..."
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="medicamentos_y_dosis" className="form-label">Medicamentos y Dosis</label>
                      <textarea
                        className="form-control"
                        id="medicamentos_y_dosis"
                        name="medicamentos_y_dosis"
                        rows="3"
                        value={formData.medicamentos_y_dosis}
                        onChange={handleChange}
                        placeholder="Medicamentos que toma y sus dosis..."
                      />
                    </div>
                  </div>
                </div>

                {/* Checkboxes de verificación */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="mb-3">Información Ministerial</h5>
                  </div>
                  <div className="col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="interesado"
                        name="interesado"
                        checked={formData.interesado}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="interesado">
                        Interesado
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="nuevo_creyente"
                        name="nuevo_creyente"
                        checked={formData.nuevo_creyente}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="nuevo_creyente">
                        Nuevo creyente
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="bautizado"
                        name="bautizado"
                        checked={formData.bautizado}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="bautizado">
                        Bautizado
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="tiene_ministerio"
                        name="tiene_ministerio"
                        checked={formData.tiene_ministerio}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="tiene_ministerio">
                        Tiene ministerio
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sección de asignación de cursos */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="mb-3">Asignación de Cursos (Opcional)</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="periodo" className="form-label">Período Académico</label>
                      <select
                        className="form-select"
                        id="periodo"
                        value={periodoSeleccionado}
                        onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                      >
                        <option value="">Seleccionar período...</option>
                        {periodos.map(periodo => (
                          <option key={periodo.id} value={periodo.id}>
                            {periodo.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {periodoSeleccionado && cursosDisponibles.length > 0 && (
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="mb-3">Cursos Disponibles</h6>
                      <div className="row">
                        {cursosDisponibles.map(curso => (
                          <div key={curso.id} className="col-md-6 col-lg-4 mb-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`curso_${curso.id}`}
                                checked={cursosSeleccionados.includes(curso.id)}
                                onChange={() => handleCursoToggle(curso.id)}
                              />
                              <label className="form-check-label" htmlFor={`curso_${curso.id}`}>
                                <strong>{curso.nombre}</strong><br />
                                <small className="text-muted">
                                  {curso.nivel} • {curso.horarios.join(', ')}<br />
                                  {curso.total_alumnos} alumnos
                                </small>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {cursosSeleccionados.length > 0 && (
                  <div className="alert alert-info">
                    <strong>Cursos seleccionados:</strong> {cursosSeleccionados.length}
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Crear Alumno'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/director')}
                  >
                    Volver
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearAlumno;
