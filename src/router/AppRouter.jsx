import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import SelectRole from "../pages/SelectRole"; // Importar
import AdminDashboard from "../pages/admin/AdminDashboard"; // Importar
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/auth/ProtectedRoute"; // Importar

const AppRouter = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        
        {/* Ruta para nuevos usuarios */}
        <Route path="/select-role" element={user && !userProfile?.role ? <SelectRole /> : <Navigate to="/dashboard" />} />

        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Rutas de Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;