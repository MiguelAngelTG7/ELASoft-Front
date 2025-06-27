import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Director from "./pages/Director";
import ClasesProfesor from "./pages/ClasesProfesor";
import Asistencia from "./pages/Asistencia";
import Notas from "./pages/Notas";
import Alumno from "./pages/Alumno";
import ReporteNotas from "./pages/ReporteNotas";
import ReporteDirector from "./pages/ReporteDirector";
import ReporteAlumno from "./pages/ReporteAlumno";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./pages/Layout"; // AÑADIDO

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Todas las rutas con Layout (incluido Login ahora) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} /> {/* 🔄 Login aquí */}

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/director"
            element={
              <PrivateRoute rolRequerido="director">
                <Director />
              </PrivateRoute>
            }
          />

          <Route
            path="/profesor"
            element={
              <PrivateRoute rolRequerido="profesor">
                <ClasesProfesor />
              </PrivateRoute>
            }
          />

          <Route
            path="/profesor/asistencia/:claseId"
            element={
              <PrivateRoute rolRequerido="profesor">
                <Asistencia />
              </PrivateRoute>
            }
          />

          <Route
            path="/profesor/notas/:claseId"
            element={
              <PrivateRoute rolRequerido="profesor">
                <Notas />
              </PrivateRoute>
            }
          />

          <Route
            path="/profesor/notas/:claseId/reporte"
            element={
              <PrivateRoute rolRequerido="profesor">
                <ReporteNotas />
              </PrivateRoute>
            }
          />

          <Route
            path="/alumno"
            element={
              <PrivateRoute rolRequerido="alumno">
                <Alumno />
              </PrivateRoute>
            }
          />

          <Route
            path="/director/reporte"
            element={
              <PrivateRoute rolRequerido="director">
                <ReporteDirector />
              </PrivateRoute>
            }
          />

          <Route
            path="/alumno/reporte"
            element={
              <PrivateRoute rolRequerido="alumno">
                <ReporteAlumno />
              </PrivateRoute>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
