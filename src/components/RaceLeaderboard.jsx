import React, { useState, useMemo } from 'react';
import './RaceLeaderboard.css';

function Medal({ pos }) {
  if (pos === 1) return <span className="medal gold">1</span>;
  if (pos === 2) return <span className="medal silver">2</span>;
  if (pos === 3) return <span className="medal bronze">3</span>;
  return null;
}

export default function RaceLeaderboard({ data = [], height = 260 }) {
  const [hoverId, setHoverId] = useState(null);
  const [open, setOpen] = useState(null);

  const { list, max } = useMemo(() => {
    const sorted = [...(data || [])].sort((a, b) => b.score - a.score);
    const maxScore = Math.max(...sorted.map(x => x.score), 100);
    return { list: sorted, max: maxScore };
  }, [data]);

  const lanes = Math.max(3, Math.min(list.length, 10));
  const svgW = 1000;
  const laneH = Math.max(28, Math.floor((height - 20) / lanes));

  return (
    <div className="race-wrap">
      <svg viewBox={`0 0 ${svgW} ${height}`} className="race-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Carrera de cursos">
        {Array.from({ length: lanes }).map((_, i) => {
          const y = 10 + i * laneH;
          return (
            <g key={i}>
              <rect x="20" y={y} rx="12" width={svgW - 160} height={laneH - 8} fill={i % 2 ? '#fff' : '#f6f9f6'} stroke="#e6ece6" />
              <line x1={svgW - 120} x2={svgW - 120} y1={y + 6} y2={y + laneH - 10} stroke="#222" strokeDasharray="6,4" strokeWidth="2" />
            </g>
          );
        })}

        {list.slice(0, lanes).map((c, idx) => {
          const y = 10 + idx * laneH + laneH / 2;
          const pad = 40;
          const x = pad + ((c.score / max) * (svgW - pad - 220));
          const initials = (c.initials || '').toUpperCase() || 'C';
          const color = idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#4a90e2';

          return (
            <g key={c.id || `${c.courseName}-${idx}`} transform={`translate(${x}, ${y})`}
               onMouseEnter={() => setHoverId(c.id)} onMouseLeave={() => setHoverId(null)}
               onClick={() => setOpen(c)} style={{ cursor: 'pointer' }}>
              <circle r="20" fill={color} stroke="#333" strokeWidth="1" />
              <text x="0" y="6" fontSize="12" fontWeight="700" textAnchor="middle" fill="#111">{initials}</text>

              <text x="46" y="-2" fontSize="13" fill="#111" fontWeight="700">{c.courseName}</text>
              <text x="46" y="14" fontSize="11" fill="#666">{c.teachersLabel}</text>

              {hoverId === c.id && (
                <g transform="translate(46,-36)">
                  <rect x="-6" y="-18" rx="8" width="220" height="44" fill="#fff" stroke="#ddd" />
                  <text x="4" y="-2" fontSize="12" fill="#222">{c.courseName}</text>
                  <text x="4" y="12" fontSize="11" fill="#666">{c.teachersLabel}</text>
                  <text x="4" y="26" fontSize="11" fill="#666">Score: {Math.round(c.score)} · Asist: {c.attendance_pct}% · Aprob: {c.grades_pct}%</text>
                </g>
              )}

              <foreignObject x={-14} y={-56} width="40" height="40">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Medal pos={idx + 1} />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      <div className="race-legend small text-muted" style={{ marginTop: 8 }}>
        <strong>Meta:</strong> Completar registros de asistencia y notas por curso. Score = 50% notas + 50% asistencia.
      </div>

      {open && (
        <div className="race-modal-overlay" onClick={() => setOpen(null)}>
          <div className="race-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start">
              <h5>{open.courseName}</h5>
              <button className="btn-close" onClick={() => setOpen(null)} />
            </div>
            <div className="mt-2">
              <p className="mb-1"><strong>Maestros:</strong> {open.teachersLabel}</p>
              <p className="mb-1"><strong>Score:</strong> {Math.round(open.score)}</p>
              <p className="mb-1"><strong>Asistencia promedio:</strong> {open.attendance_pct}%</p>
              <p className="mb-1"><strong>% Aprobados:</strong> {open.grades_pct}%</p>
              <p className="mb-1"><strong>Alumnos:</strong> {open.courses_count ?? 'N/A'}</p>
            </div>
            <div className="text-end mt-3">
              <button className="btn btn-sm btn-primary" onClick={() => setOpen(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}