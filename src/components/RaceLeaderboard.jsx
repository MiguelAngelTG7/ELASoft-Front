import React, { useState, useMemo } from 'react';
import './RaceLeaderboard.css';

export default function RaceLeaderboard({ data = [], minHeight = 72 }) {
  const [hoverId, setHoverId] = useState(null);
  const [open, setOpen] = useState(null);

  const { list, max } = useMemo(() => {
    const sorted = [...(data || [])].sort((a, b) => (b.score || 0) - (a.score || 0));
    const maxScore = sorted.length ? Math.max(...sorted.map(x => x.score || 0)) : 100;
    return { list: sorted, max: Math.max(maxScore, 1) };
  }, [data]);

  const lanes = Math.max(3, list.length);
  const laneH = Math.max(56, minHeight);
  const paddingTop = 12;
  const paddingBottom = 20;

  const svgW = 1200;
  const labelWidth = 360;                 // fixed right column for names
  const leftPad = 24;                     // left padding of track
  const avatarR = 22;                     // runner circle radius
  const finishOffset = 24;                // space before label column
  const finishX = svgW - labelWidth - finishOffset; // x of finish line
  const maxCenterX = finishX - avatarR - 6; // runner center must not cross this
  const availableTrack = Math.max(1, maxCenterX - leftPad);
  const svgH = paddingTop + lanes * laneH + paddingBottom;

  return (
    <div className="race-wrap" style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="race-svg" preserveAspectRatio="xMinYMin meet"
           role="img" aria-label="Carrera de cursos" style={{ width: '100%', height: svgH }}>
        {/* lanes + track background + finish line */}
        {Array.from({ length: lanes }).map((_, i) => {
          const y = paddingTop + i * laneH;
          return (
            <g key={`lane-${i}`}>
              <rect x={leftPad - 8} y={y} rx="12" width={finishX - (leftPad - 8)} height={laneH - 12}
                    fill={i % 2 ? '#fff' : '#f6faf6'} stroke="#e6ece6" />
              <line x1={finishX} x2={finishX} y1={y + 8} y2={y + laneH - 20}
                    stroke="#222" strokeDasharray="6,4" strokeWidth="2" />
            </g>
          );
        })}

        {/* runners */}
        {list.map((c, idx) => {
          const y = paddingTop + idx * laneH + laneH / 2;
          const normalized = Math.max(0, Math.min(1, (c.score || 0) / max));
          const x = leftPad + normalized * availableTrack; // capped by availableTrack so never touches finish
          const initials = (c.initials || '')
            ? String(c.initials).toUpperCase().slice(0, 2)
            : (c.courseName ? c.courseName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : 'C');
          const color = idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#4a90e2';
          const teachersLabel = c.teachersLabel || ([c.maestro_titular?.nombre_completo, c.maestro_asistente?.nombre_completo].filter(Boolean).join(' / ')) || '—';

          return (
            <g key={c.id ?? `${c.courseName}-${idx}`} transform={`translate(${x}, ${y})`}
               onMouseEnter={() => setHoverId(c.id ?? `${idx}`)} onMouseLeave={() => setHoverId(null)}
               onClick={() => setOpen(c)} style={{ cursor: 'pointer' }}>

              {/* avatar */}
              <circle r={avatarR} fill={color} stroke="#333" strokeWidth="1" />
              <text x="0" y="8" fontSize="13" fontWeight="700" textAnchor="middle" fill="#111">{initials}</text>

              {/* medal top-right of avatar for top 3 */}
              {idx < 3 && (
                <g transform={`translate(${avatarR - 6}, ${-avatarR + 4})`}>
                  <circle r="12" fill={idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : '#cd7f32'} stroke="#333" strokeWidth="1" />
                  <text x="0" y="5" fontSize="11" fontWeight="700" textAnchor="middle" fill="#111">{idx + 1}</text>
                </g>
              )}

              {/* hover tooltip */}
              {hoverId === (c.id ?? `${idx}`) && (
                <g transform="translate(36,-54)">
                  <rect x="-8" y="-8" rx="8" width="380" height="72" fill="#fff" stroke="#ddd" />
                  <text x="6" y="8" fontSize="13" fill="#222" fontWeight="700">{c.courseName}</text>
                  <text x="6" y="26" fontSize="12" fill="#444">{teachersLabel}</text>
                  <text x="6" y="44" fontSize="12" fill="#666">
                    Score: {Math.round(c.score ?? 0)} · Asist: {c.attendance_pct ?? 0}% · Aprob: {c.grades_pct ?? 0}%
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* right column with course + teachers (fixed) */}
        {list.map((c, idx) => {
          const yTop = paddingTop + idx * laneH + 8;
          const labelX = finishX + 14;
          const teachersLabel = c.teachersLabel || ([c.maestro_titular?.nombre_completo, c.maestro_asistente?.nombre_completo].filter(Boolean).join(' / ')) || '—';

          return (
            <foreignObject key={`label-${idx}`} x={labelX} y={yTop} width={labelWidth - 8} height={laneH - 12}>
              <div className="race-item" xmlns="http://www.w3.org/1999/xhtml">
                <div className="course-name" title={c.courseName}>{c.courseName}</div>
                <div className="teachers-label" title={teachersLabel}>{teachersLabel}</div>
              </div>
            </foreignObject>
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