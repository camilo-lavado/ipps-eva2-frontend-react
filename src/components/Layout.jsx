import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import { Dashboard, Work, People, Badge, CalendarMonth, Logout } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const menuItems = [
  { text: 'Inicio', icon: <Dashboard />, path: '/' },
  { text: 'Cargos', icon: <Work />, path: '/cargos' },
  { text: 'Candidatos', icon: <People />, path: '/candidatos' },
  { text: 'Entrevistadores', icon: <Badge />, path: '/entrevistadores' },
  { text: 'Agenda', icon: <CalendarMonth />, path: '/agenda' }
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1a2332',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            RecruitApi
          </Typography>
          <Typography variant="caption" color="gray">
            ADMIN CONSOLE
          </Typography>
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? '#1976d2' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? '#1565c0' : 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'white' : '#94a3b8', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? 'white' : '#cbd5e1'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', p: 3 }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 2, color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}>
              <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: '0.9rem' }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent', borderBottom: '1px solid #e2e8f0', color: 'text.primary' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              {menuItems.find(m => m.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1 }}>
                  Admin User
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recruiter Lead
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#1976d2', width: 35, height: 35 }}>A</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}