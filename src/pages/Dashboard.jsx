import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton, TableSortLabel } from '@mui/material';
import { People, Work, Badge, CalendarMonth } from '@mui/icons-material';
import { API_BASE_URL, ESTADOS_ENTREVISTA } from '../config/api';

const formatFecha = (fechaStr) => {
  if (!fechaStr) return '—';
  return new Date(fechaStr).toLocaleString('es-CL', {
    weekday: 'long', day: '2-digit', month: '2-digit',
    year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
  });
};

export default function Dashboard() {
  const [stats, setStats] = useState({ candidatos: 0, cargos: 0, entrevistadores: 0, entrevistas: 0 });
  const [ultimasEntrevistas, setUltimasEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('fecha_hora');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resCandidatos, resCargos, resEntrevistadores, resEntrevistas] = await Promise.all([
          fetch(`${API_BASE_URL}/candidatos`),
          fetch(`${API_BASE_URL}/cargos`),
          fetch(`${API_BASE_URL}/entrevistadores`),
          fetch(`${API_BASE_URL}/entrevistas`)
        ]);

        const candidatosData = await resCandidatos.json();
        const cargosData = await resCargos.json();
        const entrevistadoresData = await resEntrevistadores.json();
        const entrevistasData = await resEntrevistas.json();

        setStats({
          candidatos: candidatosData.length || 0,
          cargos: cargosData.length || 0,
          entrevistadores: entrevistadoresData.length || 0,
          entrevistas: entrevistasData.length || 0
        });

        const cargosMap = cargosData.reduce((acc, c) => ({ ...acc, [c.id]: c.titulo }), {});
        const candidatosMap = candidatosData.reduce((acc, c) => ({ ...acc, [c.id]: `${c.nombres} ${c.apellidos}` }), {});
        const entrevistadoresMap = entrevistadoresData.reduce((acc, c) => ({ ...acc, [c.id]: `${c.nombres} ${c.apellidos}` }), {});

        const entrevistasFormateadas = entrevistasData.slice(0, 5).map(e => ({
          ...e,
          cargoNombre: cargosMap[e.cargo_id] || '—',
          candidatoNombre: candidatosMap[e.candidato_id] || '—',
          entrevistadorNombre: entrevistadoresMap[e.entrevistador_id] || '—'
        }));

        setUltimasEntrevistas(entrevistasFormateadas);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (col) => {
    setSortDir(sortBy === col && sortDir === 'asc' ? 'desc' : 'asc');
    setSortBy(col);
  };

  const entrevistasSorted = [...ultimasEntrevistas].sort((a, b) => {
    let valA, valB;
    if (sortBy === 'fecha_hora') {
      valA = new Date(a.fecha_hora || 0).getTime();
      valB = new Date(b.fecha_hora || 0).getTime();
    } else {
      const map = { cargo: 'cargoNombre', candidato: 'candidatoNombre', entrevistador: 'entrevistadorNombre', estado: 'estado' };
      valA = (a[map[sortBy]] || '').toLowerCase();
      valB = (b[map[sortBy]] || '').toLowerCase();
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <Box sx={{ backgroundColor: `${color}15`, p: 1.5, borderRadius: 2, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="bold" textTransform="uppercase">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
      </Box>
    </Paper>
  );

  const getColor = (estado) => {
    const colors = {
      [ESTADOS_ENTREVISTA.PROGRAMADA]: 'primary',
      [ESTADOS_ENTREVISTA.REALIZADA]: 'default',
      [ESTADOS_ENTREVISTA.CANCELADA]: 'error',
      [ESTADOS_ENTREVISTA.PENDIENTE]: 'warning'
    };
    return colors[estado] || 'default';
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
      <Typography variant="h5" fontWeight="bold" mb={3}>Resumen General</Typography>

      <Grid container spacing={3} mb={4}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Skeleton variant="rounded" width={52} height={52} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="rounded" width="60%" height={14} sx={{ mb: 1 }} />
                  <Skeleton variant="rounded" width="40%" height={36} />
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Candidatos" value={stats.candidatos} icon={<People sx={{ color: '#3b82f6' }} />} color="#3b82f6" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Cargos Activos" value={stats.cargos} icon={<Work sx={{ color: '#10b981' }} />} color="#10b981" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Entrevistadores" value={stats.entrevistadores} icon={<Badge sx={{ color: '#8b5cf6' }} />} color="#8b5cf6" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Entrevistas" value={stats.entrevistas} icon={<CalendarMonth sx={{ color: '#f59e0b' }} />} color="#f59e0b" />
            </Grid>
          </>
        )}
      </Grid>

      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" fontWeight="bold">Próximas Entrevistas</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><strong>ID</strong></TableCell>
                <SortCell col="cargo"         label="CARGO" />
                <SortCell col="candidato"     label="CANDIDATO" />
                <SortCell col="entrevistador" label="ENTREVISTADOR" />
                <SortCell col="fecha_hora"    label="FECHA" />
                <SortCell col="estado"        label="ESTADO" />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Skeleton variant="rounded" width="40%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width="75%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width="75%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width="70%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  {entrevistasSorted.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{row.id}</TableCell>
                      <TableCell>{row.cargoNombre}</TableCell>
                      <TableCell>{row.candidatoNombre}</TableCell>
                      <TableCell>{row.entrevistadorNombre}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{formatFecha(row.fecha_hora)}</TableCell>
                      <TableCell>
                        <Chip label={row.estado} size="small" color={getColor(row.estado)} variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {entrevistasSorted.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>No hay entrevistas programadas</TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
