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
    interesado: false,
    nuevo_creyente: false,
    bautizado: false,
    tiene_ministerio: false,
    class_id: '',
  });

  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Obtener clases del profesor
  useEffect(() => {
    axios.get('/profesor/clases/')
      .then(res => setClases(res.data))
      .catch(err => console.error('Error al obtener clases:', err));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      await axios.post('/director/crear-alumno/', formData); // <-- usa la ruta del director
      setMensaje('Alumno creado exitosamente');
      setTimeout(() => navigate('/profesor'), 1500);
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

          <div className="col-md-12 mb-3">
            <label>Asignar a una clase</label>
            <select name="class_id" className="form-control" value={formData.class_id} onChange={handleChange} required>
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
