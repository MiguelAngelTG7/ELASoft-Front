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
    grupo_sanguineo: '',
    alergias: '',
    interesado: false,
    nuevo_creyente: false,
    bautizado: false,
    tiene_ministerio: false,
    periodo_id: '', // Nuevo campo
    class_id: '',
  });

  const [periodos, setPeriodos] = useState([]);
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Obtener periodos al cargar
  useEffect(() => {
    axios.get('/periodos/')
      .then(res => setPeriodos(res.data))
      .catch(err => console.error('Error al obtener periodos:', err));
  }, []);

  // Obtener clases del ciclo seleccionado
  useEffect(() => {
    if (formData.periodo_id) {
      axios.get(`/clases/?periodo_id=${formData.periodo_id}`)
        .then(res => setClases(res.data))
        .catch(err => console.error('Error al obtener clases:', err));
    } else {
      setClases([]);
    }
  }, [formData.periodo_id]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'periodo_id' ? { class_id: '' } : {}), // Limpia clase si cambia ciclo
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      await axios.post('/director/crear-alumno/', formData);
      setMensaje('Alumno creado exitosamente');
      setTimeout(() => navigate('/director'), 1500);
    } catch (error) {
      setMensaje('Error al crear alumno');
    }
  };

  return (
    <div className="container py-4">
      <h3>Crear nuevo alumno</h3>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-2">
            <label>Nombre de usuario</label>
            <input type="text" name="username" className="form-control" required onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Contraseña</label>
            <input type="password" name="password" className="form-control" required onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Nombres</label>
            <input type="text" name="first_name" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Apellidos</label>
            <input type="text" name="last_name" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Email</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Dirección</label>
            <input type="text" name="direccion" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Teléfono</label>
            <input type="text" name="telefono" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Grupo Sanguíneo</label>
            <input type="text" name="grupo_sanguineo" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <label>Alergias</label>
            <textarea name="alergias" className="form-control" onChange={handleChange}></textarea>
          </div>

          <div className="col-md-3 mb-2 form-check">
            <input type="checkbox" name="interesado" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label">Interesado</label>
          </div>
          <div className="col-md-3 mb-2 form-check">
            <input type="checkbox" name="nuevo_creyente" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label">Nuevo creyente</label>
          </div>
          <div className="col-md-3 mb-2 form-check">
            <input type="checkbox" name="bautizado" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label">Bautizado</label>
          </div>
          <div className="col-md-3 mb-2 form-check">
            <input type="checkbox" name="tiene_ministerio" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label">Tiene ministerio</label>
          </div>

          {/* Selector de ciclo */}
          <div className="col-md-12 mb-3">
            <label>Selecciona ciclo</label>
            <select
              name="periodo_id"
              className="form-control"
              value={formData.periodo_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona un ciclo --</option>
              {periodos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de clase */}
          <div className="col-md-12 mb-3">
            <label>Asignar a una clase</label>
            <select
              name="class_id"
              className="form-control"
              value={formData.class_id}
              onChange={handleChange}
              required
              disabled={!formData.periodo_id}
            >
              <option value="">-- Selecciona una clase --</option>
              {clases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre_completo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-success">Crear Alumno</button>
      </form>
    </div>
  );
};

export default CrearAlumno;
