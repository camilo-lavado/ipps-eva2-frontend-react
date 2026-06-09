import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip,
  FormControl, InputLabel, OutlinedInput, FormHelperText, Alert,
  Skeleton, TableSortLabel, useTheme, useMediaQuery
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { entrevistaService } from '../services/entrevistaService';
import { cargoService } from '../services/cargoService';
import { candidatoService } from '../services/candidatoService';
import { entrevistadorService } from '../services/entrevistadorService';
import Swal from 'sweetalert2';
import { ESTADOS_ENTREVISTA } from '../config/api';

const formatFecha = (fechaStr) => {
  if (!fechaStr) return '—';
  return new Date(fechaStr).toLocaleString('es-CL', {
    weekday: 'long', day: '2-digit', month: '2-digit',
    year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
  });
};

export default function Agenda() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargosList, setCargosList] = useState([]);
  const [candidatosList, setCandidatosList] = useState([]);
  const [entrevistadoresList, setEntrevistadoresList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [apiError, setApiError] = useState('');
  const [sortBy, setSortBy] = useState('fecha_hora');
  const [sortDir, setSortDir] = useState('asc');
  const [formData, setFormData] = useState({
    cargo_id: '', candidato_id: '', entrevistador_id: '',
    fecha_hora: '', estado: ESTADOS_ENTREVISTA.PROGRAMADA, observaciones: ''
  });
  const [errores, setErrores] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (col) => {
    setSortDir(sortBy === col && sortDir === 'asc' ? 'desc' : 'asc');
    setSortBy(col);
  };

  const getCargoNombre = (id) => cargosList.find(c => c.id === id)?.titulo || '';
  const getCandidatoNombre = (id) => {
    const c = candidatosList.find(c => c.id === id);
    return c ? `${c.nombres} ${c.apellidos}` : '';
  };
  const getEntrevistadorNombre = (id) => {
    const e = entrevistadoresList.find(e => e.id === id);
    return e ? `${e.nombres} ${e.apellidos}` : '';
  };

  const entrevistasSorted = [...entrevistas].sort((a, b) => {
    let valA, valB;
    if (sortBy === 'fecha_hora') {
      valA = new Date(a.fecha_hora || 0).getTime();
      valB = new Date(b.fecha_hora || 0).getTime();
    } else if (sortBy === 'cargo') {
      valA = getCargoNombre(a.cargo_id).toLowerCase();
      valB = getCargoNombre(b.cargo_id).toLowerCase();
    } else if (sortBy === 'candidato') {
      valA = getCandidatoNombre(a.candidato_id).toLowerCase();
      valB = getCandidatoNombre(b.candidato_id).toLowerCase();
    } else if (sortBy === 'entrevistador') {
      valA = getEntrevistadorNombre(a.entrevistador_id).toLowerCase();
      valB = getEntrevistadorNombre(b.entrevistador_id).toLowerCase();
    } else if (sortBy === 'estado') {
      valA = a.estado || '';
      valB = b.estado || '';
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const validar = () => {
    let nuevosErrores = {};
    if (!formData.cargo_id) nuevosErrores.cargo_id = 'Seleccione un cargo';
    if (!formData.candidato_id) nuevosErrores.candidato_id = 'Seleccione un candidato';
    if (!formData.entrevistador_id) nuevosErrores.entrevistador_id = 'Asigne un entrevistador';
    if (!formData.fecha_hora) nuevosErrores.fecha_hora = 'La fecha y hora son obligatorias';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleOpen = (entrevista = null) => {
    if (entrevista) {
      setEditId(entrevista.id);
      const fechaFormat = entrevista.fecha_hora ? entrevista.fecha_hora.substring(0, 16) : '';
      setFormData({
        cargo_id: entrevista.cargo_id, candidato_id: entrevista.candidato_id,
        entrevistador_id: entrevista.entrevistador_id, fecha_hora: fechaFormat,
        estado: entrevista.estado || ESTADOS_ENTREVISTA.PROGRAMADA, observaciones: entrevista.observaciones || ''
      });
    } else {
      setEditId(null);
      setFormData({
        cargo_id: '', candidato_id: '', entrevistador_id: '',
        fecha_hora: '', estado: ESTADOS_ENTREVISTA.PROGRAMADA, observaciones: ''
      });
    }
    setErrores({});
    setApiError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setApiError('');
    if (!validar()) return;

    try {
      let response;
      if (editId) {
        response = await entrevistaService.update(editId, formData);
      } else {
        response = await entrevistaService.create(formData);
      }

      if (response.error) {
        setApiError(response.error);
        return;
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
        title: 'Error de Conexión',
        text: 'Hubo un problema al intentar guardar la entrevista.',
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
        const response = await entrevistaService.delete(id);
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

  const getColor = (estado) => {
    const colors = {
      [ESTADOS_ENTREVISTA.PROGRAMADA]: 'primary',
      [ESTADOS_ENTREVISTA.REALIZADA]: 'default',
      [ESTADOS_ENTREVISTA.CANCELADA]: 'error',
      [ESTADOS_ENTREVISTA.PENDIENTE]: 'warning'
    };
    return colors[estado] || 'default';
  };

  const SortCell = ({ col, label, align, sx: sxProp }) => (
    <TableCell align={align} sx={sxProp}>
      <TableSortLabel
        active={sortBy === col}
        direction={sortBy === col ? sortDir : 'asc'}
        onClick={() => handleSort(col)}
      >
        <strong>{label}</strong>
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 }, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Agenda de Hoy</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Agendar Entrevista
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <SortCell col="fecha_hora" label="FECHA Y HORA" />
              <SortCell col="cargo"      label="CARGO" />
              <SortCell col="candidato"  label="CANDIDATO" />
              <SortCell col="entrevistador" label="ENTREVISTADOR" sx={{ display: { xs: 'none', md: 'table-cell' } }} />
              <SortCell col="estado"     label="ESTADO" />
              <TableCell align="right"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton variant="rounded" width="70%" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width="75%" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width="80%" /></TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="rounded" width="75%" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                  <TableCell align="right"><Skeleton variant="rounded" width={64} height={32} sx={{ ml: 'auto' }} /></TableCell>
                </TableRow>
              ))
            ) : (
              entrevistasSorted.map((entrevista) => (
                <TableRow key={entrevista.id} hover>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {formatFecha(entrevista.fecha_hora)}
                  </TableCell>
                  <TableCell>{getCargoNombre(entrevista.cargo_id)}</TableCell>
                  <TableCell>{getCandidatoNombre(entrevista.candidato_id)}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{getEntrevistadorNombre(entrevista.entrevistador_id)}</TableCell>
                  <TableCell>
                    <Chip label={entrevista.estado} size="small" color={getColor(entrevista.estado)} variant="soft" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(entrevista)} color="primary"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(entrevista.id)} color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={fullScreen}>
        <DialogTitle fontWeight="bold">{editId ? 'Editar Entrevista' : 'Agendar Entrevista'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {apiError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{apiError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField select label="Cargo / Posición abierta" fullWidth value={formData.cargo_id}
              onChange={(e) => setFormData({...formData, cargo_id: e.target.value})}
              error={!!errores.cargo_id} helperText={errores.cargo_id}
            >
              {cargosList.map(c => <MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>)}
            </TextField>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <FormControl fullWidth error={!!errores.fecha_hora}>
                <InputLabel shrink htmlFor="fecha-hora-input">Fecha y Hora</InputLabel>
                <OutlinedInput
                  id="fecha-hora-input"
                  type="datetime-local"
                  notched
                  label="Fecha y Hora"
                  value={formData.fecha_hora}
                  onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})}
                />
                {errores.fecha_hora && <FormHelperText>{errores.fecha_hora}</FormHelperText>}
              </FormControl>

              <TextField select label="Estado" fullWidth value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
              >
                <MenuItem value={ESTADOS_ENTREVISTA.PROGRAMADA}>Programada</MenuItem>
                <MenuItem value={ESTADOS_ENTREVISTA.PENDIENTE}>Pendiente</MenuItem>
                <MenuItem value={ESTADOS_ENTREVISTA.REALIZADA}>Realizada</MenuItem>
                <MenuItem value={ESTADOS_ENTREVISTA.CANCELADA}>Cancelada</MenuItem>
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
