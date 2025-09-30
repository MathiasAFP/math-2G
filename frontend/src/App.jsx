import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
// Componente que atua como um 'guarda de rota'
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Se não houver token, redireciona o usuário para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Se houver token, permite que o componente filho (Dashboard) seja renderizado
  return children;
};
function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/login">Login</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h2>Página Inicial</h2>} />
        {/* Rota Protegida: usa o ProtectedRoute para verificar o token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;