import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Cargos from './pages/Cargos';
import Dashboard from './pages/Dashboard';
import Candidatos from './pages/Candidatos';
import Entrevistadores from './pages/Entrevistadores';
import Agenda from './pages/Agenda';

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
          <Route index element={<Dashboard />} />
          <Route path="cargos" element={<Cargos />} />
          <Route path="candidatos" element={<Candidatos />} />
          <Route path="entrevistadores" element={<Entrevistadores />} />
          <Route path="agenda" element={<Agenda />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}