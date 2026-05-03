import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { cargoService } from '../services/cargoService';
import Swal from 'sweetalert2';

export default function Cargos() {
  const [cargos, setCargos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', departamento: '', estado: 'ABIERTO' });


  useEffect(() => {
    cargarCargos();
  }, []);

  const cargarCargos = async () => {
    const data = await cargoService.getAll();
    setCargos(Array.isArray(data) ? data : []);
  };


  const handleOpen = (cargo = null) => {
    if (cargo) {
      setEditId(cargo.id);
      setFormData({ titulo: cargo.titulo, departamento: cargo.departamento, estado: cargo.estado });
    } else {
      setEditId(null);
      setFormData({ titulo: '', departamento: '', estado: 'ABIERTO' });
    }
    setOpen(true);
  };


  const handleSave = async () => {
    try {
      if (editId) {
        await cargoService.update(editId, formData);
      } else {
        await cargoService.create(formData);
      }
      setOpen(false);
      cargarCargos();

      Swal.fire({
        icon: 'success',
        title: editId ? 'Cargo actualizado exitosamente' : 'Cargo registrado exitosamente',
        showConfirmButton: false,
        timer: 1500
      });

    } catch (error) {
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Hubo un problema al intentar guardar la información del cargo.',
        icon: 'error',
        confirmButtonColor: '#1976d2'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await cargoService.delete(id);
        if (!response.ok) {
          throw new Error('El servidor rechazó la eliminación');
        }

        cargarCargos();
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El cargo ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el cargo. Es posible que tenga entrevistas asociadas.',
          icon: 'error',
          confirmButtonColor: '#1976d2'
        });
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Gestión de Cargos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo Cargo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>TÍTULO DEL CARGO</strong></TableCell>
              <TableCell><strong>DEPARTAMENTO</strong></TableCell>
              <TableCell><strong>ESTADO</strong></TableCell>
              <TableCell align="right"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargos.map((cargo) => (
              <TableRow key={cargo.id} hover>
                <TableCell>{cargo.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{cargo.titulo}</Typography>
                </TableCell>
                <TableCell>{cargo.departamento}</TableCell>
                <TableCell>
                  <Chip 
                    label={cargo.estado} 
                    size="small" 
                    color={cargo.estado === 'ABIERTO' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(cargo)} color="primary" size="small"><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(cargo.id)} color="error" size="small"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Editar Cargo' : 'Nuevo Cargo'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              label="Título del Cargo" 
              fullWidth 
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            />
            <TextField 
              label="Departamento" 
              fullWidth 
              value={formData.departamento}
              onChange={(e) => setFormData({...formData, departamento: e.target.value})}
            />
            <TextField 
              select 
              label="Estado Inicial" 
              fullWidth 
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
            >
              <MenuItem value="ABIERTO">Activo / Abierto</MenuItem>
              <MenuItem value="CERRADO">Inactivo / Cerrado</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}