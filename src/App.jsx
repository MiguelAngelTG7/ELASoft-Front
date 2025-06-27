import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Director from "./pages/Director";
import ClasesProfesor from "./pages/ClasesProfesor";
import Asistencia from "./pages/Asistencia";
import Notas from "./pages/Notas";
import PrivateRoute from "./components/PrivateRoute";
import Alumno from './pages/Alumno';
import ReporteNotas from "./pages/ReporteNotas";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rutas protegidas por rol */}
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
          path="/alumno"
          element={
            <PrivateRoute rolRequerido="alumno">
              <Alumno />
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
