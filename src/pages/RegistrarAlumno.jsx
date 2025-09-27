// Dashboard del Profesor para crear un nuevo alumno y asignarlo a una clase

import React, { useState } from 'react';
import axios from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const RegistrarAlumno = () => {
  const { claseId } = useParams();  // obtenemos claseId desde la URL
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
    en_ministerio: false,
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, class_id: claseId };
      await axios.post('/profesor/registrar-alumno/', payload);
      setMensaje('Alumno registrado correctamente');
      setError('');
      navigate(`/profesor/clase/${claseId}/asignar-alumnos`);
    } catch (err) {
      console.error(err);
      setError('Error al registrar alumno');
      setMensaje('');
    }
  };

  return (
    <div className="container py-4">
      <h3>Registrar Nuevo Alumno</h3>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label>Username</label>
            <input name="username" className="form-control" value={form.username} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Password</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Nombres</label>
            <input name="first_name" className="form-control" value={form.first_name} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Apellidos</label>
            <input name="last_name" className="form-control" value={form.last_name} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Fecha de nacimiento</label>
            <input name="fecha_nacimiento" type="date" className="form-control" value={form.fecha_nacimiento} onChange={handleChange} />
          </div>
          <div className="col-md-12">
            <label>Dirección</label>
            <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Teléfono</label>
            <input name="telefono" className="form-control" value={form.telefono} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Enfermedades y/o Alergias</label>
            <textarea name="enfermedades" className="form-control" rows="2" value={form.enfermedades} onChange={handleChange} placeholder="Enfermedades o condiciones médicas" />
          </div>
          <div className="col-md-12">
            <label>Medicamentos y Dosis</label>
            <textarea name="medicamentos_y_dosis" className="form-control" rows="2" value={form.medicamentos_y_dosis} onChange={handleChange} placeholder="Medicamentos que toma y sus dosis" />
          </div>
          <div className="col-md-3">
            <label><input type="checkbox" name="interesado" checked={form.interesado} onChange={handleChange} /> Interesado</label>
          </div>
          <div className="col-md-3">
            <label><input type="checkbox" name="nuevo_creyente" checked={form.nuevo_creyente} onChange={handleChange} /> Nuevo creyente</label>
          </div>
          <div className="col-md-3">
            <label><input type="checkbox" name="bautizado" checked={form.bautizado} onChange={handleChange} /> Bautizado</label>
          </div>
          <div className="col-md-3">
            <label><input type="checkbox" name="en_ministerio" checked={form.en_ministerio} onChange={handleChange} /> En ministerio</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Registrar Alumno</button>
        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate(-1)}>Cancelar</button>
      </form>
    </div>
  );
};

export default RegistrarAlumno;
