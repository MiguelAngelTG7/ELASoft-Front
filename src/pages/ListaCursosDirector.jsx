// pages/ListaCursosDirector.jsx

import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ListaCursosDirector = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const volver = () => navigate('/director');
  

  useEffect(() => {
    axios.get('/director/periodos/')
      .then(res => setPeriodos(res.data.periodos))
      .catch(() => setPeriodos([]));
  }, []);

  useEffect(() => {
    if (!periodoId) {
      setCursos([]);
      return;
    }
    setCargando(true);
    axios.get(`/director/dashboard/?periodo_id=${periodoId}`)
      .then(res => {
        const rawCursos = Array.isArray(res.data?.dashboard) ? res.data.dashboard : [];
        const normalizaNivel = (nivel) => {
          if (!nivel) return 0;
          const match = String(nivel).match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        };
        const cursosOrdenados = [...rawCursos].sort((a, b) => {
          const nA = normalizaNivel(a.nivel);
          const nB = normalizaNivel(b.nivel);
          if (nA !== nB) return nA - nB;
          if ((a.curso || '') < (b.curso || '')) return -1;
          if ((a.curso || '') > (b.curso || '')) return 1;
          return 0;
        });
        setCursos(cursosOrdenados);
      })
      .catch(() => setCursos([]))
      .finally(() => setCargando(false));
  }, [periodoId]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Lista de Cursos</h2>
      </div>

      <select
        className="form-select mb-3"
        style={{ width: 400 }}
        value={periodoId}
        onChange={(e) => setPeriodoId(e.target.value)}
      >
        <option value="">Seleccione un periodo académico</option>
        {periodos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      {cargando && <div>Cargando cursos...</div>}

  {!cargando && Array.isArray(cursos) && cursos.length > 0 && (() => {
        // Calcular totales
        const totalAlumnos = cursos.reduce((acc, c) => acc + (c.total_alumnos || 0), 0);
        const sumaAsistencia = cursos.reduce((acc, c) => acc + ((c.asistencia_promedio || 0) * (c.total_alumnos || 0)), 0);
        const sumaAprobados = cursos.reduce((acc, c) => acc + ((c.porcentaje_aprobados || 0) * (c.total_alumnos || 0)), 0);
        const totalMaestros = new Set([
          ...cursos.map(c => c.maestro_titular?.nombre_completo).filter(Boolean),
          ...cursos.map(c => c.maestro_asistente?.nombre_completo).filter(Boolean)
        ]).size;
        const totalCursos = cursos.length;
        const asistenciaTotal = totalAlumnos ? (sumaAsistencia / totalAlumnos).toFixed(2) : '0.00';
        const aprobadosTotal = totalAlumnos ? (sumaAprobados / totalAlumnos).toFixed(2) : '0.00';

        // Datos para el gráfico
        const barData = {
          labels: cursos.map(c => c.curso),
          datasets: [
            {
              label: 'Alumnos',
              data: cursos.map(c => c.total_alumnos || 0),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
          ],
        };

        const barOptions = {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Alumnos por Curso' },
          },
          scales: {
            x: { title: { display: true, text: 'Curso' } },
            y: { title: { display: true, text: 'Alumnos' }, beginAtZero: true },
          },
        };

        return (
          <>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Nivel</th>
                  <th>Curso</th>
                  <th>Horario</th>
                  <th>Maestro Titular</th>
                  <th>Maestro Asistente</th>
                  <th>Alumnos</th>
                  <th>% Asistencia</th>
                  <th>% Aprobados</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((clase, i) => (
                  <tr key={i}>
                    <td>{clase.nivel}</td>
                    <td>{clase.curso}</td>
                    <td>{clase.horarios?.map((h, i) => <div key={i}>{h}</div>)}</td>
                    <td>{clase.maestro_titular?.nombre_completo || "—"}</td>
                    <td>{clase.maestro_asistente?.nombre_completo || "—"}</td>
                    <td>{clase.total_alumnos}</td>
                    {/* Asistencia */}
                    <td>
                        <div className="progress" style={{ height: '20px' }}>
                            <div
                            className={`progress-bar ${
                                clase.asistencia_promedio <= 30
                                ? 'bg-danger'
                                : clase.asistencia_promedio <= 70
                                ? 'bg-warning text-dark'
                                : 'bg-success'
                            }`}
                            role="progressbar"
                            style={{ width: `${clase.asistencia_promedio}%` }}
                            >
                            {clase.asistencia_promedio}%
                            </div>
                        </div>
                    </td>
                    {/* Aprobados */}
                    <td>
                        <div className="progress" style={{ height: '20px' }}>
                            <div
                            className={`progress-bar ${
                                clase.porcentaje_aprobados < 50
                                ? 'bg-danger'
                                : clase.porcentaje_aprobados < 80
                                ? 'bg-warning text-dark'
                                : 'bg-success'
                            }`}
                            role="progressbar"
                            style={{ width: `${clase.porcentaje_aprobados}%` }}
                            >
                            {clase.porcentaje_aprobados}%
                            </div>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Tabla de totales al final */}
            <div className="row justify-content-center mb-4">
              <div className="col-md-8">
                <table className="table table-bordered table-info fw-bold mb-0">
                  <tbody>
                    <tr>
                      <td className="text-end">Total de Alumnos:</td>
                      <td>{totalAlumnos}</td>
                      <td className="text-end">% Total Asistencia:</td>
                      <td>{asistenciaTotal}%</td>
                    </tr>
                    <tr>
                      <td className="text-end">% Total Aprobados:</td>
                      <td>{aprobadosTotal}%</td>
                      <td className="text-end">Total de Maestros:</td>
                      <td>{totalMaestros}</td>
                    </tr>
                    <tr>
                      <td className="text-end">Total de Cursos:</td>
                      <td>{totalCursos}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Gráfico de barras al final */}
            <div className="mb-4">
              <Bar data={barData} options={barOptions} />
            </div>
          </>
        );
      })()}

  {!cargando && periodoId && Array.isArray(cursos) && cursos.length === 0 && (
        <div>No hay cursos para este periodo.</div>
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

export default ListaCursosDirector;
