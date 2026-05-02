import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: nombreUsuario, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos la sesión igual que antes, pero ahora en formato objeto
        sessionStorage.setItem('user', JSON.stringify(data.usuario));
        navigate('/'); // Redirigimos al Dashboard
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              RecruitApi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de Reclutamiento
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              variant="outlined"
              margin="normal"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}