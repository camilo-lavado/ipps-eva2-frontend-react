import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, Chip 
} from '@mui/material';
import { Add, Edit, Delete, ContactMail } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { entrevistadorService } from '../services/entrevistadorService';

export default function Entrevistadores() {
  const [entrevistadores, setEntrevistadores] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ nombres: '', apellidos: '', email: '', especialidad: '' });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarEntrevistadores();
  }, []);

  const cargarEntrevistadores = async () => {
    const data = await entrevistadorService.getAll();
    setEntrevistadores(Array.isArray(data) ? data : []);
  };

  const validar = () => {
    let e = {};
    if (!formData.nombres.trim()) e.nombres = 'Requerido';
    if (!formData.email.includes('@')) e.email = 'Email inválido';
    if (!formData.especialidad.trim()) e.especialidad = 'Defina una especialidad';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleOpen = (ent = null) => {
    if (ent) {
      setEditId(ent.id);
      setFormData({ nombres: ent.nombres, apellidos: ent.apellidos, email: ent.email, especialidad: ent.especialidad });
    } else {
      setEditId(null);
      setFormData({ nombres: '', apellidos: '', email: '', especialidad: '' });
    }
    setErrores({});
    setOpen(true);
  };

  const handleSave = async () => {
    if (!validar()) return;
    
    try {
      if (editId) {
        await entrevistadorService.update(editId, formData);
      } else {
        await entrevistadorService.create(formData);
      }
      setOpen(false);
      cargarEntrevistadores();
      
      Swal.fire({
        icon: 'success',
        title: editId ? 'Perfil actualizado' : 'Entrevistador registrado',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la información del entrevistador.',
        icon: 'error',
        confirmButtonColor: '#1976d2'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Remover entrevistador?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Usamos nuestro servicio en lugar del fetch manual
        const response = await entrevistadorService.delete(id);
        
        // Validamos si la base de datos lo rechazó (Error 500)
        if (!response.ok) {
          throw new Error('El servidor rechazó la eliminación');
        }

        cargarEntrevistadores();
        Swal.fire({
          title: '¡Removido!',
          text: 'El entrevistador ha sido eliminado del equipo.',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar (verifica si tiene entrevistas asignadas).',
          icon: 'error',
          confirmButtonColor: '#1976d2'
        });
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Equipo de Entrevistadores</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo Entrevistador
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>NOMBRE COMPLETO</strong></TableCell>
              <TableCell><strong>CORREO</strong></TableCell>
              <TableCell><strong>ESPECIALIDAD</strong></TableCell>
              <TableCell align="right"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entrevistadores.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{e.id}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{`${e.nombres} ${e.apellidos}`}</TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>
                  <Chip label={e.especialidad} size="small" color="info" variant="soft" />
                </TableCell>
               <TableCell align="right">
                  <IconButton onClick={() => handleOpen(e)} color="primary"><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(e.id)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Editar Entrevistador' : 'Nuevo Entrevistador'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nombres" fullWidth value={formData.nombres} error={!!errores.nombres} helperText={errores.nombres}
              onChange={(e) => setFormData({...formData, nombres: e.target.value})} />
            <TextField label="Apellidos" fullWidth value={formData.apellidos}
              onChange={(e) => setFormData({...formData, apellidos: e.target.value})} />
            <TextField label="Email" fullWidth value={formData.email} error={!!errores.email} helperText={errores.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <TextField label="Especialidad" fullWidth value={formData.especialidad} error={!!errores.especialidad} helperText={errores.especialidad}
              onChange={(e) => setFormData({...formData, especialidad: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}