import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Skeleton, TableSortLabel, useTheme, useMediaQuery
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { cargoService } from '../services/cargoService';
import Swal from 'sweetalert2';

export default function Cargos() {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('titulo');
  const [sortDir, setSortDir] = useState('asc');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', departamento: '', estado: 1 });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => { cargarCargos(); }, []);

  const cargarCargos = async () => {
    setLoading(true);
    try {
      const data = await cargoService.getAll();
      setCargos(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (col) => {
    setSortDir(sortBy === col && sortDir === 'asc' ? 'desc' : 'asc');
    setSortBy(col);
  };

  const cargosSorted = [...cargos].sort((a, b) => {
    const valA = (a[sortBy] ?? '').toString().toLowerCase();
    const valB = (b[sortBy] ?? '').toString().toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOpen = (cargo = null) => {
    if (cargo) {
      setEditId(cargo.id);
      setFormData({ titulo: cargo.titulo, departamento: cargo.departamento, estado: cargo.estado });
    } else {
      setEditId(null);
      setFormData({ titulo: '', departamento: '', estado: 1 });
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
      Swal.fire({ icon: 'success', title: editId ? 'Cargo actualizado exitosamente' : 'Cargo registrado exitosamente', showConfirmButton: false, timer: 1500 });
    } catch {
      Swal.fire({ title: 'Error de Conexión', text: 'Hubo un problema al intentar guardar la información del cargo.', icon: 'error', confirmButtonColor: '#1976d2' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?', text: "Esta acción no se puede deshacer.",
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        const response = await cargoService.delete(id);
        if (!response.ok) throw new Error();
        cargarCargos();
        Swal.fire({ title: '¡Eliminado!', text: 'El cargo ha sido eliminado correctamente.', icon: 'success', confirmButtonColor: '#1976d2' });
      } catch {
        Swal.fire({ title: 'Error', text: 'No se pudo eliminar el cargo. Es posible que tenga entrevistas asociadas.', icon: 'error', confirmButtonColor: '#1976d2' });
      }
    }
  };

  const SortCell = ({ col, label, sx: sxProp }) => (
    <TableCell sx={sxProp}>
      <TableSortLabel active={sortBy === col} direction={sortBy === col ? sortDir : 'asc'} onClick={() => handleSort(col)}>
        <strong>{label}</strong>
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 }, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Gestión de Cargos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Nuevo Cargo</Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <SortCell col="id"           label="ID" sx={{ display: { xs: 'none', sm: 'table-cell' } }} />
              <SortCell col="titulo"       label="TÍTULO DEL CARGO" />
              <SortCell col="departamento" label="DEPARTAMENTO" />
              <SortCell col="estado"       label="ESTADO" />
              <TableCell align="right"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Skeleton variant="rounded" width="40%" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width="80%" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width="70%" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={72} height={24} /></TableCell>
                  <TableCell align="right"><Skeleton variant="rounded" width={64} height={32} sx={{ ml: 'auto' }} /></TableCell>
                </TableRow>
              ))
            ) : (
              cargosSorted.map((cargo) => (
                <TableRow key={cargo.id} hover>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{cargo.id}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight="bold">{cargo.titulo}</Typography></TableCell>
                  <TableCell>{cargo.departamento}</TableCell>
                  <TableCell>
                    <Chip label={cargo.estado === 1 ? 'Activo' : 'Inactivo'} size="small" color={cargo.estado === 1 ? 'success' : 'default'} variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(cargo)} color="primary" size="small"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(cargo.id)} color="error" size="small"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={fullScreen}>
        <DialogTitle>{editId ? 'Editar Cargo' : 'Nuevo Cargo'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Título del Cargo" fullWidth value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
            <TextField label="Departamento" fullWidth value={formData.departamento} onChange={(e) => setFormData({...formData, departamento: e.target.value})} />
            <TextField select label="Estado Inicial" fullWidth value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})}>
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
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
