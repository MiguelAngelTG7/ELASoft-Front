import './Appstyle.css';
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
import AsignarAlumnos from "./pages/AsignarAlumnos";
import BuscarAlumnos from "./pages/BuscarAlumnos";
import RegistrarAlumno from "./pages/RegistrarAlumno";
import CrearAlumno from "./pages/CrearAlumno";
import ListaAlumnos from "./pages/ListaAlumnos";


import PrivateRoute from "./components/PrivateRoute";
import Layout from "./pages/Layout"; 

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

          <Route
            path="/profesor/asignar-alumnos/:claseId"
            element={
              <PrivateRoute rolRequerido="profesor">
                <AsignarAlumnos />
              </PrivateRoute>
            }
          />

          <Route
            path="/profesor/clases/:claseId/buscar"
            element={
              <PrivateRoute rolRequerido="profesor">
                <BuscarAlumnos />
              </PrivateRoute>
            }
          />

          <Route
            path="/profesor/clase/:claseId/registrar-alumno"
            element={
              <PrivateRoute rolRequerido="profesor">
                <RegistrarAlumno />
              </PrivateRoute>
            }
          />

          <Route
            path="/profesor/crear-alumno"
            element={
              <PrivateRoute rolRequerido="profesor">
                <CrearAlumno />
              </PrivateRoute>
            }
          />

          <Route path="/profesor/alumnos" element={<ListaAlumnos />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
