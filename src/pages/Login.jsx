import { useState } from 'react';
import { 
  Box, Paper, TextField, Button, Typography, Container, 
  Alert, CircularProgress, InputAdornment, IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorApi, setErrorApi] = useState('');
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const navigate = useNavigate();

  const validarFormulario = () => {
    let nuevosErrores = {};
    if (!nombreUsuario.trim()) {
      nuevosErrores.nombreUsuario = 'El nombre de usuario es obligatorio';
    }
    if (!password) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    } else if (password.length < 4) {
      nuevosErrores.password = 'La contraseña debe tener al menos 4 caracteres';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorApi('');

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: nombreUsuario, password })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('user', JSON.stringify(data.usuario));
        
        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido!`,
          showConfirmButton: false,
          timer: 1500
        });

        navigate('/');
      } else {
        setErrorApi(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setErrorApi('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f5f7fa', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 0)',
      backgroundSize: '40px 40px'
    }}>
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              RecruitApi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Consola de Administración de Reclutamiento
            </Typography>
          </Box>

          {errorApi && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorApi}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              variant="outlined"
              margin="normal"
              value={nombreUsuario}
              onChange={(e) => {
                setNombreUsuario(e.target.value);
                if (errores.nombreUsuario) setErrores({ ...errores, nombreUsuario: null });
              }}
              error={!!errores.nombreUsuario}
              helperText={errores.nombreUsuario}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color={errores.nombreUsuario ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errores.password) setErrores({ ...errores, password: null });
              }}
              error={!!errores.password}
              helperText={errores.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color={errores.password ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 4, 
                py: 1.8, 
                borderRadius: 2, 
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Acceder al Sistema'}
            </Button>
          </form>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4 }}>
            RecruitAPI v2.0 &copy; 2026 - IP San Sebastián
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}