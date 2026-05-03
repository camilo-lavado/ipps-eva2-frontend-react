import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip,
  FormControl, InputLabel, OutlinedInput, FormHelperText
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { entrevistaService } from '../services/entrevistaService';
import { cargoService } from '../services/cargoService';
import { candidatoService } from '../services/candidatoService';
import { entrevistadorService } from '../services/entrevistadorService';
import Swal from 'sweetalert2';

export default function Agenda() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [cargosList, setCargosList] = useState([]);
  const [candidatosList, setCandidatosList] = useState([]);
  const [entrevistadoresList, setEntrevistadoresList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ 
    cargo_id: '', candidato_id: '', entrevistador_id: '', 
    fecha_hora: '', estado: 'PROGRAMADA', observaciones: '' 
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [entr, carg, cand, entrev] = await Promise.all([
        entrevistaService.getAll(),
        cargoService.getAll(),
        candidatoService.getAll(),
        entrevistadorService.getAll()
      ]);

      setEntrevistas(Array.isArray(entr) ? entr : []);
      setCargosList(Array.isArray(carg) ? carg : []);
      setCandidatosList(Array.isArray(cand) ? cand : []);
      setEntrevistadoresList(Array.isArray(entrev) ? entrev : []);
    } catch (error) {
      console.error(error);
    }
  };

  const validar = () => {
    let e = {};
    if (!formData.cargo_id) e.cargo_id = 'Seleccione un cargo';
    if (!formData.candidato_id) e.candidato_id = 'Seleccione un candidato';
    if (!formData.entrevistador_id) e.entrevistador_id = 'Asigne un entrevistador';
    if (!formData.fecha_hora) e.fecha_hora = 'La fecha y hora son obligatorias';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleOpen = (ent = null) => {
    if (ent) {
      setEditId(ent.id);
      const fechaFormat = ent.fecha_hora ? ent.fecha_hora.substring(0, 16) : '';
      setFormData({ 
        cargo_id: ent.cargo_id, candidato_id: ent.candidato_id, 
        entrevistador_id: ent.entrevistador_id, fecha_hora: fechaFormat, 
        estado: ent.estado || 'PROGRAMADA', observaciones: ent.observaciones || '' 
      });
    } else {
      setEditId(null);
      setFormData({ 
        cargo_id: '', candidato_id: '', entrevistador_id: '', 
        fecha_hora: '', estado: 'PROGRAMADA', observaciones: '' 
      });
    }
    setErrores({});
    setOpen(true);
  };

  const handleSave = async () => {
    if (!validar()) return;
    try {
      if (editId) {
        await entrevistaService.update(editId, formData);
      } else {
        await entrevistaService.create(formData);
      }
      setOpen(false);
      cargarTodo();
      Swal.fire({
        icon: 'success',
        title: editId ? 'Entrevista actualizada' : 'Entrevista agendada con éxito',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al guardar la entrevista.',
        icon: 'error',
        confirmButtonColor: '#1976d2'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Cancelar Entrevista?',
      text: "Se eliminará este registro de la agenda de forma permanente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, cancelar y eliminar',
      cancelButtonText: 'Volver'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/entrevistas/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('El servidor rechazó la eliminación');
        }
        cargarTodo();
        Swal.fire({
          title: '¡Eliminada!',
          text: 'La entrevista ha sido removida de la agenda.',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al intentar eliminar la entrevista.',
          icon: 'error',
          confirmButtonColor: '#1976d2'
        });
      }
    }
  };

  const getCargoNombre = (id) => cargosList.find(c => c.id === id)?.titulo || 'Desconocido';
  const getCandidatoNombre = (id) => {
    const c = candidatosList.find(c => c.id === id);
    return c ? `${c.nombres} ${c.apellidos}` : 'Desconocido';
  };
  const getEntrevistadorNombre = (id) => {
    const e = entrevistadoresList.find(e => e.id === id);
    return e ? `${e.nombres} ${e.apellidos}` : 'Desconocido';
  };

  const getColor = (estado) => {
    const colors = { 'PROGRAMADA': 'primary', 'REALIZADA': 'default', 'CANCELADA': 'error', 'PENDIENTE': 'warning' };
    return colors[estado] || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Agenda de Hoy</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Agendar Entrevista
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>FECHA Y HORA</strong></TableCell>
              <TableCell><strong>CARGO</strong></TableCell>
              <TableCell><strong>CANDIDATO</strong></TableCell>
              <TableCell><strong>ENTREVISTADOR</strong></TableCell>
              <TableCell><strong>ESTADO</strong></TableCell>
              <TableCell align="right"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entrevistas.map((ent) => (
              <TableRow key={ent.id} hover>
                <TableCell fontWeight="bold">
                  {ent.fecha_hora ? ent.fecha_hora.substring(0, 16).replace('T', ' ') : '—'}
                </TableCell>
                <TableCell>{getCargoNombre(ent.cargo_id)}</TableCell>
                <TableCell>{getCandidatoNombre(ent.candidato_id)}</TableCell>
                <TableCell>{getEntrevistadorNombre(ent.entrevistador_id)}</TableCell>
                <TableCell>
                  <Chip label={ent.estado} size="small" color={getColor(ent.estado)} variant="soft" />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(ent)} color="primary"><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(ent.id)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold">{editId ? 'Editar Entrevista' : 'Agendar Entrevista'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField select label="Cargo / Posición abierta" fullWidth value={formData.cargo_id}
              onChange={(e) => setFormData({...formData, cargo_id: e.target.value})}
              error={!!errores.cargo_id} helperText={errores.cargo_id}
            >
              {cargosList.map(c => <MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>)}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField select label="Buscar candidato..." fullWidth value={formData.candidato_id}
                onChange={(e) => setFormData({...formData, candidato_id: e.target.value})}
                error={!!errores.candidato_id} helperText={errores.candidato_id}
              >
                {candidatosList.map(c => <MenuItem key={c.id} value={c.id}>{c.nombres} {c.apellidos}</MenuItem>)}
              </TextField>

              <TextField select label="Asignar evaluador..." fullWidth value={formData.entrevistador_id}
                onChange={(e) => setFormData({...formData, entrevistador_id: e.target.value})}
                error={!!errores.entrevistador_id} helperText={errores.entrevistador_id}
              >
                {entrevistadoresList.map(e => <MenuItem key={e.id} value={e.id}>{e.nombres} {e.apellidos}</MenuItem>)}
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth error={!!errores.fecha_hora}>
                <InputLabel shrink htmlFor="fecha-hora-input">
                  Fecha y Hora
                </InputLabel>
                <OutlinedInput
                  id="fecha-hora-input"
                  type="datetime-local"
                  notched
                  label="Fecha y Hora"
                  value={formData.fecha_hora}
                  onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})}
                />
                {errores.fecha_hora && (
                  <FormHelperText>{errores.fecha_hora}</FormHelperText>
                )}
              </FormControl>

              <TextField select label="Estado" fullWidth value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
              >
                <MenuItem value="PROGRAMADA">Programada</MenuItem>
                <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                <MenuItem value="REALIZADA">Realizada</MenuItem>
                <MenuItem value="CANCELADA">Cancelada</MenuItem>
              </TextField>
            </Box>

            <TextField label="Notas / Observaciones" fullWidth multiline rows={2} value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}