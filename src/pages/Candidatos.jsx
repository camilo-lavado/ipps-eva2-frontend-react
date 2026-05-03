import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Alert, Avatar, IconButton 
} from '@mui/material';
import { Add, Person, Edit, Delete } from '@mui/icons-material';
import { candidatoService } from '../services/candidatoService';
import Swal from 'sweetalert2';

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [apiError, setApiError] = useState('');
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', email: '', telefono: ''
  });

  // Estado para los errores en tiempo real
  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarCandidatos();
  }, []);

  const cargarCandidatos = async () => {
    const data = await candidatoService.getAll();
    setCandidatos(Array.isArray(data) ? data : []);
  };

//Validaciones
  const validarFormulario = () => {
    let nuevosErrores = {};
    let esValido = true;

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'El nombre es obligatorio';
      esValido = false;
    }
    
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'El apellido es obligatorio';
      esValido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
      esValido = false;
    } else if (!emailRegex.test(formData.email)) {
      nuevosErrores.email = 'Formato de email inválido (ej: usuario@correo.com)';
      esValido = false;
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errores[name]) {
      setErrores({ ...errores, [name]: null });
    }
  };

  const handleOpen = (cand = null) => {
    if (cand) {
      setEditId(cand.id);
      setFormData({ nombres: cand.nombres, apellidos: cand.apellidos, email: cand.email, telefono: cand.telefono });
    } else {
      setEditId(null);
      setFormData({ nombres: '', apellidos: '', email: '', telefono: '' });
    }
    setErrores({});
    setApiError('');
    setOpen(true);
  };

 const handleSave = async () => {
    setApiError('');
    if (!validarFormulario()) return;

    try {
      let response;
      if (editId) {
        response = await candidatoService.update(editId, formData);
      } else {
        response = await candidatoService.create(formData);
      }

      if (response.error) {
        setApiError(response.error); 
      } else {
        setOpen(false);
        setFormData({ nombres: '', apellidos: '', email: '', telefono: '' });
        cargarCandidatos();
        
        Swal.fire({
          icon: 'success',
          title: editId ? 'Candidato actualizado' : 'Candidato registrado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Hubo un problema al intentar guardar el candidato.',
        icon: 'error',
        confirmButtonColor: '#1976d2'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar candidato?',
      text: "Esta acción no se puede deshacer y eliminará su historial.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
          const response = await candidatoService.delete(id);
        if (!response.ok) {
          throw new Error('El servidor rechazó la eliminación');
        }

        cargarCandidatos();
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El candidato ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        });
      } catch (error) {
        Swal.fire({
          title: 'No se pudo eliminar',
          text: 'El candidato tiene entrevistas asociadas en la Agenda. Bórrelas primero.',
          icon: 'error',
          confirmButtonColor: '#1976d2'
        });
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Directorio de Candidatos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo Candidato
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>PERFIL</strong></TableCell>
              <TableCell><strong>NOMBRES</strong></TableCell>
              <TableCell><strong>APELLIDOS</strong></TableCell>
              <TableCell><strong>EMAIL</strong></TableCell>
              <TableCell><strong>TELÉFONO</strong></TableCell>
              <TableCell align="right"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidatos.map((cand) => (
              <TableRow key={cand.id} hover>
                <TableCell>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                    <Person fontSize="small" />
                  </Avatar>
                </TableCell>
                <TableCell fontWeight="bold">{cand.nombres}</TableCell>
                <TableCell>{cand.apellidos}</TableCell>
                <TableCell>{cand.email}</TableCell>
                <TableCell>{cand.telefono}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(cand)} color="primary" size="small"><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(cand.id)} color="error" size="small"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold">{editId ? 'Editar Candidato' : 'Agregar Nuevo Candidato'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              label="Nombres" 
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              error={!!errores.nombres}
              helperText={errores.nombres}
              fullWidth 
            />
            <TextField 
              label="Apellidos" 
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={!!errores.apellidos}
              helperText={errores.apellidos}
              fullWidth 
            />
            <TextField 
              label="Correo Electrónico" 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errores.email}
              helperText={errores.email}
              fullWidth 
            />
            <TextField 
              label="Teléfono" 
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              fullWidth 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disableElevation>Guardar Candidato</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}