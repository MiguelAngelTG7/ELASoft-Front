import React, { useState, useMemo } from 'react';
import './RaceLeaderboard.css';

function Medal({ pos }) {
  if (pos === 1) return <span className="medal gold">1</span>;
  if (pos === 2) return <span className="medal silver">2</span>;
  if (pos === 3) return <span className="medal bronze">3</span>;
  return null;
}

export default function RaceLeaderboard({ data = [], minHeight = 64 }) {
  const [hoverId, setHoverId] = useState(null);
  const [open, setOpen] = useState(null);

  const { list, max } = useMemo(() => {
    const sorted = [...(data || [])].sort((a, b) => (b.score || 0) - (a.score || 0));
    const maxScore = sorted.length ? Math.max(...sorted.map(x => x.score || 0)) : 100;
    return { list: sorted, max: maxScore || 100 };
  }, [data]);

  const lanes = Math.max(3, list.length);
  const MIN_LANE_H = Math.max(48, minHeight); // ensure reasonable minimum
  const paddingTop = 12;
  const paddingBottom = 20;
  const laneH = MIN_LANE_H;
  const svgW = 1100;
  const svgH = paddingTop + lanes * laneH + paddingBottom;

  return (
    <div className="race-wrap" style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="race-svg"
        preserveAspectRatio="xMinYMin meet"
        role="img"
        aria-label="Carrera de cursos"
        style={{ width: '100%', height: svgH }}
      >
        {/* lanes background and finish line */}
        {Array.from({ length: lanes }).map((_, i) => {
          const y = paddingTop + i * laneH;
          return (
            <g key={`lane-${i}`}>
              <rect
                x="16"
                y={y}
                rx="12"
                width={svgW - 220}
                height={laneH - 12}
                fill={i % 2 ? '#fff' : '#f6faf6'}
                stroke="#e6ece6"
              />
              <line
                x1={svgW - 124}
                x2={svgW - 124}
                y1={y + 8}
                y2={y + laneH - 20}
                stroke="#222"
                strokeDasharray="6,4"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* runners */}
        {list.map((c, idx) => {
          const y = paddingTop + idx * laneH + laneH / 2;
          const pad = 56;
          const normalizedScore = Math.max(0, Math.min(1, (c.score || 0) / Math.max(max || 1, 1)));
          const x = pad + normalizedScore * (svgW - pad - 360);
          const initials = (c.initials || '')
            ? String(c.initials).toUpperCase().slice(0, 2)
            : (c.courseName ? c.courseName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : 'C');
          const color = idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#4a90e2';

          const teachersLabel = c.teachersLabel || ([
            c.maestro_titular?.nombre_completo,
            c.maestro_asistente?.nombre_completo
          ].filter(Boolean).join(' / ')) || '—';

          return (
            <g
              key={c.id ?? `${c.courseName}-${idx}`}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => setHoverId(c.id ?? `${idx}`)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => setOpen(c)}
              style={{ cursor: 'pointer' }}
            >
              <circle r="22" fill={color} stroke="#333" strokeWidth="1" />
              <text x="0" y="8" fontSize="13" fontWeight="700" textAnchor="middle" fill="#111">
                {initials}
              </text>

              <foreignObject x={46} y={-Math.floor(laneH / 2) + 8} width={svgW - x - 140} height={laneH - 12}>
                <div className="race-item" xmlns="http://www.w3.org/1999/xhtml">
                  <div className="course-name" title={c.courseName}>{c.courseName}</div>
                  <div className="teachers-label" title={teachersLabel}>{teachersLabel}</div>
                </div>
              </foreignObject>

              {hoverId === (c.id ?? `${idx}`) && (
                <g transform="translate(46,-54)">
                  <rect x="-8" y="-8" rx="8" width="360" height="72" fill="#fff" stroke="#ddd" />
                  <text x="6" y="8" fontSize="13" fill="#222" fontWeight="700">{c.courseName}</text>
                  <text x="6" y="26" fontSize="12" fill="#444">{teachersLabel}</text>
                  <text x="6" y="44" fontSize="12" fill="#666">
                    Score: {Math.round(c.score ?? 0)} · Asist: {c.attendance_pct ?? 0}% · Aprob: {c.grades_pct ?? 0}%
                  </text>
                </g>
              )}

              <foreignObject x={-18} y={-70} width="44" height="44">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Medal pos={idx + 1} />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      <div className="race-legend small text-muted" style={{ marginTop: 10 }}>
        <strong>Meta:</strong> Score = 50% notas + 50% asistencia. Haz clic en una fila para ver detalles.
      </div>

      {open && (
        <div className="race-modal-overlay" onClick={() => setOpen(null)}>
          <div className="race-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h5 style={{ margin: 0 }}>{open.courseName}</h5>
              <button className="btn-close" onClick={() => setOpen(null)} />
            </div>
            <div style={{ marginTop: 12 }}>
              <p style={{ margin: '4px 0' }}><strong>Maestros:</strong> {open.teachersLabel}</p>
              <p style={{ margin: '4px 0' }}><strong>Score:</strong> {Math.round(open.score ?? 0)}</p>
              <p style={{ margin: '4px 0' }}><strong>Asistencia promedio:</strong> {open.attendance_pct ?? 0}%</p>
              <p style={{ margin: '4px 0' }}><strong>% Aprobados:</strong> {open.grades_pct ?? 0}%</p>
              <p style={{ margin: '4px 0' }}><strong>Alumnos:</strong> {open.total_alumnos ?? open.courses_count ?? 'N/A'}</p>
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <button className="btn btn-sm btn-primary" onClick={() => setOpen(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}