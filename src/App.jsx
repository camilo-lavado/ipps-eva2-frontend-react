import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Cargos from './pages/Cargos';

// Un pequeño componente para proteger las rutas
const PrivateRoute = ({ children }) => {
  const user = sessionStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas que usan el Layout */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<div>Dashboard (Próximamente)</div>} />
          <Route path="cargos" element={<Cargos />} />
          <Route path="candidatos" element={<div>Directorio de Talento</div>} />
          <Route path="entrevistadores" element={<div>Equipo de Entrevistadores</div>} />
          <Route path="agenda" element={<div>Agenda de Hoy</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}